import axios from "axios";
import { api } from "@/lib/axios";

interface AdminUser {
  id: number;
  username: string;
  name: string | null;
  role: string;
  createdAt: string;
}

interface GetAdminsResponse {
  admins: AdminUser[];
}

const getAllAdminsApi = async (): Promise<AdminUser[]> => {
  try {
    const response = await api.get<GetAdminsResponse>("/users/admins");
    return response.data.admins;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

export type { AdminUser, GetAdminsResponse };
export { getAllAdminsApi };
