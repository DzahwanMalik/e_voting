import axios from "axios";
import { api } from "@/lib/axios";

interface ElectionListItem {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  electionVoters?: Array<{
    hasVoted: boolean;
  }>;
  candidates?: Candidate[];
  _count?: {
    candidates: number;
  };
}

interface Candidate {
  id: number;
  electionId: number;
  name: string;
  photoUrl: string | null;
  description: string | null;
  birthday: string;
  vision: string;
  mission: string;
  createdAt: string;
  updatedAt: string;
}

interface ElectionDetail {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  hasVoted: boolean;
  candidates: Candidate[];
  _count?: {
    candidates: number;
  };
}

interface CastVotePayload {
  electionId: number;
  candidateId: number;
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

interface VotingStatusResponse {
  message: string;
  status: VotingStatusResult;
}

const getElectionsApi = async (): Promise<ElectionListItem[]> => {
  try {
    const response = await api.get<{ elections: ElectionListItem[] }>("/elections");
    return response.data.elections;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const getElectionByIdApi = async (id: number): Promise<ElectionDetail> => {
  try {
    const response = await api.get<{ election: ElectionDetail }>(`/elections/${id}`);
    return response.data.election;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const getCandidatesByElectionApi = async (
  electionId: number,
): Promise<Candidate[]> => {
  try {
    const response = await api.get<{ candidates: Candidate[] }>(
      `/elections/${electionId}/candidates`,
    );
    return response.data.candidates;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const castVoteApi = async (
  payload: CastVotePayload,
): Promise<CastVoteResult> => {
  try {
    const response = await api.post<CastVoteResult>("/votes", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const getVotingStatusApi = async (
  electionId: number,
): Promise<VotingStatusResult> => {
  try {
    const response = await api.get<VotingStatusResponse>(
      `/votes/status/${electionId}`,
    );
    return response.data.status;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

export type {
  ElectionListItem,
  Candidate,
  ElectionDetail,
  CastVotePayload,
  CastVoteResult,
  VotingStatusResult,
  VotingStatusResponse,
};

export {
  getElectionsApi,
  getElectionByIdApi,
  getCandidatesByElectionApi,
  castVoteApi,
  getVotingStatusApi,
};
