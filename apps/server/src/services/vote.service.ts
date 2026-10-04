import { prisma } from "../lib/prisma";
import { UserRole } from "../generated/prisma/enums";
import { AppError } from "../utils/app-error";

interface CastVoteInput {
  electionId: number;
  candidateId: number;
  userId: number;
  role: UserRole;
}

interface CastVoteResult {
  message: string;
  electionId: number;
  candidateId: number;
  hasVoted: boolean;
}

interface VotingStatusResult {
  electionId: number;
  userId: number;
  isEnrolled: boolean;
  hasVoted: boolean;
}

interface CandidateVoteResult {
  candidateId: number;
  name: string;
  photoUrl: string | null;
  description: string | null;
  voteCount: number;
  percentage: number;
}

interface ElectionResultData {
  election: {
    id: number;
    title: string;
    description: string | null;
  };
  totalVoters: number;
  votedCount: number;
  totalVotes: number;
  turnoutPercentage: number;
  results: CandidateVoteResult[];
}

const castVote = async (input: CastVoteInput): Promise<CastVoteResult> => {
  const { electionId, candidateId, userId, role } = input;

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
    throw new AppError(
      "Anda sudah melakukan voting pada election ini.",
      400,
    );
  }

  // 4. Cek keberadaan Candidate
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
  });

  if (!candidate) {
    throw new AppError("Candidate tidak ditemukan.", 404);
  }

  // 5. Cek apakah candidate adalah bagian dari election ini (BR-09, BR-13)
  if (candidate.electionId !== electionId) {
    throw new AppError(
      "Candidate yang dipilih bukan bagian dari election ini.",
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
      throw new AppError(
        "Anda sudah melakukan voting pada election ini.",
        400,
      );
    }

    await tx.vote.create({
      data: {
        candidateId,
      },
    });

    return {
      message: "Voting berhasil.",
      electionId,
      candidateId,
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

const getElectionResults = async (
  electionId: number,
  role: UserRole,
): Promise<ElectionResultData> => {
  // BR-12: Hanya Super Admin yang dapat melihat result
  if (role !== UserRole.SUPER_ADMIN) {
    throw new AppError(
      "Forbidden: Hanya Super Admin yang dapat melihat hasil pemilihan.",
      403,
    );
  }

  const election = await prisma.election.findUnique({
    where: { id: electionId },
    include: {
      candidates: {
        include: {
          _count: {
            select: {
              votes: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      _count: {
        select: {
          electionVoters: true,
        },
      },
    },
  });

  if (!election) {
    throw new AppError("Election tidak ditemukan.", 404);
  }

  const votedCount = await prisma.electionVoter.count({
    where: {
      electionId,
      hasVoted: true,
    },
  });

  const totalVoters = election._count.electionVoters;
  const totalVotes = election.candidates.reduce(
    (sum, candidate) => sum + candidate._count.votes,
    0,
  );
  const turnoutPercentage =
    totalVoters > 0
      ? Number(((votedCount / totalVoters) * 100).toFixed(2))
      : 0;

  const results: CandidateVoteResult[] = election.candidates.map((candidate) => {
    const voteCount = candidate._count.votes;
    const percentage =
      totalVotes > 0
        ? Number(((voteCount / totalVotes) * 100).toFixed(2))
        : 0;

    return {
      candidateId: candidate.id,
      name: candidate.name,
      photoUrl: candidate.photoUrl,
      description: candidate.description,
      voteCount,
      percentage,
    };
  });

  return {
    election: {
      id: election.id,
      title: election.title,
      description: election.description,
    },
    totalVoters,
    votedCount,
    totalVotes,
    turnoutPercentage,
    results,
  };
};

export type {
  CastVoteInput,
  CastVoteResult,
  VotingStatusResult,
  CandidateVoteResult,
  ElectionResultData,
};
export { castVote, getVotingStatus, getElectionResults };
