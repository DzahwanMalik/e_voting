import { prisma } from "../lib/prisma";
import { UserRole } from "../generated/prisma/enums";
import { AppError } from "../utils/app-error";

interface CandidateInfo {
  id: number;
  name: string;
  photoUrl: string | null;
  description: string | null;
  birthday: Date;
  isVice: boolean;
}

interface CandidatePairVoteResult {
  candidatePairId: number;
  calon: CandidateInfo;
  wakil: CandidateInfo;
  pairPhotoUrl: string | null;
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
  results: CandidatePairVoteResult[];
}

interface LeadingCandidateInfo {
  candidatePairId: number;
  calonName: string;
  wakilName: string;
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
  const totalVotes = election.candidatePairs.reduce(
    (sum, pair) => sum + pair._count.votes,
    0,
  );

  const turnoutPercentage =
    totalVoters > 0
      ? Number(((votedCount / totalVoters) * 100).toFixed(2))
      : 0;

  const results: CandidatePairVoteResult[] = election.candidatePairs
    .map((pair) => {
      const voteCount = pair._count.votes;
      const percentage =
        totalVotes > 0
          ? Number(((voteCount / totalVotes) * 100).toFixed(2))
          : 0;

      return {
        candidatePairId: pair.id,
        calon: {
          id: pair.candidate.id,
          name: pair.candidate.name,
          photoUrl: pair.candidate.photoUrl,
          description: pair.candidate.description,
          birthday: pair.candidate.birthday,
          isVice: pair.candidate.isVice,
        },
        wakil: {
          id: pair.vice.id,
          name: pair.vice.name,
          photoUrl: pair.vice.photoUrl,
          description: pair.vice.description,
          birthday: pair.vice.birthday,
          isVice: pair.vice.isVice,
        },
        pairPhotoUrl: pair.photoUrl,
        vision: pair.vision,
        mission: pair.mission,
        voteCount,
        percentage,
      };
    })
    .sort((a, b) => {
      // Sort leader first (highest votes descending), tie-break by candidatePairId ascending
      if (b.voteCount !== a.voteCount) {
        return b.voteCount - a.voteCount;
      }
      return a.candidatePairId - b.candidatePairId;
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
      const totalVotes = election.candidatePairs.reduce(
        (sum, pair) => sum + pair._count.votes,
        0,
      );

      const turnoutPercentage =
        totalVoters > 0
          ? Number(((votedCount / totalVoters) * 100).toFixed(2))
          : 0;

      const results: CandidatePairVoteResult[] = election.candidatePairs
        .map((pair) => {
          const voteCount = pair._count.votes;
          const percentage =
            totalVotes > 0
              ? Number(((voteCount / totalVotes) * 100).toFixed(2))
              : 0;

          return {
            candidatePairId: pair.id,
            calon: {
              id: pair.candidate.id,
              name: pair.candidate.name,
              photoUrl: pair.candidate.photoUrl,
              description: pair.candidate.description,
              birthday: pair.candidate.birthday,
              isVice: pair.candidate.isVice,
            },
            wakil: {
              id: pair.vice.id,
              name: pair.vice.name,
              photoUrl: pair.vice.photoUrl,
              description: pair.vice.description,
              birthday: pair.vice.birthday,
              isVice: pair.vice.isVice,
            },
            vision: pair.vision,
            mission: pair.mission,
            pairPhotoUrl: pair.photoUrl,
            voteCount,
            percentage,
          };
        })
        .sort((a, b) => {
          if (b.voteCount !== a.voteCount) {
            return b.voteCount - a.voteCount;
          }
          return a.candidatePairId - b.candidatePairId;
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
            candidatePairId: firstResult.candidatePairId,
            calonName: firstResult.calon.name,
            wakilName: firstResult.wakil.name,
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
  CandidatePairVoteResult,
  CandidateInfo,
  ElectionResultData,
  LeadingCandidateInfo,
  ElectionSummaryItem,
  OverallResultSummary,
};
export { getElectionResultById, getAllElectionResults, getResultSummary };