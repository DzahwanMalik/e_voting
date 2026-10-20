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

interface CandidatePairListItem {
  id: number;
  electionId: number;
  election?: {
    id: number;
    title: string;
  };
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
  votedCount?: number;
  unvotedCount?: number;
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

interface CreateElectionPayload {
  title: string;
  description?: string | null;
}

interface CreateElectionResponse {
  message: string;
  election: {
    id: number;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

interface UpdateElectionPayload {
  title?: string;
  description?: string | null;
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
  candidatePhoto?: File | null;
  candidateDescription?: string | null;
  candidateBirthday: string;
  viceName: string;
  vicePhoto?: File | null;
  viceDescription?: string | null;
  viceBirthday: string;
  pairPhoto?: File | null;
  vision: string;
  mission: string;
}

interface UpdateCandidatePairPayload {
  candidateName?: string;
  candidatePhoto?: File | null;
  candidateDescription?: string | null;
  candidateBirthday?: string;
  viceName?: string;
  vicePhoto?: File | null;
  viceDescription?: string | null;
  viceBirthday?: string;
  pairPhoto?: File | null;
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

const createElectionApi = async (
  payload: CreateElectionPayload,
): Promise<CreateElectionResponse> => {
  try {
    const response = await api.post<CreateElectionResponse>("/elections", payload);
    return response.data;
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

const buildCandidatePairFormData = (payload: {
  electionId?: number;
  candidateName?: string;
  candidatePhoto?: File | null;
  candidateDescription?: string | null;
  candidateBirthday?: string;
  viceName?: string;
  vicePhoto?: File | null;
  viceDescription?: string | null;
  viceBirthday?: string;
  pairPhoto?: File | null;
  vision?: string;
  mission?: string;
}): FormData => {
  const formData = new FormData();

  if (payload.electionId !== undefined) {
    formData.append("electionId", String(payload.electionId));
  }
  if (payload.candidateName !== undefined) {
    formData.append("candidateName", payload.candidateName);
  }
  if (payload.candidateDescription !== undefined) {
    formData.append("candidateDescription", payload.candidateDescription ?? "");
  }
  if (payload.candidateBirthday !== undefined) {
    formData.append("candidateBirthday", payload.candidateBirthday);
  }
  if (payload.viceName !== undefined) {
    formData.append("viceName", payload.viceName);
  }
  if (payload.viceDescription !== undefined) {
    formData.append("viceDescription", payload.viceDescription ?? "");
  }
  if (payload.viceBirthday !== undefined) {
    formData.append("viceBirthday", payload.viceBirthday);
  }
  if (payload.vision !== undefined) {
    formData.append("vision", payload.vision);
  }
  if (payload.mission !== undefined) {
    formData.append("mission", payload.mission);
  }

  // Handle photo fields: File → upload, null → "null" string (removal), undefined → skip
  if (payload.candidatePhoto instanceof File) {
    formData.append("candidatePhoto", payload.candidatePhoto);
  } else if (payload.candidatePhoto === null) {
    formData.append("candidatePhoto", "null");
  }

  if (payload.vicePhoto instanceof File) {
    formData.append("vicePhoto", payload.vicePhoto);
  } else if (payload.vicePhoto === null) {
    formData.append("vicePhoto", "null");
  }

  if (payload.pairPhoto instanceof File) {
    formData.append("pairPhoto", payload.pairPhoto);
  } else if (payload.pairPhoto === null) {
    formData.append("pairPhoto", "null");
  }

  return formData;
};

const createCandidatePairApi = async (
  payload: CreateCandidatePairPayload,
): Promise<CandidatePair> => {
  try {
    const formData = buildCandidatePairFormData(payload);
    const response = await api.post<{ message: string; candidatePair: CandidatePair }>(
      "/candidate-pairs",
      formData,
      {
        headers: {
          "Content-Type": null,
        },
      },
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
    const formData = buildCandidatePairFormData(payload);
    const response = await api.put<{ message: string; candidatePair: CandidatePair }>(
      `/candidate-pairs/${pairId}`,
      formData,
      {
        headers: {
          "Content-Type": null,
        },
      },
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

const getAllCandidatePairsApi = async (): Promise<CandidatePairListItem[]> => {
  try {
    const response = await api.get<{
      candidatePairs: CandidatePairListItem[];
    }>("/candidate-pairs");
    return response.data.candidatePairs;
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
  payload: UpdateElectionPayload,
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
  CandidatePairListItem,
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
  CreateElectionPayload,
  CreateElectionResponse,
  UpdateElectionPayload,
  CreateCandidatePairPayload,
  UpdateCandidatePairPayload,
  CandidatePairResponse,
};

export {
  getElectionsApi,
  getElectionByIdApi,
  createElectionApi,
  getCandidatePairsByElectionApi,
  getAllCandidatePairsApi,
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