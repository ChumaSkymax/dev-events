import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * TypeScript interface for Event document
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO format: YYYY-MM-DD
  time: string; // Consistent format: HH:MM AM/PM Timezone
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event schema definition
 */
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Title cannot be empty",
      },
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Description cannot be empty",
      },
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Overview cannot be empty",
      },
    },
    image: {
      type: String,
      required: [true, "Image is required"],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Image cannot be empty",
      },
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Venue cannot be empty",
      },
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Location cannot be empty",
      },
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      validate: {
        validator: (value: string) => {
          // Validate ISO date format (YYYY-MM-DD)
          const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!isoDateRegex.test(value)) return false;
          const date = new Date(value);
          return date instanceof Date && !isNaN(date.getTime());
        },
        message: "Date must be in ISO format (YYYY-MM-DD)",
      },
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Time cannot be empty",
      },
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be one of: online, offline, hybrid",
      },
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Audience cannot be empty",
      },
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) && value.length > 0,
        message: "Agenda must be a non-empty array",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: "Organizer cannot be empty",
      },
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) && value.length > 0,
        message: "Tags must be a non-empty array",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Generates a URL-friendly slug from a title
 * Converts to lowercase, replaces spaces and special chars with hyphens
 */
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Normalizes date to ISO format (YYYY-MM-DD)
 * Accepts various date formats and converts to standard format
 */
const normalizeDate = (date: string): string => {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }
    // Convert to ISO format and extract date part (YYYY-MM-DD)
    return dateObj.toISOString().split("T")[0];
  } catch {
    // If parsing fails, check if already in ISO format
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (isoDateRegex.test(date)) {
      return date;
    }
    throw new Error(
      `Invalid date format: ${date}. Expected YYYY-MM-DD or valid date string.`
    );
  }
};

/**
 * Normalizes time to consistent format
 * Ensures time is properly formatted and trimmed
 */
const normalizeTime = (time: string): string => {
  return time.trim();
};

/**
 * Pre-save hook: Generates slug from title and normalizes date/time
 * Only regenerates slug if title has changed (for updates)
 */
eventSchema.pre("save", function (next) {
  // Generate slug only if title changed or document is new
  if (this.isModified("title") || this.isNew) {
    this.slug = generateSlug(this.title);
  }

  // Normalize date to ISO format if date field is modified
  if (this.isModified("date")) {
    try {
      this.date = normalizeDate(this.date);
    } catch (error) {
      return next(
        error instanceof Error ? error : new Error("Date normalization failed")
      );
    }
  }

  // Normalize time format if time field is modified
  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }

  next();
});

// Create unique index on slug for fast lookups and uniqueness constraint
eventSchema.index({ slug: 1 }, { unique: true });

/**
 * Event model
 */
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;
