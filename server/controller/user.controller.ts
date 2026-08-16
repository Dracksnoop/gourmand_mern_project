import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto"; 
import cloudinary from "../utils/cloudinary";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateToken } from "../utils/generateToken";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email";

// Anything in here must never reach the client. Leaving the verification and reset
// tokens on the payload would let a caller confirm an address they don't own.
const SAFE_USER_FIELDS = "-password -verificationToken -verificationTokenExpiresAt -resetPasswordToken -resetPasswordTokenExpiresAt";

// Reset tokens are stored as a digest, never in the clear. The raw token exists only in
// the email we send, so a copy of the users collection is not enough to hijack accounts.
const hashResetToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullname, email, password, contact } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exist with this email"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken =  generateVerificationCode();

        user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            contact: Number(contact),
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        })
        generateToken(res,user);

        // A failure here must not undo the signup, so it is logged and swallowed.
        // The user can still verify later from the resend flow.
        try {
            await sendVerificationEmail(email, verificationToken);
        } catch (error) {
            console.error(`Could not send verification email to ${email}:`, error);
        }

        const userWithoutPassword = await User.findOne({ email }).select(SAFE_USER_FIELDS);
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: userWithoutPassword
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            });
        }
        generateToken(res, user);
        user.lastLogin = new Date();
        await user.save();

        const userWithoutPassword = await User.findOne({ email }).select(SAFE_USER_FIELDS);
        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: userWithoutPassword
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { verificationCode } = req.body;
       
        const user = await User.findOne({ verificationToken: verificationCode, verificationTokenExpiresAt: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token"
            });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined
        await user.save();

        try {
            await sendWelcomeEmail(user.email, user.fullname);
        } catch (error) {
            console.error(`Could not send welcome email to ${user.email}:`, error);
        }

        const verifiedUser = await User.findById(user._id).select(SAFE_USER_FIELDS);
        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user: verifiedUser,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const logout = async (_: Request, res: Response) => {
    try {
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        // Answer identically whether or not the address is registered, otherwise this
        // endpoint doubles as a way to enumerate which emails have accounts.
        const acknowledgement = {
            success: true,
            message: "If an account exists for that address, a reset link is on its way."
        };

        if (!user) {
            return res.status(200).json(acknowledgement);
        }

        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = hashResetToken(resetToken);
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        try {
            await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/reset-password/${resetToken}`);
        } catch (error) {
            console.error(`Could not send password reset email to ${user.email}:`, error);
        }

        return res.status(200).json(acknowledgement);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await User.findOne({ resetPasswordToken: hashResetToken(token), resetPasswordTokenExpiresAt: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }
        //update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        try {
            await sendResetSuccessEmail(user.email);
        } catch (error) {
            console.error(`Could not send reset confirmation email to ${user.email}:`, error);
        }

        return res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const checkAuth = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select(SAFE_USER_FIELDS);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        };
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const { fullname, email, address, city, country, profilePicture } = req.body;

        const updatedData: Record<string, string> = { fullname, email, address, city, country };

        // The client only sends profilePicture when a new file was picked, and it arrives
        // as a data URI. Saving that string straight to Mongo would store the whole image
        // in the document, so upload it and keep the hosted URL instead.
        if (profilePicture) {
            const uploadResponse = await cloudinary.uploader.upload(profilePicture);
            updatedData.profilePicture = uploadResponse.secure_url;
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select(SAFE_USER_FIELDS);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success:true,
            user,
            message:"Profile updated successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
