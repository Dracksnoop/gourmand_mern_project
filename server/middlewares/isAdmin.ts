import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";

// The client hides the admin screens from ordinary accounts, but that is only a
// convenience: nothing stops someone calling these endpoints directly, so the role
// check has to live on the server as well.
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.id).select("admin");
        if (!user?.admin) {
            return res.status(403).json({
                success: false,
                message: "This action is restricted to restaurant accounts"
            });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
