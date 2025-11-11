import mongoose, { Schema, Document, Model, Types } from "mongoose";
import Event from "./event.model";

/**
 * TypeScript interface for Booking document
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking schema definition
 */
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true, // Index for faster queries on eventId
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => {
          // Email regex validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and... updatedAt
  }
);

/**
 * Pre-save hook: Validates that the referenced event exists
 * Throws an error if the eventId does not correspond to an existing Event
 */
bookingSchema.pre("save", async function (next) {
  try {
    // Check if eventId exists in the Event collection
    const event = await Event.findById(this.eventId);

    if (!event) {
      return next(new Error(`Event with ID ${this.eventId} does not exist`));
    }

    next();
  } catch (error) {
    // Handle database errors or other unexpected errors
    next(
      error instanceof Error
        ? error
        : new Error("Failed to validate event reference")
    );
  }
});

// Create index on eventId for faster queries (additional to schema-level index)
bookingSchema.index({ eventId: 1 });

/**
 * Booking model
 */
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
