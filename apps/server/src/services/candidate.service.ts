import { prisma } from "../lib/prisma";
import { UserRole } from "../generated/prisma/enums";
import { AppError } from "../utils/app-error";

interface CreateCandidateInput {
  electionId: number;
  name: string;
  birthday: Date;
  vision: string;
  mission: string;
  photoUrl?: string | null;
  description?: string | null;
}

interface UpdateCandidateInput {
  name?: string;
  birthday?: Date;
  vision?: string;
  mission?: string;
  photoUrl?: string | null;
  description?: string | null;
}

interface CandidateResult {
  id: number;
  electionId: number;
  name: string;
  photoUrl: string | null;
  description: string | null;
  birthday: Date;
  vision: string;
  mission: string;
  createdAt: Date;
  updatedAt: Date;
}

const createCandidate = async (
  input: CreateCandidateInput,
  userId: number,
  role: UserRole,
): Promise<CandidateResult> => {
  const election = await prisma.election.findUnique({
    where: { id: input.electionId },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
  }

  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk membuat candidate.",
      403,
    );
  }

  if (role === UserRole.ADMIN) {
    const isAssigned = await prisma.electionAdmin.findUnique({
      where: {
        electionId_userId: {
          electionId: input.electionId,
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

  if (!input.name) {
    throw new AppError("Name candidate wajib diisi.", 400);
  }

  if (!input.birthday || isNaN(input.birthday.getTime())) {
    throw new AppError(
      "Birthday candidate wajib diisi dengan tanggal yang valid.",
      400,
    );
  }

  if (!input.vision) {
    throw new AppError("Vision candidate wajib diisi.", 400);
  }

  if (!input.mission) {
    throw new AppError("Mission candidate wajib diisi.", 400);
  }

  return prisma.candidate.create({
    data: {
      electionId: input.electionId,
      name: input.name,
      birthday: input.birthday,
      vision: input.vision,
      mission: input.mission,
      photoUrl: input.photoUrl ?? null,
      description: input.description ?? null,
    },
  });
};

const getCandidatesByElection = async (
  electionId: number,
  userId: number,
  role: UserRole,
): Promise<CandidateResult[]> => {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
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

  if (role === UserRole.VOTER) {
    const isEnrolled = await prisma.electionVoter.findUnique({
      where: {
        electionId_userId: {
          electionId,
          userId,
        },
      },
    });

    if (!isEnrolled) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke election ini.",
        403,
      );
    }
  }

  return prisma.candidate.findMany({
    where: { electionId },
    orderBy: {
      createdAt: "asc",
    },
  });
};

const getAllCandidates = async (
  userId: number,
  role: UserRole,
): Promise<CandidateResult[]> => {
  if (role === UserRole.SUPER_ADMIN) {
    return prisma.candidate.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  if (role === UserRole.ADMIN) {
    return prisma.candidate.findMany({
      where: {
        election: {
          electionAdmins: {
            some: {
              userId,
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  // VOTER
  return prisma.candidate.findMany({
    where: {
      election: {
        electionVoters: {
          some: {
            userId,
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

const getCandidateById = async (
  candidateId: number,
  userId: number,
  role: UserRole,
  electionId?: number,
): Promise<CandidateResult> => {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
  });

  if (!candidate) {
    throw new AppError("Candidate tidak ditemukan.", 404);
  }

  if (electionId !== undefined && candidate.electionId !== electionId) {
    throw new AppError("Candidate tidak ditemukan pada election ini.", 404);
  }

  if (role === UserRole.ADMIN) {
    const isAssigned = await prisma.electionAdmin.findUnique({
      where: {
        electionId_userId: {
          electionId: candidate.electionId,
          userId,
        },
      },
    });

    if (!isAssigned) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke candidate pada election ini.",
        403,
      );
    }
  }

  if (role === UserRole.VOTER) {
    const isEnrolled = await prisma.electionVoter.findUnique({
      where: {
        electionId_userId: {
          electionId: candidate.electionId,
          userId,
        },
      },
    });

    if (!isEnrolled) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke candidate pada election ini.",
        403,
      );
    }
  }

  return candidate;
};

const updateCandidate = async (
  candidateId: number,
  userId: number,
  role: UserRole,
  input: UpdateCandidateInput,
  electionId?: number,
): Promise<CandidateResult> => {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
  });

  if (!candidate) {
    throw new AppError("Candidate tidak ditemukan.", 404);
  }

  if (electionId !== undefined && candidate.electionId !== electionId) {
    throw new AppError("Candidate tidak ditemukan pada election ini.", 404);
  }

  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk mengubah candidate.",
      403,
    );
  }

  if (role === UserRole.ADMIN) {
    const isAssigned = await prisma.electionAdmin.findUnique({
      where: {
        electionId_userId: {
          electionId: candidate.electionId,
          userId,
        },
      },
    });

    if (!isAssigned) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke candidate pada election ini.",
        403,
      );
    }
  }

  const updateData: {
    name?: string;
    photoUrl?: string | null;
    description?: string | null;
    birthday?: Date;
    vision?: string;
    mission?: string;
  } = {};

  if (input.name !== undefined) {
    if (input.name === "") {
      throw new AppError("Name candidate tidak boleh kosong.", 400);
    }
    updateData.name = input.name;
  }

  if (input.photoUrl !== undefined) {
    updateData.photoUrl = input.photoUrl;
  }

  if (input.description !== undefined) {
    updateData.description = input.description;
  }

  if (input.birthday !== undefined) {
    if (isNaN(input.birthday.getTime())) {
      throw new AppError(
        "Birthday candidate harus berupa format tanggal yang valid.",
        400,
      );
    }
    updateData.birthday = input.birthday;
  }

  if (input.vision !== undefined) {
    if (input.vision === "") {
      throw new AppError("Vision candidate tidak boleh kosong.", 400);
    }
    updateData.vision = input.vision;
  }

  if (input.mission !== undefined) {
    if (input.mission === "") {
      throw new AppError("Mission candidate tidak boleh kosong.", 400);
    }
    updateData.mission = input.mission;
  }

  return prisma.candidate.update({
    where: { id: candidateId },
    data: updateData,
  });
};

const deleteCandidate = async (
  candidateId: number,
  userId: number,
  role: UserRole,
  electionId?: number,
): Promise<void> => {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
  });

  if (!candidate) {
    throw new AppError("Candidate tidak ditemukan.", 404);
  }

  if (electionId !== undefined && candidate.electionId !== electionId) {
    throw new AppError("Candidate tidak ditemukan pada election ini.", 404);
  }

  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk menghapus candidate.",
      403,
    );
  }

  if (role === UserRole.ADMIN) {
    const isAssigned = await prisma.electionAdmin.findUnique({
      where: {
        electionId_userId: {
          electionId: candidate.electionId,
          userId,
        },
      },
    });

    if (!isAssigned) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke candidate pada election ini.",
        403,
      );
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.electionVoter.updateMany({
      where: {
        electionId: candidate.electionId,
        hasVoted: true,
      },
      data: {
        hasVoted: false,
      },
    });

    await tx.candidate.delete({
      where: { id: candidateId },
    });
  });
};

export type { CreateCandidateInput, UpdateCandidateInput, CandidateResult };
export {
  createCandidate,
  getCandidatesByElection,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};
