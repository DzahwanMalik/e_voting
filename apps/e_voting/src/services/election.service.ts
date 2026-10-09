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
  electionAdmins?: ElectionAdmin[];
  _count?: {
    candidates: number;
    electionVoters?: number;
    electionAdmins?: number;
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

const getElectionAdminsApi = async (electionId: number): Promise<AdminUser[]> => {
  try {
    const response = await api.get<{ admins: AdminUser[] }>(
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

export type {
  ElectionListItem,
  Candidate,
  ElectionDetail,
  ElectionAdmin,
  CastVotePayload,
  CastVoteResult,
  VotingStatusResult,
  VotingStatusResponse,
  AdminUser,
  AssignAdminsPayload,
  AdminAssignmentResponse,
};

export {
  getElectionsApi,
  getElectionByIdApi,
  getCandidatesByElectionApi,
  castVoteApi,
  getVotingStatusApi,
  deleteElectionApi,
  updateElectionApi,
  assignAdminsApi,
  getElectionAdminsApi,
  removeAdminApi,
};
