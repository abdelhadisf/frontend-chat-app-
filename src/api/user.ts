import { api } from "./axios";

export type UpdateMeDto = { firstname?: string };
export async function updateMe(data: UpdateMeDto) {
  const res = await api.patch("/users/me", data);
  return res.data as { id: string; email: string; firstname?: string };
}

export type ChangePasswordDto = { currentPassword: string; newPassword: string };
export async function changePassword(data: ChangePasswordDto) {
  const res = await api.post("/auth/change-password", data);
  return res.data as { error: boolean; message: string };
}
