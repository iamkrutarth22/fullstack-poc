import bcrypt from "bcrypt";
import { generateOTP } from "common/helper";

export const createOTP = async () => {
  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  return { otp, hashedOtp, expiresAt }; 
};