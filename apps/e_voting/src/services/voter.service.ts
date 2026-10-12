import axios from "axios";
import { api } from "@/lib/axios";

interface ElectionInfo {
  id: number;
  title: string;
  description: string | null;
}

interface ElectionVoterAssignment {
  id: number;
  electionId: number;
  hasVoted: boolean;
  createdAt: string;
  election: ElectionInfo;
}

interface VoterCreator {
  id: number;
  username: string;
  name: string | null;
  role: string;
}

interface VoterListItem {
  id: number;
  username: string;
  name: string | null;
  role: string;
  createdById: number | null;
  createdAt: string;
  updatedAt: string;
  createdBy: VoterCreator | null;
  electionVoters: ElectionVoterAssignment[];
}

type VoterDetail = VoterListItem;

interface VotersResponse {
  voters: VoterListItem[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

interface CreateVoterPayload {
  username: string;
  password: string;
  name: string;
  electionIds?: number[];
}

interface UpdateVoterPayload {
  name?: string;
  username?: string;
  password?: string;
}

interface VoterApiMessage {
  message: string;
}

const getVotersApi = async (params?: {
  electionId?: number;
  search?: string;
  page?: number;
}): Promise<VotersResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.electionId) {
      queryParams.append("electionId", String(params.electionId));
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }
    if (params?.page && params.page > 1) {
      queryParams.append("page", String(params.page));
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/voters?${queryString}` : "/voters";

    const response = await api.get<VotersResponse>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const getVoterByIdApi = async (id: number): Promise<VoterListItem> => {
  try {
    const response = await api.get<{ voter: VoterListItem }>(`/voters/${id}`);
    return response.data.voter;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const createVoterApi = async (
  payload: CreateVoterPayload,
): Promise<{ message: string; voter: VoterListItem }> => {
  try {
    const response = await api.post<{ message: string; voter: VoterListItem }>(
      "/voters",
      payload,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const updateVoterApi = async (
  id: number,
  payload: UpdateVoterPayload,
): Promise<{ message: string; voter: VoterListItem }> => {
  try {
    const response = await api.put<{ message: string; voter: VoterListItem }>(
      `/voters/${id}`,
      payload,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const deleteVoterApi = async (id: number): Promise<VoterApiMessage> => {
  try {
    const response = await api.delete<VoterApiMessage>(`/voters/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const enrollVoterToElectionsApi = async (
  voterId: number,
  electionIds: number[],
): Promise<{ message: string; electionVoters: unknown[] }> => {
  try {
    const response = await api.post<{
      message: string;
      electionVoters: unknown[];
    }>(`/voters/${voterId}/elections`, { electionIds });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const removeVoterFromElectionApi = async (
  voterId: number,
  electionId: number,
): Promise<VoterApiMessage> => {
  try {
    const response = await api.delete<VoterApiMessage>(
      `/voters/${voterId}/elections/${electionId}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

export type {
  VoterListItem,
  VotersResponse,
  VoterDetail,
  CreateVoterPayload,
  UpdateVoterPayload,
  VoterApiMessage,
  ElectionVoterAssignment,
  VoterCreator,
  ElectionInfo,
};

export {
  getVotersApi,
  getVoterByIdApi,
  createVoterApi,
  updateVoterApi,
  deleteVoterApi,
  enrollVoterToElectionsApi,
  removeVoterFromElectionApi,
};
