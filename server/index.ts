import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRoute from "./routes/user.route";
import restaurantRoute from "./routes/restaurant.route";
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import path from "path";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 8000;
const DIRNAME = path.resolve();

// Hosts like Render terminate TLS at their own proxy and forward the original client
// address in X-Forwarded-For. Without this every request looks like it came from the
// proxy, which would put all users into a single rate limit bucket.
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// Stripe signs the exact bytes it sends, so the webhook has to see the raw body.
// Mounting this ahead of the JSON parser stops express from consuming it first.
app.use("/api/v1/order/webhook", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5180",
    credentials: true,
}));

// crossOriginResourcePolicy is relaxed because menu and restaurant images are served
// from Cloudinary rather than from this origin.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Login, signup and password reset are the endpoints worth guessing at, so they get a
// tighter budget than ordinary browsing. Each one builds its own limiter: sharing a
// single instance would pool every endpoint into one counter, so a burst of signups
// would lock out login too.
const authLimiter = () => rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { success: false, message: "Too many attempts. Try again in a few minutes." },
});

app.use("/api/v1/user/login", authLimiter());
app.use("/api/v1/user/signup", authLimiter());
app.use("/api/v1/user/forgot-password", authLimiter());
app.use("/api/v1/user/reset-password", authLimiter());
app.use("/api/v1/user/verify-email", authLimiter());

app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);

// The built client is only served by the API process in production; in development
// Vite serves it and proxies /api back here.
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(DIRNAME, "/client/dist")));
    app.use("*", (_, res) => {
        res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
    });
}

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

start();
