import request from './request';
import type { ApiResponse } from '@/types';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    nickname: string | null;
    avatar: string | null;
    role: string;
  };
}

export interface UserInfo {
  id: number;
  username: string;
  nickname: string | null;
  avatar: string | null;
  role: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

/** 登录 */
export const login = async (username: string, password: string) => {
  return request.post<LoginResponse>('/auth/login', { username, password })
    .then(r => r.data);
};

/** 获取当前用户信息 */
export const fetchProfile = async () => {
  return request.get<UserInfo>('/auth/profile').then(r => r.data);
};

/** 修改个人信息 */
export const updateProfile = async (data: { nickname?: string; avatar?: string }) => {
  return request.put<UserInfo>('/auth/profile', data).then(r => r.data);
};

/** 管理员：创建用户 */
export const registerUser = async (data: { username: string; password: string; nickname?: string; role?: string }) => {
  return request.post<{ id: number; username: string; nickname: string; role: string }>('/auth/register', data).then(r => r.data);
};

/** 管理员：用户列表 */
export const fetchUsers = async () => {
  return request.get<UserInfo[]>('/auth/users').then(r => r.data);
};

/** 管理员：修改用户 */
export const updateUser = async (id: number, data: { role?: string; status?: number }) => {
  return request.put(`/auth/users/${id}`, data).then(r => r.data);
};
