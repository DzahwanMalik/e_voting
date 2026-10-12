import { prisma } from "../lib/prisma";
import { UserRole } from "../generated/prisma/enums";
import { AppError } from "../utils/app-error";

interface CreateElectionInput {
  title: string;
  description?: string | null;
}

interface ElectionResult {
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UpdateElectionInput {
  title?: string;
  description?: string | null;
}

interface UpdateElectionResult {
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const createElection = async (
  input: CreateElectionInput,
): Promise<ElectionResult> => {
  if (!input.title) {
    throw new AppError("Title election wajib diisi.", 400);
  }

  return prisma.election.create({
    data: {
      title: input.title,
      description: input.description ?? null,
    },
  });
};

const getAllElections = async (
  userId: number,
  role: UserRole,
): Promise<unknown[]> => {
  if (role === UserRole.SUPER_ADMIN) {
    return prisma.election.findMany({
      include: {
        electionAdmins: {
          select: {
            id: true,
            userId: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            candidates: true,
            candidatePairs: true,
            electionVoters: true,
            electionAdmins: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  if (role === UserRole.ADMIN) {
    return prisma.election.findMany({
      where: {
        electionAdmins: {
          some: {
            userId,
          },
        },
      },
      include: {
        electionAdmins: {
          select: {
            id: true,
            userId: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            candidates: true,
            candidatePairs: true,
            electionVoters: true,
            electionAdmins: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // VOTER
  return prisma.election.findMany({
    where: {
      electionVoters: {
        some: {
          userId,
        },
      },
    },
    include: {
      candidatePairs: {
        include: {
          candidate: {
            select: {
              id: true,
              name: true,
              photoUrl: true,
              description: true,
              birthday: true,
              isVice: true,
            },
          },
          vice: {
            select: {
              id: true,
              name: true,
              photoUrl: true,
              description: true,
              birthday: true,
              isVice: true,
            },
          },
        },
      },
      electionVoters: {
        where: {
          userId,
        },
        select: {
          hasVoted: true,
        },
      },
      _count: {
        select: {
          candidates: true,
          candidatePairs: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getElectionById = async (
  electionId: number,
  userId: number,
  role: UserRole,
): Promise<unknown> => {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
    include: {
      candidatePairs: {
        include: {
          candidate: {
            select: {
              id: true,
              name: true,
              photoUrl: true,
              description: true,
              birthday: true,
              isVice: true,
            },
          },
          vice: {
            select: {
              id: true,
              name: true,
              photoUrl: true,
              description: true,
              birthday: true,
              isVice: true,
            },
          },
        },
      },
      electionAdmins: {
        select: {
          id: true,
          userId: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              role: true,
            },
          },
        },
      },
      _count: {
        select: {
          candidates: true,
          candidatePairs: true,
          electionVoters: true,
          electionAdmins: true,
        },
      },
    },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
  }

  // Authorization / Scope Check
  if (role === UserRole.SUPER_ADMIN) {
    return election;
  }

  if (role === UserRole.ADMIN) {
    const isAssigned = election.electionAdmins.some(
      (electionAdmin) => electionAdmin.userId === userId,
    );
    if (!isAssigned) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke election ini.",
        403,
      );
    }
    return election;
  }

  // VOTER
  const isEnrolled = await prisma.electionVoter.findUnique({
    where: {
      electionId_userId: {
        electionId,
        userId,
      },
    },
    select: {
      hasVoted: true,
    },
  });

  if (!isEnrolled) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki akses ke election ini.",
      403,
    );
  }

  // BR-12: Strip vote counts for non-Super Admin
  const pairsForVoter = election.candidatePairs.map((pair) => ({
    ...pair,
    candidate: pair.candidate,
    vice: pair.vice,
  }));

  return {
    id: election.id,
    title: election.title,
    description: election.description,
    createdAt: election.createdAt,
    updatedAt: election.updatedAt,
    hasVoted: isEnrolled.hasVoted,
    candidatePairs: pairsForVoter,
    _count: {
      candidates: election._count.candidates,
      candidatePairs: election._count.candidatePairs,
    },
  };
};

const updateElection = async (
  electionId: number,
  userId: number,
  role: UserRole,
  input: UpdateElectionInput,
): Promise<UpdateElectionResult> => {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
    include: {
      electionAdmins: true,
    },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
  }

  // Authorization Check
  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki akses ke resource ini.",
      403,
    );
  }

  if (role === UserRole.ADMIN) {
    const isAssigned = election.electionAdmins.some(
      (ea) => ea.userId === userId,
    );
    if (!isAssigned) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke election ini.",
        403,
      );
    }
  }

  const updateData: { title?: string; description?: string | null } = {};

  if (input.title !== undefined) {
    if (input.title === "") {
      throw new AppError("Title election tidak boleh kosong.", 400);
    }
    updateData.title = input.title;
  }

  if (input.description !== undefined) {
    updateData.description = input.description;
  }

  return prisma.election.update({
    where: { id: electionId },
    data: updateData,
  });
};

const deleteElection = async (
  electionId: number,
  role: UserRole,
): Promise<void> => {
  if (role !== UserRole.SUPER_ADMIN) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk menghapus election.",
      403,
    );
  }

  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
  }

  await prisma.election.delete({
    where: { id: electionId },
  });
};

const assignAdminsToElection = async (
  electionId: number,
  adminIds: number[],
  role: UserRole,
): Promise<unknown[]> => {
  if (role !== UserRole.SUPER_ADMIN) {
    throw new AppError(
      "Forbidden: Hanya Super Admin yang dapat menugaskan admin.",
      403,
    );
  }

  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
  }

  const uniqueAdminIds = Array.from(new Set(adminIds));
  if (uniqueAdminIds.length === 0) {
    throw new AppError("Daftar adminId tidak boleh kosong.", 400);
  }

  const validAdmins = await prisma.user.findMany({
    where: {
      id: { in: uniqueAdminIds },
      role: UserRole.ADMIN,
    },
  });

  if (validAdmins.length !== uniqueAdminIds.length) {
    throw new AppError(
      "Satu atau lebih Admin ID tidak valid atau bukan bertipe ADMIN.",
      400,
    );
  }

  const existingAssignments = await prisma.electionAdmin.findMany({
    where: {
      electionId,
      userId: { in: uniqueAdminIds },
    },
  });

  const existingUserIds = new Set(
    existingAssignments.map((assignment) => assignment.userId),
  );
  const newAdminIds = uniqueAdminIds.filter((id) => !existingUserIds.has(id));

  if (newAdminIds.length > 0) {
    await prisma.electionAdmin.createMany({
      data: newAdminIds.map((adminId) => ({
        electionId,
        userId: adminId,
      })),
    });
  }

  return prisma.electionAdmin.findMany({
    where: { electionId },
    include: {
      user: {
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

const removeAdminFromElection = async (
  electionId: number,
  adminId: number,
  role: UserRole,
): Promise<void> => {
  if (role !== UserRole.SUPER_ADMIN) {
    throw new AppError(
      "Forbidden: Hanya Super Admin yang dapat mengubah assignment admin.",
      403,
    );
  }

  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
  }

  const existingAssignment = await prisma.electionAdmin.findUnique({
    where: {
      electionId_userId: {
        electionId,
        userId: adminId,
      },
    },
  });

  if (!existingAssignment) {
    throw new AppError("Admin tidak ditugaskan pada election ini.", 404);
  }

  await prisma.electionAdmin.delete({
    where: {
      electionId_userId: {
        electionId,
        userId: adminId,
      },
    },
  });
};

const getElectionAdmins = async (
  electionId: number,
  userId: number,
  role: UserRole,
): Promise<unknown[]> => {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
    include: {
      electionAdmins: true,
    },
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
    const isAssigned = election.electionAdmins.some(
      (ea) => ea.userId === userId,
    );
    if (!isAssigned) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke election ini.",
        403,
      );
    }
  }

  return prisma.electionAdmin.findMany({
    where: { electionId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export type { CreateElectionInput, UpdateElectionInput, ElectionResult };
export {
  createElection,
  getAllElections,
  getElectionById,
  updateElection,
  deleteElection,
  assignAdminsToElection,
  removeAdminFromElection,
  getElectionAdmins,
};
