import { transporter } from "../common/transporter";
import dotenv from "dotenv";
dotenv.config();

export const sendOTPEmail = async (to: string, otp: string) => {
  const email = process.env.EMAIL_USER!;
  
  try {
    await transporter.sendMail({
      from: email,
      to,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
    });
    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending OTP email to ${to}:`, error);
  }
};
