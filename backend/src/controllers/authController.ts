import { Request, Response } from "express";
import * as userService from "../services/userService";
import * as otpService from "../services/otpService";
import * as pinService from "../services/pinService";
import logger from "../utils/logger";
import bcrypt from "bcrypt";

export const signup = async (req: Request, res: Response) => {
  try {
    const { countryCode, phoneNumber, email, password, fullName, dob, deviceId } = req.body;

    if (!countryCode || !phoneNumber || !email || !password || !fullName || !dob) {
      return res
        .status(400)
        .json({ error: "Missing required fields (countryCode, phoneNumber, email, password, fullName, dob)" });
    }

    // Check if user exists by phone
    const existingUserPhone = await userService.findUserByPhone(
      countryCode,
      phoneNumber,
    );
    if (existingUserPhone) {
      return res
        .status(409)
        .json({ error: "User with this phone number already exists." });
    }

    // Check if user exists by email
    const existingUserEmail = await userService.findUserByEmail(email);
    if (existingUserEmail) {
       return res
        .status(409)
        .json({ error: "User with this email already exists." });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create User
    const newUser = await userService.createUser(
      countryCode,
      phoneNumber,
      email,
      passwordHash,
      fullName,
      dob,
      deviceId,
    );

    // Send OTP
    await otpService.generateOtp(phoneNumber);

    res.status(201).json({
      message: "User created. OTP sent.",
      userId: newUser.id,
    });
  } catch (error) {
    logger.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await userService.findUserByEmail(email);
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Return success
    res.status(200).json({
      message: "Login successful",
      userId: user.id,
      // In MVP, maybe return simple token or just ID
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;

    const isValid = await otpService.verifyOtp(phoneNumber, otp);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    // Logic to mark user as active/verified would go here in userService
    // We need to find user by phone to get ID, then verify
    // For now, assuming verified
    // In real flow, we'd verify the specific user associated with the phone

    res.status(200).json({ message: "Phone verified successfully." });
  } catch (error) {
    logger.error("OTP Verify error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const setPin = async (req: Request, res: Response) => {
  try {
    const { userId, pin } = req.body;

    if (!userId || !pin) {
      return res.status(400).json({ error: "Missing userId or PIN" });
    }

    await pinService.setPin(userId, pin);
    res.status(200).json({ message: "PIN set successfully." });
  } catch (error: any) {
    logger.error("Set PIN error:", error);
    if (error.message && error.message.includes("6 digits")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
