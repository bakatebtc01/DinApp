import { Request, Response } from 'express';
import * as userService from '../services/userService';
import * as otpService from '../services/otpService';
import * as pinService from '../services/pinService';
import logger from '../utils/logger';

export const signup = async (req: Request, res: Response) => {
    try {
        const { countryCode, phoneNumber, deviceId } = req.body;

        if (!countryCode || !phoneNumber) {
            return res.status(400).json({ error: 'Missing phone number or country code' });
        }

        // Check if user exists
        const existingUser = await userService.findUserByPhone(countryCode, phoneNumber);
        if (existingUser) {
            // In a real app we might just send OTP to login
            return res.status(409).json({ error: 'User already exists. Please login.' });
        }

        // Create User
        const newUser = await userService.createUser(countryCode, phoneNumber, deviceId);

        // Send OTP
        await otpService.generateOtp(phoneNumber);

        res.status(201).json({
            message: 'User created. OTP sent.',
            userId: newUser.id
        });

    } catch (error) {
        logger.error('Signup error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { phoneNumber, otp } = req.body;

        const isValid = await otpService.verifyOtp(phoneNumber, otp);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid or expired OTP' });
        }

        // Logic to mark user as active/verified would go here in userService

        res.status(200).json({ message: 'Phone verified successfully.' });

    } catch (error) {
        logger.error('OTP Verify error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const setPin = async (req: Request, res: Response) => {
    try {
        const { userId, pin } = req.body;

        if (!userId || !pin) {
            return res.status(400).json({ error: 'Missing userId or PIN' });
        }

        await pinService.setPin(userId, pin);
        res.status(200).json({ message: 'PIN set successfully.' });

    } catch (error: any) {
        logger.error('Set PIN error:', error);
        if (error.message && error.message.includes('6 digits')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
