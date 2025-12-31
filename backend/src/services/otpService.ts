import logger from '../utils/logger';

// In-memory store for OTPs (strictly for Sandbox/Dev)
// In production, use Redis.
const otpStore: Record<string, string> = {};

export const generateOtp = async (phone: string): Promise<string> => {
    // Fixed OTP for Sandbox ease
    const otp = '123456';
    otpStore[phone] = otp;

    logger.info(`[OTP STUB] Generated OTP for ${phone}: ${otp}`);
    return otp;
};

export const verifyOtp = async (phone: string, otp: string): Promise<boolean> => {
    const storedOtp = otpStore[phone];
    if (!storedOtp) return false;
    if (storedOtp !== otp) return false;

    // Clear OTP after success
    delete otpStore[phone];
    return true;
};
