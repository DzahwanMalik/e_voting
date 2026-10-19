import axios from "axios";
import { api } from "@/lib/axios";

interface ResetVotingResult {
  deletedVotes: number;
  resetVoters: number;
}

interface ResetVotingResponse {
  message: string;
  data: ResetVotingResult;
}

const resetAllVotesApi = async (): Promise<ResetVotingResponse> => {
  try {
    const response = await api.post<ResetVotingResponse>("/votes/reset");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

export type { ResetVotingResult, ResetVotingResponse };
export { resetAllVotesApi };
