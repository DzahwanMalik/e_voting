import axios from "axios";
import { api } from "@/lib/axios";

interface ElectionAdmin {
  id: number;
  userId: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    name: string | null;
    role: string;
  };
}

interface IndividualCandidate {
  id: number;
  electionId: number;
  name: string;
  photoUrl: string | null;
  description: string | null;
  birthday: string;
  isVice: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CandidatePair {
  id: number;
  electionId: number;
  candidateId: number;
  viceId: number;
  photoUrl: string | null;
  vision: string;
  mission: string;
  createdAt: string;
  updatedAt: string;
  candidate: IndividualCandidate;
  vice: IndividualCandidate;
  _count?: {
    votes: number;
  };
}

interface ElectionListItem {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  electionVoters?: Array<{
    hasVoted: boolean;
  }>;
  candidatePairs?: CandidatePair[];
  electionAdmins?: ElectionAdmin[];
  _count?: {
    candidates: number;
    candidatePairs: number;
    electionVoters?: number;
    electionAdmins?: number;
  };
}

interface ElectionDetail {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  hasVoted: boolean;
  candidatePairs: CandidatePair[];
  _count?: {
    candidates: number;
    candidatePairs: number;
  };
}

interface CastVotePayload {
  electionId: number;
  candidatePairId: number;
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

interface VotingStatusResponse {
  message: string;
  status: VotingStatusResult;
}

interface AdminUser {
  id: number;
  username: string;
  name: string | null;
  role: string;
}

interface AssignAdminsPayload {
  electionId: number;
  adminIds: number[];
}

interface AdminAssignmentResponse {
  message: string;
  electionAdmins: AdminUser[];
}

interface CandidatePairVoteResult {
  candidatePairId: number;
  calon: {
    id: number;
    name: string;
    photoUrl: string | null;
    description: string | null;
    birthday: string;
    isVice: boolean;
  };
  wakil: {
    id: number;
    name: string;
    photoUrl: string | null;
    description: string | null;
    birthday: string;
    isVice: boolean;
  };
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
    createdAt: string;
    updatedAt: string;
  };
  totalVoters: number;
  votedCount: number;
  unvotedCount: number;
  totalVotes: number;
  turnoutPercentage: number;
  results: CandidatePairVoteResult[];
}

interface CreateCandidatePairPayload {
  electionId: number;
  candidateName: string;
  candidatePhotoUrl?: string | null;
  candidateDescription?: string | null;
  candidateBirthday: string;
  viceName: string;
  vicePhotoUrl?: string | null;
  viceDescription?: string | null;
  viceBirthday: string;
  pairPhotoUrl?: string | null;
  vision: string;
  mission: string;
}

interface UpdateCandidatePairPayload {
  candidateName?: string;
  candidatePhotoUrl?: string | null;
  candidateDescription?: string | null;
  candidateBirthday?: string;
  viceName?: string;
  vicePhotoUrl?: string | null;
  viceDescription?: string | null;
  viceBirthday?: string;
  pairPhotoUrl?: string | null;
  vision?: string;
  mission?: string;
}

interface CandidatePairResponse {
  message: string;
  candidatePair: CandidatePair;
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

const getCandidatePairsByElectionApi = async (
  electionId: number,
): Promise<CandidatePair[]> => {
  try {
    const response = await api.get<{ candidatePairs: CandidatePair[] }>(
      `/elections/${electionId}/candidate-pairs`,
    );
    return response.data.candidatePairs;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const createCandidatePairApi = async (
  payload: CreateCandidatePairPayload,
): Promise<CandidatePair> => {
  try {
    const response = await api.post<{ message: string; candidatePair: CandidatePair }>(
      "/candidate-pairs",
      payload,
    );
    return response.data.candidatePair;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const updateCandidatePairApi = async (
  pairId: number,
  payload: UpdateCandidatePairPayload,
): Promise<CandidatePair> => {
  try {
    const response = await api.put<{ message: string; candidatePair: CandidatePair }>(
      `/candidate-pairs/${pairId}`,
      payload,
    );
    return response.data.candidatePair;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const deleteCandidatePairApi = async (pairId: number): Promise<void> => {
  try {
    await api.delete<{ message: string }>(`/candidate-pairs/${pairId}`);
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

const deleteElectionApi = async (id: number): Promise<void> => {
  try {
    await api.delete<{ message: string }>(`/elections/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const updateElectionApi = async (
  id: number,
  payload: { title?: string; description?: string | null },
): Promise<ElectionListItem> => {
  try {
    const response = await api.put<{ message: string; election: ElectionListItem }>(
      `/elections/${id}`,
      payload,
    );
    return response.data.election;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const assignAdminsApi = async (
  payload: AssignAdminsPayload,
): Promise<AdminAssignmentResponse> => {
  try {
    const response = await api.post<AdminAssignmentResponse>(
      `/elections/${payload.electionId}/admins`,
      { adminIds: payload.adminIds },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const getElectionAdminsApi = async (electionId: number): Promise<ElectionAdmin[]> => {
  try {
    const response = await api.get<{ admins: ElectionAdmin[] }>(
      `/elections/${electionId}/admins`,
    );
    return response.data.admins;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const removeAdminApi = async (
  electionId: number,
  adminId: number,
): Promise<void> => {
  try {
    await api.delete<{ message: string }>(
      `/elections/${electionId}/admins/${adminId}`,
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const getElectionResultApi = async (
  electionId: number,
): Promise<ElectionResultData> => {
  try {
    const response = await api.get<{ data: ElectionResultData }>(
      `/elections/${electionId}/results`,
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

export type {
  ElectionListItem,
  IndividualCandidate,
  CandidatePair,
  ElectionDetail,
  ElectionAdmin,
  CastVotePayload,
  CastVoteResult,
  VotingStatusResult,
  VotingStatusResponse,
  AdminUser,
  AssignAdminsPayload,
  AdminAssignmentResponse,
  CandidatePairVoteResult,
  ElectionResultData,
  CreateCandidatePairPayload,
  UpdateCandidatePairPayload,
  CandidatePairResponse,
};

export {
  getElectionsApi,
  getElectionByIdApi,
  getCandidatePairsByElectionApi,
  createCandidatePairApi,
  updateCandidatePairApi,
  deleteCandidatePairApi,
  castVoteApi,
  getVotingStatusApi,
  deleteElectionApi,
  updateElectionApi,
  assignAdminsApi,
  getElectionAdminsApi,
  removeAdminApi,
  getElectionResultApi,
};