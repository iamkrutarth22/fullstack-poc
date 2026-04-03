import axios from "axios";
import { apiClient } from "../axiosInstance";


export const signupHandler = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await apiClient.post("/signup", { name, email, password });
  return response.data;
};


export const verifyOTPHandler = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  const response = await apiClient.post("/auth/verify-otp", { email, otp });
  return response.data;
};

export const resendOTPHandler = async ({ email }: { email: string }) => {
  const response = await apiClient.post("/auth/send-otp", { email });
  return response.data;
};

