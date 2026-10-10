import { prisma } from "../lib/prisma";
import { UserRole } from "../generated/prisma/enums";
import { AppError } from "../utils/app-error";
import { hashPassword } from "../utils/password";
import type { PaginationMeta } from "../types/pagination";

const VOTER_PAGE_SIZE = 10;

interface CreateVoterInput {
  username: string;
  password: string;
  name: string;
  electionIds?: number[] | undefined;
}

interface UpdateVoterInput {
  username?: string | undefined;
  password?: string | undefined;
  name?: string | undefined;
}

interface GetVotersOptions {
  electionId?: number | undefined;
  search?: string | undefined;
  page?: number | undefined;
}

const createVoter = async (
  input: CreateVoterInput,
  creatorId: number,
  creatorRole: UserRole,
): Promise<unknown> => {
  if (creatorRole === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk membuat voter.",
      403,
    );
  }

  if (!input.username || typeof input.username !== "string") {
    throw new AppError("Username voter wajib diisi.", 400);
  }

  if (!input.password || typeof input.password !== "string") {
    throw new AppError("Password voter wajib diisi.", 400);
  }

  if (!input.name || typeof input.name !== "string") {
    throw new AppError("Name voter wajib diisi.", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { username: input.username },
  });

  if (existingUser) {
    throw new AppError("Username sudah terdaftar.", 409);
  }

  const uniqueElectionIds =
    input.electionIds && input.electionIds.length > 0
      ? Array.from(new Set(input.electionIds))
      : [];

  if (uniqueElectionIds.length > 0) {
    const elections = await prisma.election.findMany({
      where: { id: { in: uniqueElectionIds } },
    });

    if (elections.length !== uniqueElectionIds.length) {
      throw new AppError("Satu atau lebih election tidak ditemukan.", 404);
    }

    if (creatorRole === UserRole.ADMIN) {
      const adminAssignments = await prisma.electionAdmin.findMany({
        where: {
          userId: creatorId,
          electionId: { in: uniqueElectionIds },
        },
      });

      if (adminAssignments.length !== uniqueElectionIds.length) {
        throw new AppError(
          "Forbidden: Anda hanya dapat mendaftarkan voter pada election yang Anda kelola.",
          403,
        );
      }
    }
  }

  const hashedPassword = await hashPassword(input.password);

  return prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        username: input.username,
        password: hashedPassword,
        name: input.name,
        role: UserRole.VOTER,
        createdById: creatorId,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            id: true,
            username: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (uniqueElectionIds.length > 0) {
      await tx.electionVoter.createMany({
        data: uniqueElectionIds.map((electionId) => ({
          electionId,
          userId: newUser.id,
          hasVoted: false,
        })),
      });
    }

    const electionVoters = await tx.electionVoter.findMany({
      where: { userId: newUser.id },
      include: {
        election: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return {
      ...newUser,
      electionVoters,
    };
  });
};

