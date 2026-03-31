import axios from "axios";

export const signupHandler = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post("http://localhost:8080/api/signup", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
};

export const verifyOTPHandler = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/verify-otp",
      { email, otp },
    );
    return response.data;
  } catch (err) {
    console.error("OTP verify error:", err);
    throw err;
  }
};

export const resendOTPHandler = async ({ email }: { email: string }) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/send-otp",
      { email },
    );
    return response.data;
  } catch (err) {
    console.error("Resend OTP error:", err);
    throw err;
  }
};
