import mongoose, { Mongoose } from "mongoose";

/**
 * Interface for the cached MongoDB connection
 * This helps TypeScript understand the structure of our cached connection
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Global variable to cache the Mongoose connection
 * In serverless environments (like Vercel), this prevents creating multiple connections
 * In development, this helps avoid connection issues with hot module reloading
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

/**
 * Get or create the cached Mongoose connection object
 * Uses a global variable that persists across hot reloads in development
 */
const getMongooseCache = (): MongooseCache => {
  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }
  return global.mongoose;
};

/**
 * Environment variable for MongoDB connection string
 * Make sure to set MONGODB_URI in your .env.local file
 */
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

/**
 * Validates that the MongoDB URI is configured
 * Throws a descriptive error if the URI is missing
 */
const validateMongoUri = (): string => {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }
  return MONGODB_URI;
};

/**
 * Establishes a connection to MongoDB using Mongoose
 * Implements connection caching to prevent multiple connections in serverless environments
 *
 * @returns Promise that resolves to the Mongoose instance
 * @throws Error if MONGODB_URI is not defined or connection fails
 *
 * @example
 * ```typescript
 * import connectDB from '@/lib/mongodb';
 *
 * // In an API route or server component
 * await connectDB();
 * // Now you can use mongoose models
 * ```
 */
const connectDB = async (): Promise<Mongoose> => {
  const cache = getMongooseCache();

  // If we already have a cached connection, return it immediately
  if (cache.conn) {
    return cache.conn;
  }

  // If there's already a connection promise in progress, wait for it
  // This prevents multiple simultaneous connection attempts
  if (cache.promise) {
    return cache.promise;
  }

  // Validate MongoDB URI before attempting connection
  const uri = validateMongoUri();

  // Create a new connection promise
  cache.promise = mongoose.connect(uri).then((mongooseInstance: Mongoose) => {
    // Cache the successful connection
    cache.conn = mongooseInstance;
    return mongooseInstance;
  });

  try {
    // Wait for the connection to be established
    const mongooseInstance = await cache.promise;

    // Log successful connection (only in development)
    if (process.env.NODE_ENV === "development") {
      console.log("✅ MongoDB connected successfully");
    }

    return mongooseInstance;
  } catch (error) {
    // Clear the promise cache on error to allow retry
    cache.promise = null;

    // Log error and rethrow with context
    console.error("❌ MongoDB connection error:", error);
    throw new Error(
      `Failed to connect to MongoDB: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

/**
 * Gracefully closes the MongoDB connection
 * Useful for cleanup in testing or when shutting down the application
 *
 * @returns Promise that resolves when the connection is closed
 */
export const disconnectDB = async (): Promise<void> => {
  const cache = getMongooseCache();

  if (cache.conn) {
    await cache.conn.disconnect();
    cache.conn = null;
    cache.promise = null;

    if (process.env.NODE_ENV === "development") {
      console.log("✅ MongoDB disconnected");
    }
  }
};

/**
 * Default export: MongoDB connection function
 */
export default connectDB;