const getVoters = async (
  userId: number,
  role: UserRole,
  options?: GetVotersOptions,
): Promise<{ voters: unknown[]; meta: PaginationMeta }> => {
  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki akses ke resource ini.",
      403,
    );
  }

  const page = options?.page && options.page > 1 ? options.page : 1;

  if (role === UserRole.ADMIN && options?.electionId) {
    const isAssigned = await prisma.electionAdmin.findUnique({
      where: {
        electionId_userId: {
          electionId: options.electionId,
          userId,
        },
      },
    });

    if (!isAssigned) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke election ini.",
        403,
      );
    }
  }

  let whereClause: Record<string, unknown> = { role: UserRole.VOTER };

  if (role === UserRole.SUPER_ADMIN) {
    if (options?.electionId) {
      whereClause.electionVoters = {
        some: { electionId: options.electionId },
      };
    }
    if (options?.search) {
      whereClause.OR = [
        { username: { contains: options.search, mode: "insensitive" } },
        { name: { contains: options.search, mode: "insensitive" } },
      ];
    }
  } else if (role === UserRole.ADMIN) {
    if (options?.electionId) {
      whereClause = {
        role: UserRole.VOTER,
        electionVoters: {
          some: { electionId: options.electionId },
        },
      };
    } else {
      whereClause = {
        role: UserRole.VOTER,
        OR: [
          { createdById: userId },
          {
            electionVoters: {
              some: {
                election: {
                  electionAdmins: {
                    some: { userId },
                  },
                },
              },
            },
          },
        ],
      };
    }

    if (options?.search) {
      whereClause = {
        AND: [
          whereClause,
          {
            OR: [
              { username: { contains: options.search, mode: "insensitive" } },
              { name: { contains: options.search, mode: "insensitive" } },
            ],
          },
        ],
      };
    }
  }

  const skip = (page - 1) * VOTER_PAGE_SIZE;

  const [voters, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdById: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: {
            id: true,
            username: true,
            name: true,
            role: true,
          },
        },
        electionVoters: {
          select: {
            id: true,
            electionId: true,
            hasVoted: true,
            createdAt: true,
            election: {
              select: {
                id: true,
                title: true,
                description: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: VOTER_PAGE_SIZE,
      skip,
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(total / VOTER_PAGE_SIZE);

  return {
    voters,
    meta: {
      total,
      totalPages,
      page,
      limit: VOTER_PAGE_SIZE,
    },
  };
};

const getVoterById = async (
  voterId: number,
  userId: number,
  role: UserRole,
): Promise<unknown> => {
  const voter = await prisma.user.findFirst({
    where: {
      id: voterId,
      role: UserRole.VOTER,
    },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdById: true,
      createdAt: true,
      updatedAt: true,
      createdBy: {
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
        },
      },
      electionVoters: {
        select: {
          id: true,
          electionId: true,
          hasVoted: true,
          createdAt: true,
          election: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!voter) {
    throw new AppError("Voter tidak ditemukan.", 404);
  }

  if (role === UserRole.SUPER_ADMIN) {
    return voter;
  }

  if (role === UserRole.ADMIN) {
    const isCreator = voter.createdById === userId;
    let hasAccess = isCreator;

    if (!hasAccess && voter.electionVoters.length > 0) {
      const enrolledElectionIds = voter.electionVoters.map((ev) => ev.electionId);
      const adminElections = await prisma.electionAdmin.findFirst({
        where: {
          userId,
          electionId: { in: enrolledElectionIds },
        },
      });

      if (adminElections) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke data voter ini.",
        403,
      );
    }

    return voter;
  }

  if (role === UserRole.VOTER) {
    if (voterId !== userId) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke data voter ini.",
        403,
      );
    }
    return voter;
  }

  throw new AppError("Forbidden: Role tidak valid.", 403);
};

const updateVoter = async (
  voterId: number,
  input: UpdateVoterInput,
  userId: number,
  role: UserRole,
): Promise<unknown> => {
  const voter = await prisma.user.findFirst({
    where: {
      id: voterId,
      role: UserRole.VOTER,
    },
  });

  if (!voter) {
    throw new AppError("Voter tidak ditemukan.", 404);
  }

  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk mengubah data voter.",
      403,
    );
  }

  if (role === UserRole.ADMIN) {
    if (voter.createdById !== userId) {
      throw new AppError(
        "Forbidden: Anda hanya dapat mengubah data voter yang Anda buat.",
        403,
      );
    }
  }

  const updateData: { name?: string; username?: string; password?: string } = {};

  if (input.name !== undefined) {
    if (typeof input.name !== "string" || input.name === "") {
      throw new AppError("Name voter tidak boleh kosong.", 400);
    }
    updateData.name = input.name;
  }

  if (input.username !== undefined) {
    if (typeof input.username !== "string" || input.username === "") {
      throw new AppError("Username voter tidak boleh kosong.", 400);
    }
    if (input.username !== voter.username) {
      const existing = await prisma.user.findUnique({
        where: { username: input.username },
      });
      if (existing) {
        throw new AppError("Username sudah terdaftar.", 409);
      }
    }
    updateData.username = input.username;
  }

  if (input.password !== undefined) {
    if (typeof input.password !== "string" || input.password === "") {
      throw new AppError("Password voter tidak boleh kosong.", 400);
    }
    updateData.password = await hashPassword(input.password);
  }

  return prisma.user.update({
    where: { id: voterId },
    data: updateData,
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdById: true,
      createdAt: true,
      updatedAt: true,
      createdBy: {
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
        },
      },
    },
  });
};

