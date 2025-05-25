import 'dotenv/config'
export const MONGO_URL=process.env.MONGO_URL as string;
export const CLERK_PUBLISHABLE_KEY=process.env.CLERK_PUBLISHABLE_KEY as string;
export const CLERK_SECRET_KEY=process.env.CLERK_SECRET_KEY as string;