import { prisma } from "../lib/prisma";
import { UserRole } from "../generated/prisma/enums";
import { AppError } from "../utils/app-error";

interface CastVoteInput {
  electionId: number;
  candidatePairId: number;
  userId: number;
  role: UserRole;
}

interface CastVoteResult {
  message: string;
  electionId: number;
  candidatePairId: number;
  hasVoted: boolean;
}

interface VotingStatusResult {
  electionId: number;
  userId: number;
  isEnrolled: boolean;
  hasVoted: boolean;
}

const castVote = async (input: CastVoteInput): Promise<CastVoteResult> => {
  const { electionId, candidatePairId, userId, role } = input;

  // BR-01: Hanya Voter yang dapat memberikan vote
  if (role !== UserRole.VOTER) {
    throw new AppError(
      "Forbidden: Hanya voter yang dapat melakukan voting.",
      403,
    );
  }

  // 1. Cek keberadaan Election
  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
  }

  // 2. Cek apakah voter terdaftar pada election (BR-07)
  const electionVoter = await prisma.electionVoter.findUnique({
    where: {
      electionId_userId: {
        electionId,
        userId,
      },
    },
  });

  if (!electionVoter) {
    throw new AppError(
      "Forbidden: Anda tidak terdaftar sebagai voter pada election ini.",
      403,
    );
  }

  // 3. Cek apakah voter sudah pernah voting pada election ini (BR-10)
  if (electionVoter.hasVoted) {
    throw new AppError("Anda sudah melakukan voting pada election ini.", 400);
  }

  // 4. Cek keberadaan CandidatePair (BR-09)
  const candidatePair = await prisma.candidatePair.findUnique({
    where: { id: candidatePairId },
  });

  if (!candidatePair) {
    throw new AppError("Paslon kandidat tidak ditemukan.", 404);
  }

  // 5. Cek apakah candidate pair adalah bagian dari election ini (BR-09, BR-13)
  if (candidatePair.electionId !== electionId) {
    throw new AppError(
      "Paslon kandidat yang dipilih bukan bagian dari election ini.",
      400,
    );
  }

  // 6. Transaksi atomik: rekam vote dan tandai hasVoted secara konsisten (BR-11, BR-10)
  return prisma.$transaction(async (tx) => {
    // Pastikan hasVoted masih false saat transaksi (mencegah double-voting jika terjadi race condition)
    const updateResult = await tx.electionVoter.updateMany({
      where: {
        electionId,
        userId,
        hasVoted: false,
      },
      data: {
        hasVoted: true,
      },
    });

    if (updateResult.count === 0) {
      throw new AppError("Anda sudah melakukan voting pada election ini.", 400);
    }

    await tx.vote.create({
      data: {
        candidatePairId,
      },
    });

    return {
      message: "Voting berhasil.",
      electionId,
      candidatePairId,
      hasVoted: true,
    };
  });
};

const getVotingStatus = async (
  electionId: number,
  userId: number,
  role: UserRole,
  targetVoterId?: number,
): Promise<VotingStatusResult> => {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
  }

  let queryUserId = userId;

  if (role === UserRole.VOTER) {
    queryUserId = userId;
  } else if (role === UserRole.ADMIN) {
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

    queryUserId = targetVoterId ?? userId;
  } else if (role === UserRole.SUPER_ADMIN) {
    queryUserId = targetVoterId ?? userId;
  }

  const voterRecord = await prisma.electionVoter.findUnique({
    where: {
      electionId_userId: {
        electionId,
        userId: queryUserId,
      },
    },
  });

  if (role === UserRole.VOTER && !voterRecord) {
    throw new AppError(
      "Forbidden: Anda tidak terdaftar sebagai voter pada election ini.",
      403,
    );
  }

  return {
    electionId,
    userId: queryUserId,
    isEnrolled: Boolean(voterRecord),
    hasVoted: voterRecord?.hasVoted ?? false,
  };
};

export type { CastVoteInput, CastVoteResult, VotingStatusResult };
export { castVote, getVotingStatus };