const deleteVoter = async (
  voterId: number,
  userId: number,
  role: UserRole,
): Promise<void> => {
  const voter = await prisma.user.findFirst({
    where: {
      id: voterId,
      role: UserRole.VOTER,
    },
  });

  if (!voter) {
    throw new AppError("Voter tidak ditemukan.", 404);
  }

  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk menghapus voter.",
      403,
    );
  }

  if (role === UserRole.ADMIN) {
    if (voter.createdById !== userId) {
      throw new AppError(
        "Forbidden: Anda hanya dapat menghapus voter yang Anda buat.",
        403,
      );
    }
  }

  await prisma.user.delete({
    where: { id: voterId },
  });
};

const enrollVotersToElection = async (
  electionId: number,
  voterIds: number[],
  userId: number,
  role: UserRole,
): Promise<unknown[]> => {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
  }

  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk mengelola voter pada election ini.",
      403,
    );
  }

  if (role === UserRole.ADMIN) {
    const isAssigned = await prisma.electionAdmin.findUnique({
      where: {
        electionId_userId: {
          electionId,
          userId,
        },
      },
    });

    if (!isAssigned) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke election ini.",
        403,
      );
    }
  }

  const uniqueVoterIds = Array.from(new Set(voterIds));
  if (uniqueVoterIds.length === 0) {
    throw new AppError("Daftar voterId tidak boleh kosong.", 400);
  }

  const voters = await prisma.user.findMany({
    where: {
      id: { in: uniqueVoterIds },
      role: UserRole.VOTER,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
        },
      },
    },
  });

  if (voters.length !== uniqueVoterIds.length) {
    throw new AppError(
      "Satu atau lebih voter ID tidak valid atau bukan bertipe VOTER.",
      400,
    );
  }

  // Creator Scope Enforcement (BR-08):
  // Jika voter dibuat oleh Admin, voter hanya dapat mengakses election yang dikelola oleh Admin pembuatnya.
  for (const voter of voters) {
    if (voter.createdBy?.role === UserRole.ADMIN) {
      const creatorAdminId = voter.createdById!;
      const creatorAssigned = await prisma.electionAdmin.findUnique({
        where: {
          electionId_userId: {
            electionId,
            userId: creatorAdminId,
          },
        },
      });

      if (!creatorAssigned) {
        throw new AppError(
          `Forbidden: Voter '${voter.username}' dibuat oleh Admin '${voter.createdBy.username}' dan election ini berada di luar scope Admin pembuatnya. Sesuai aturan BR-08, voter hanya dapat mengakses election yang dikelola oleh Admin pembuatnya.`,
          403,
        );
      }
    }
  }

  const existingEnrollments = await prisma.electionVoter.findMany({
    where: {
      electionId,
      userId: { in: uniqueVoterIds },
    },
  });

  const existingUserIds = new Set(
    existingEnrollments.map((assignment) => assignment.userId),
  );
  const newVoterIds = uniqueVoterIds.filter((id) => !existingUserIds.has(id));

  if (newVoterIds.length > 0) {
    await prisma.electionVoter.createMany({
      data: newVoterIds.map((voterId) => ({
        electionId,
        userId: voterId,
        hasVoted: false,
      })),
    });
  }

  return prisma.electionVoter.findMany({
    where: {
      electionId,
      userId: { in: uniqueVoterIds },
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          createdById: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

const enrollVoterToElections = async (
  voterId: number,
  electionIds: number[],
  userId: number,
  role: UserRole,
): Promise<unknown[]> => {
  const voter = await prisma.user.findFirst({
    where: {
      id: voterId,
      role: UserRole.VOTER,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
        },
      },
    },
  });

  if (!voter) {
    throw new AppError("Voter tidak ditemukan.", 404);
  }

  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk mendaftarkan voter ke election.",
      403,
    );
  }

  const uniqueElectionIds = Array.from(new Set(electionIds));
  if (uniqueElectionIds.length === 0) {
    throw new AppError("Daftar electionId tidak boleh kosong.", 400);
  }

  const elections = await prisma.election.findMany({
    where: { id: { in: uniqueElectionIds } },
  });

  if (elections.length !== uniqueElectionIds.length) {
    throw new AppError("Satu atau lebih election tidak ditemukan.", 404);
  }

  if (role === UserRole.ADMIN) {
    const adminAssignments = await prisma.electionAdmin.findMany({
      where: {
        userId,
        electionId: { in: uniqueElectionIds },
      },
    });

    if (adminAssignments.length !== uniqueElectionIds.length) {
      throw new AppError(
        "Forbidden: Anda hanya dapat mendaftarkan voter pada election yang Anda kelola.",
        403,
      );
    }
  }

  // Creator Scope Enforcement (BR-08):
  if (voter.createdBy?.role === UserRole.ADMIN) {
    const creatorAdminId = voter.createdById!;
    const creatorAssignments = await prisma.electionAdmin.findMany({
      where: {
        userId: creatorAdminId,
        electionId: { in: uniqueElectionIds },
      },
    });

    if (creatorAssignments.length !== uniqueElectionIds.length) {
      throw new AppError(
        `Forbidden: Voter '${voter.username}' dibuat oleh Admin '${voter.createdBy.username}' dan satu atau lebih election berada di luar scope Admin pembuatnya. Sesuai aturan BR-08, voter hanya dapat mengakses election yang dikelola oleh Admin pembuatnya.`,
        403,
      );
    }
  }

  const existingEnrollments = await prisma.electionVoter.findMany({
    where: {
      userId: voterId,
      electionId: { in: uniqueElectionIds },
    },
  });

  const existingElectionIds = new Set(
    existingEnrollments.map((enr) => enr.electionId),
  );
  const newElectionIds = uniqueElectionIds.filter(
    (id) => !existingElectionIds.has(id),
  );

  if (newElectionIds.length > 0) {
    await prisma.electionVoter.createMany({
      data: newElectionIds.map((electionId) => ({
        electionId,
        userId: voterId,
        hasVoted: false,
      })),
    });
  }

  return prisma.electionVoter.findMany({
    where: {
      userId: voterId,
      electionId: { in: uniqueElectionIds },
    },
    include: {
      election: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

const removeVoterFromElection = async (
  electionId: number,
  voterId: number,
  userId: number,
  role: UserRole,
): Promise<void> => {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
  }

  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk mengelola voter pada election ini.",
      403,
    );
  }

  if (role === UserRole.ADMIN) {
    const isAssigned = await prisma.electionAdmin.findUnique({
      where: {
        electionId_userId: {
          electionId,
          userId,
        },
      },
    });

    if (!isAssigned) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke election ini.",
        403,
      );
    }
  }

  const enrollment = await prisma.electionVoter.findUnique({
    where: {
      electionId_userId: {
        electionId,
        userId: voterId,
      },
    },
  });

  if (!enrollment) {
    throw new AppError("Voter tidak terdaftar pada election ini.", 404);
  }

  // BR-16: Voter dapat dihapus dari election meskipun sudah melakukan vote. Vote yang sudah tercatat tetap berlaku.
  await prisma.electionVoter.delete({
    where: {
      electionId_userId: {
        electionId,
        userId: voterId,
      },
    },
  });
};

const getElectionVoters = async (
  electionId: number,
  userId: number,
  role: UserRole,
): Promise<unknown[]> => {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
  }

  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki akses ke resource ini.",
      403,
    );
  }

  if (role === UserRole.ADMIN) {
    const isAssigned = await prisma.electionAdmin.findUnique({
      where: {
        electionId_userId: {
          electionId,
          userId,
        },
      },
    });

    if (!isAssigned) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke election ini.",
        403,
      );
    }
  }

  return prisma.electionVoter.findMany({
    where: { electionId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          createdById: true,
          createdAt: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              name: true,
              role: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export type { CreateVoterInput, UpdateVoterInput, GetVotersOptions };
export {
  createVoter,
  getVoters,
  getVoterById,
  updateVoter,
  deleteVoter,
  enrollVotersToElection,
  enrollVoterToElections,
  removeVoterFromElection,
  getElectionVoters,
};
