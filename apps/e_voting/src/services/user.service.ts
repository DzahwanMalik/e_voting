import axios from "axios";
import { api } from "@/lib/axios";

interface AdminUser {
  id: number;
  username: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface GetAdminsResponse {
  admins: AdminUser[];
}

interface GetAdminResponse {
  admin: AdminUser;
}

interface CreateAdminPayload {
  username: string;
  password: string;
  name: string;
}

interface UpdateAdminPayload {
  name?: string | null;
  username?: string;
  password?: string;
}

interface AdminMessageResponse {
  message: string;
  admin: AdminUser;
}

interface AdminDeleteResponse {
  message: string;
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

const getAdminByIdApi = async (id: number): Promise<AdminUser> => {
  try {
    const response = await api.get<GetAdminResponse>(`/users/admins/${id}`);
    return response.data.admin;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message as string, { cause: error });
    }
    throw error;
  }
};

const createAdminApi = async (
  payload: CreateAdminPayload,
): Promise<AdminMessageResponse> => {
  try {
    const response = await api.post<AdminMessageResponse>(
      "/users/admins",
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

const updateAdminApi = async (
  id: number,
  payload: UpdateAdminPayload,
): Promise<AdminMessageResponse> => {
  try {
    const response = await api.put<AdminMessageResponse>(
      `/users/admins/${id}`,
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

const deleteAdminApi = async (id: number): Promise<AdminDeleteResponse> => {
  try {
    const response = await api.delete<AdminDeleteResponse>(
      `/users/admins/${id}`,
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
  AdminUser,
  GetAdminsResponse,
  GetAdminResponse,
  CreateAdminPayload,
  UpdateAdminPayload,
  AdminMessageResponse,
  AdminDeleteResponse,
};

export {
  getAllAdminsApi,
  getAdminByIdApi,
  createAdminApi,
  updateAdminApi,
  deleteAdminApi,
};
