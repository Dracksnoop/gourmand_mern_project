import jwt from "jsonwebtoken";
import { IUserDocument } from "../models/user.model";
import { Response } from "express";

export const generateToken = (res:Response, user:IUserDocument ) => {
    const token = jwt.sign({userId:user._id}, process.env.SECRET_KEY!, {expiresIn:'1d'});
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: 'strict',
        // Without this the cookie is also sent over plain HTTP, where anyone on the
        // network path can read it. Left off in development so localhost still works.
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24*60*60*1000
    });
    return token;
}