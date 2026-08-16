import jwt from "jsonwebtoken";
import { IUserDocument } from "../models/user.model";
import { Response } from "express";

export const generateToken = (res:Response, user:IUserDocument ) => {
    const token = jwt.sign({userId:user._id}, process.env.SECRET_KEY!, {expiresIn:'1d'});
    res.cookie("token", token, {
        httpOnly: true,
        // Stripe sends the customer back to us as a top level navigation from its own
        // domain. Under 'strict' the browser withholds the cookie on that hop, so the
        // user lands on the order page logged out. 'lax' still keeps the cookie off
        // cross site POSTs and embedded requests, which is what matters for CSRF.
        sameSite: 'lax',
        // Without this the cookie is also sent over plain HTTP, where anyone on the
        // network path can read it. Left off in development so localhost still works.
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24*60*60*1000
    });
    return token;
}