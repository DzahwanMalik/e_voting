import { prisma } from "../lib/prisma";
import { UserRole } from "../generated/prisma/enums";
import { AppError } from "../utils/app-error";

interface CandidateVoteResult {
  candidateId: number;
  name: string;
  photoUrl: string | null;
  description: string | null;
  birthday: Date;
  vision: string;
  mission: string;
  voteCount: number;
  percentage: number;
}

interface ElectionResultData {
  election: {
    id: number;
    title: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  totalVoters: number;
  votedCount: number;
  unvotedCount: number;
  totalVotes: number;
  turnoutPercentage: number;
  results: CandidateVoteResult[];
}

interface LeadingCandidateInfo {
  candidateId: number;
  name: string;
  voteCount: number;
  percentage: number;
}

interface ElectionSummaryItem {
  electionId: number;
  title: string;
  description: string | null;
  totalVoters: number;
  votedCount: number;
  unvotedCount: number;
  totalVotes: number;
  turnoutPercentage: number;
  leadingCandidate: LeadingCandidateInfo | null;
}

interface OverallResultSummary {
  totalElections: number;
  totalRegisteredVoters: number;
  totalVotedCount: number;
  totalVotesCast: number;
  overallTurnoutPercentage: number;
  electionSummaries: ElectionSummaryItem[];
}

const getElectionResultById = async (
  electionId: number,
  role: UserRole,
): Promise<ElectionResultData> => {
  // BR-12: Hanya Super Admin yang dapat melihat result dan rincian perolehan suara
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
  const unvotedCount = Math.max(0, totalVoters - votedCount);
  const totalVotes = election.candidates.reduce(
    (sum, candidate) => sum + candidate._count.votes,
    0,
  );

  const turnoutPercentage =
    totalVoters > 0
      ? Number(((votedCount / totalVoters) * 100).toFixed(2))
      : 0;

  const results: CandidateVoteResult[] = election.candidates
    .map((candidate) => {
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
        birthday: candidate.birthday,
        vision: candidate.vision,
        mission: candidate.mission,
        voteCount,
        percentage,
      };
    })
    .sort((a, b) => {
      // Sort leader first (highest votes descending), tie-break by candidateId ascending
      if (b.voteCount !== a.voteCount) {
        return b.voteCount - a.voteCount;
      }
      return a.candidateId - b.candidateId;
    });

  return {
    election: {
      id: election.id,
      title: election.title,
      description: election.description,
      createdAt: election.createdAt,
      updatedAt: election.updatedAt,
    },
    totalVoters,
    votedCount,
    unvotedCount,
    totalVotes,
    turnoutPercentage,
    results,
  };
};

const getAllElectionResults = async (
  role: UserRole,
): Promise<ElectionResultData[]> => {
  // BR-12: Hanya Super Admin yang dapat melihat result dan rincian perolehan suara
  if (role !== UserRole.SUPER_ADMIN) {
    throw new AppError(
      "Forbidden: Hanya Super Admin yang dapat melihat hasil pemilihan.",
      403,
    );
  }

  const elections = await prisma.election.findMany({
    include: {
      candidates: {
        include: {
          _count: {
            select: {
              votes: true,
            },
          },
        },
      },
      _count: {
        select: {
          electionVoters: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allResults: ElectionResultData[] = await Promise.all(
    elections.map(async (election) => {
      const votedCount = await prisma.electionVoter.count({
        where: {
          electionId: election.id,
          hasVoted: true,
        },
      });

      const totalVoters = election._count.electionVoters;
      const unvotedCount = Math.max(0, totalVoters - votedCount);
      const totalVotes = election.candidates.reduce(
        (sum, candidate) => sum + candidate._count.votes,
        0,
      );

      const turnoutPercentage =
        totalVoters > 0
          ? Number(((votedCount / totalVoters) * 100).toFixed(2))
          : 0;

      const results: CandidateVoteResult[] = election.candidates
        .map((candidate) => {
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
            birthday: candidate.birthday,
            vision: candidate.vision,
            mission: candidate.mission,
            voteCount,
            percentage,
          };
        })
        .sort((a, b) => {
          if (b.voteCount !== a.voteCount) {
            return b.voteCount - a.voteCount;
          }
          return a.candidateId - b.candidateId;
        });

      return {
        election: {
          id: election.id,
          title: election.title,
          description: election.description,
          createdAt: election.createdAt,
          updatedAt: election.updatedAt,
        },
        totalVoters,
        votedCount,
        unvotedCount,
        totalVotes,
        turnoutPercentage,
        results,
      };
    }),
  );

  return allResults;
};

const getResultSummary = async (
  role: UserRole,
): Promise<OverallResultSummary> => {
  // BR-12: Hanya Super Admin yang dapat melihat result dan rincian perolehan suara
  if (role !== UserRole.SUPER_ADMIN) {
    throw new AppError(
      "Forbidden: Hanya Super Admin yang dapat melihat hasil pemilihan.",
      403,
    );
  }

  const allResults = await getAllElectionResults(role);

  let totalRegisteredVoters = 0;
  let totalVotesCast = 0;
  let totalVotedCount = 0;

  const electionSummaries: ElectionSummaryItem[] = allResults.map((item) => {
    totalRegisteredVoters += item.totalVoters;
    totalVotesCast += item.totalVotes;
    totalVotedCount += item.votedCount;

    const firstResult = item.results[0];
    const leader =
      firstResult && firstResult.voteCount > 0
        ? {
            candidateId: firstResult.candidateId,
            name: firstResult.name,
            voteCount: firstResult.voteCount,
            percentage: firstResult.percentage,
          }
        : null;

    return {
      electionId: item.election.id,
      title: item.election.title,
      description: item.election.description,
      totalVoters: item.totalVoters,
      votedCount: item.votedCount,
      unvotedCount: item.unvotedCount,
      totalVotes: item.totalVotes,
      turnoutPercentage: item.turnoutPercentage,
      leadingCandidate: leader,
    };
  });

  const overallTurnoutPercentage =
    totalRegisteredVoters > 0
      ? Number(((totalVotedCount / totalRegisteredVoters) * 100).toFixed(2))
      : 0;

  return {
    totalElections: allResults.length,
    totalRegisteredVoters,
    totalVotedCount,
    totalVotesCast,
    overallTurnoutPercentage,
    electionSummaries,
  };
};

export type {
  CandidateVoteResult,
  ElectionResultData,
  LeadingCandidateInfo,
  ElectionSummaryItem,
  OverallResultSummary,
};
export { getElectionResultById, getAllElectionResults, getResultSummary };
