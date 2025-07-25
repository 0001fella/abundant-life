import mongoose from "mongoose";

const PrayerSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Anonymous" },
    request: { type: String, required: true },
    prayedFor: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Prayer || mongoose.model("Prayer", PrayerSchema);
