import { prisma } from "../lib/prisma";
import { UserRole } from "../generated/prisma/enums";
import { AppError } from "../utils/app-error";

interface CreateCandidatePairInput {
  electionId: number;
  candidateName: string;
  candidatePhotoUrl?: string | null | undefined;
  candidateDescription?: string | null | undefined;
  candidateBirthday: Date;
  viceName: string;
  vicePhotoUrl?: string | null | undefined;
  viceDescription?: string | null | undefined;
  viceBirthday: Date;
  pairPhotoUrl?: string | null | undefined;
  vision: string;
  mission: string;
}

interface UpdateCandidatePairInput {
  candidateName?: string | undefined;
  candidatePhotoUrl?: string | null | undefined;
  candidateDescription?: string | null | undefined;
  candidateBirthday?: Date | undefined;
  viceName?: string | undefined;
  vicePhotoUrl?: string | null | undefined;
  viceDescription?: string | null | undefined;
  viceBirthday?: Date | undefined;
  pairPhotoUrl?: string | null | undefined;
  vision?: string | undefined;
  mission?: string | undefined;
}

interface ElectionInfo {
  id: number;
  title: string;
}

interface CandidateInfo {
  id: number;
  electionId: number;
  name: string;
  photoUrl: string | null;
  description: string | null;
  birthday: Date;
  isVice: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CandidatePairResult {
  id: number;
  electionId: number;
  candidateId: number;
  viceId: number;
  photoUrl: string | null;
  candidate: CandidateInfo;
  vice: CandidateInfo;
  vision: string;
  mission: string;
  createdAt: Date;
  updatedAt: Date;
  election?: ElectionInfo;
  _count?: {
    votes: number;
  } | undefined;
}

const createCandidatePair = async (
  input: CreateCandidatePairInput,
  userId: number,
  role: UserRole,
): Promise<CandidatePairResult> => {
  const election = await prisma.election.findUnique({
    where: { id: input.electionId },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
  }

  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk membuat paslon kandidat.",
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

  if (!input.candidateName || typeof input.candidateName !== "string") {
    throw new AppError("Nama calon utama wajib diisi.", 400);
  }

  if (!input.viceName || typeof input.viceName !== "string") {
    throw new AppError("Nama wakil calon wajib diisi.", 400);
  }

  if (
    !input.candidateBirthday ||
    isNaN(input.candidateBirthday.getTime())
  ) {
    throw new AppError(
      "Tanggal lahir calon utama wajib diisi dengan tanggal yang valid.",
      400,
    );
  }

  if (!input.viceBirthday || isNaN(input.viceBirthday.getTime())) {
    throw new AppError(
      "Tanggal lahir wakil calon wajib diisi dengan tanggal yang valid.",
      400,
    );
  }

  if (!input.vision || typeof input.vision !== "string") {
    throw new AppError("Visi kandidat wajib diisi.", 400);
  }

  if (!input.mission || typeof input.mission !== "string") {
    throw new AppError("Misi kandidat wajib diisi.", 400);
  }

  const candidate = await prisma.candidate.create({
    data: {
      electionId: input.electionId,
      name: input.candidateName,
      birthday: input.candidateBirthday,
      isVice: false,
      photoUrl: input.candidatePhotoUrl ?? null,
      description: input.candidateDescription ?? null,
    },
  });

  const vice = await prisma.candidate.create({
    data: {
      electionId: input.electionId,
      name: input.viceName,
      birthday: input.viceBirthday,
      isVice: true,
      photoUrl: input.vicePhotoUrl ?? null,
      description: input.viceDescription ?? null,
    },
  });

  const pair = await prisma.candidatePair.create({
    data: {
      electionId: input.electionId,
      candidateId: candidate.id,
      viceId: vice.id,
      photoUrl: input.pairPhotoUrl ?? null,
      vision: input.vision,
      mission: input.mission,
    },
    include: {
      candidate: true,
      vice: true,
      election: {
        select: {
          id: true,
          title: true,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });

  return pair;
};

const getCandidatePairsByElection = async (
  electionId: number,
  userId: number,
  role: UserRole,
): Promise<CandidatePairResult[]> => {
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

  const pairs = await prisma.candidatePair.findMany({
    where: { electionId },
    include: {
      candidate: true,
      vice: true,
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // BR-12: Voter dan Admin tidak dapat melihat vote count
  if (role !== UserRole.SUPER_ADMIN) {
    return pairs.map((pair) => ({
      ...pair,
      _count: undefined,
    }));
  }

  return pairs;
};

const getAllCandidatePairs = async (
  userId: number,
  role: UserRole,
): Promise<CandidatePairResult[]> => {
  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk melihat kandidat.",
      403,
    );
  }

  if (role === UserRole.SUPER_ADMIN) {
    const pairs = await prisma.candidatePair.findMany({
      include: {
        candidate: true,
        vice: true,
        election: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return pairs;
  }

  // ADMIN — only pairs from elections they manage
  return prisma.candidatePair.findMany({
    where: {
      election: {
        electionAdmins: {
          some: {
            userId,
          },
        },
      },
    },
    include: {
      candidate: true,
      vice: true,
      election: {
        select: {
          id: true,
          title: true,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

const getCandidatePairById = async (
  pairId: number,
  userId: number,
  role: UserRole,
  electionId?: number,
): Promise<CandidatePairResult> => {
  const pair = await prisma.candidatePair.findUnique({
    where: { id: pairId },
    include: {
      candidate: true,
      vice: true,
      election: {
        select: {
          id: true,
          title: true,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });

  if (!pair) {
    throw new AppError("Paslon kandidat tidak ditemukan.", 404);
  }

  if (electionId !== undefined && pair.electionId !== electionId) {
    throw new AppError("Paslon kandidat tidak ditemukan pada election ini.", 404);
  }

  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk melihat detail paslon ini.",
      403,
    );
  }

  if (role === UserRole.ADMIN) {
    const isAssigned = await prisma.electionAdmin.findUnique({
      where: {
        electionId_userId: {
          electionId: pair.electionId,
          userId,
        },
      },
    });

    if (!isAssigned) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke paslon ini.",
        403,
      );
    }
  }

  // BR-12: Voter dan Admin tidak dapat melihat vote count
  if (role !== UserRole.SUPER_ADMIN) {
    return {
      ...pair,
      _count: undefined,
    };
  }

  return pair;
};

const updateCandidatePair = async (
  pairId: number,
  userId: number,
  role: UserRole,
  input: UpdateCandidatePairInput,
  electionId?: number,
): Promise<CandidatePairResult> => {
  const pair = await prisma.candidatePair.findUnique({
    where: { id: pairId },
    include: {
      candidate: true,
      vice: true,
    },
  });

  if (!pair) {
    throw new AppError("Paslon kandidat tidak ditemukan.", 404);
  }

  if (electionId !== undefined && pair.electionId !== electionId) {
    throw new AppError("Paslon kandidat tidak ditemukan pada election ini.", 404);
  }

  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk mengubah paslon kandidat.",
      403,
    );
  }

  if (role === UserRole.ADMIN) {
    const isAssigned = await prisma.electionAdmin.findUnique({
      where: {
        electionId_userId: {
          electionId: pair.electionId,
          userId,
        },
      },
    });

    if (!isAssigned) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke paslon ini.",
        403,
      );
    }
  }

  // Build update payloads for both candidate and vice
  const candidateUpdate: {
    name?: string;
    photoUrl?: string | null;
    description?: string | null;
    birthday?: Date;
  } = {};

  const viceUpdate: {
    name?: string;
    photoUrl?: string | null;
    description?: string | null;
    birthday?: Date;
  } = {};

  const pairUpdate: {
    vision?: string;
    mission?: string;
    photoUrl?: string | null;
  } = {};

  if (input.candidateName !== undefined) {
    if (input.candidateName === "") {
      throw new AppError("Nama calon utama tidak boleh kosong.", 400);
    }
    candidateUpdate.name = input.candidateName;
  }

  if (input.candidatePhotoUrl !== undefined) {
    candidateUpdate.photoUrl = input.candidatePhotoUrl;
  }

  if (input.candidateDescription !== undefined) {
    candidateUpdate.description = input.candidateDescription;
  }

  if (input.candidateBirthday !== undefined) {
    if (isNaN(input.candidateBirthday.getTime())) {
      throw new AppError(
        "Tanggal lahir calon utama harus berupa format tanggal yang valid.",
        400,
      );
    }
    candidateUpdate.birthday = input.candidateBirthday;
  }

  if (input.viceName !== undefined) {
    if (input.viceName === "") {
      throw new AppError("Nama wakil calon tidak boleh kosong.", 400);
    }
    viceUpdate.name = input.viceName;
  }

  if (input.vicePhotoUrl !== undefined) {
    viceUpdate.photoUrl = input.vicePhotoUrl;
  }

  if (input.viceDescription !== undefined) {
    viceUpdate.description = input.viceDescription;
  }

  if (input.viceBirthday !== undefined) {
    if (isNaN(input.viceBirthday.getTime())) {
      throw new AppError(
        "Tanggal lahir wakil calon harus berupa format tanggal yang valid.",
        400,
      );
    }
    viceUpdate.birthday = input.viceBirthday;
  }

  if (input.vision !== undefined) {
    if (input.vision === "") {
      throw new AppError("Visi kandidat tidak boleh kosong.", 400);
    }
    pairUpdate.vision = input.vision;
  }

  if (input.mission !== undefined) {
    if (input.mission === "") {
      throw new AppError("Misi kandidat tidak boleh kosong.", 400);
    }
    pairUpdate.mission = input.mission;
  }

  if (input.pairPhotoUrl !== undefined) {
    pairUpdate.photoUrl = input.pairPhotoUrl;
  }

  // Use transaction for atomic update
  return prisma.$transaction(async (tx) => {
    if (Object.keys(candidateUpdate).length > 0) {
      await tx.candidate.update({
        where: { id: pair.candidateId },
        data: candidateUpdate,
      });
    }

    if (Object.keys(viceUpdate).length > 0) {
      await tx.candidate.update({
        where: { id: pair.viceId },
        data: viceUpdate,
      });
    }

    if (Object.keys(pairUpdate).length > 0) {
      await tx.candidatePair.update({
        where: { id: pairId },
        data: pairUpdate,
      });
    }

    return tx.candidatePair.findUnique({
      where: { id: pairId },
      include: {
        candidate: true,
        vice: true,
        election: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    }).then((result) => {
      if (!result) {
        throw new AppError(
          "Paslon kandidat tidak ditemukan setelah pembaruan.",
          404,
        );
      }
      return result;
    });
  });
};

const deleteCandidatePair = async (
  pairId: number,
  userId: number,
  role: UserRole,
  electionId?: number,
): Promise<void> => {
  const pair = await prisma.candidatePair.findUnique({
    where: { id: pairId },
  });

  if (!pair) {
    throw new AppError("Paslon kandidat tidak ditemukan.", 404);
  }

  if (electionId !== undefined && pair.electionId !== electionId) {
    throw new AppError("Paslon kandidat tidak ditemukan pada election ini.", 404);
  }

  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk menghapus paslon kandidat.",
      403,
    );
  }

  if (role === UserRole.ADMIN) {
    const isAssigned = await prisma.electionAdmin.findUnique({
      where: {
        electionId_userId: {
          electionId: pair.electionId,
          userId,
        },
      },
    });

    if (!isAssigned) {
      throw new AppError(
        "Forbidden: Anda tidak memiliki akses ke paslon ini.",
        403,
      );
    }
  }

  await prisma.candidatePair.delete({
    where: { id: pairId },
  });
};

const getCandidateById = async (
  candidateId: number,
  userId: number,
  role: UserRole,
): Promise<CandidateInfo & { pair?: { id: number; candidateId: number; viceId: number; vision: string; mission: string } | null }> => {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: {
      pairAsCalon: {
        select: {
          id: true,
          candidateId: true,
          viceId: true,
          vision: true,
          mission: true,
        },
      },
      pairAsVice: {
        select: {
          id: true,
          candidateId: true,
          viceId: true,
          vision: true,
          mission: true,
        },
      },
    },
  });

  if (!candidate) {
    throw new AppError("Candidate tidak ditemukan.", 404);
  }

  // Voters cannot access individual candidate details (BR-12)
  if (role === UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Anda tidak memiliki izin untuk melihat detail kandidat ini.",
      403,
    );
  }

  // Admin access check
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
        "Forbidden: Anda tidak memiliki akses ke candidate ini.",
        403,
      );
    }
  }

  return {
    id: candidate.id,
    electionId: candidate.electionId,
    name: candidate.name,
    photoUrl: candidate.photoUrl,
    description: candidate.description,
    birthday: candidate.birthday,
    isVice: candidate.isVice,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
    pair: candidate.pairAsCalon ?? candidate.pairAsVice ?? null,
  };
};

export type {
  CreateCandidatePairInput,
  UpdateCandidatePairInput,
  CandidatePairResult,
  CandidateInfo,
  ElectionInfo,
};
export {
  createCandidatePair,
  getCandidatePairsByElection,
  getAllCandidatePairs,
  getCandidatePairById,
  getCandidateById,
  updateCandidatePair,
  deleteCandidatePair,
};
