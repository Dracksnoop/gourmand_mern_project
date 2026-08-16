import crypto from "crypto";

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Math.random is not seeded from a cryptographic source, so codes drawn from it are
// predictable to anyone who can observe enough of them. randomInt draws from the same
// pool as the rest of Node's crypto primitives.
export const generateVerificationCode = (length = 6): string => {
    let verificationCode = '';

    for (let i = 0; i < length; i++) {
        verificationCode += CHARACTERS.charAt(crypto.randomInt(CHARACTERS.length));
    }

    return verificationCode;
};
