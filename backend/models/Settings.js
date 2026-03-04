import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  fineAmount: { type: Number, default: 10 },
  gracePeriod: { type: Number, default: 0 },
  currency: { type: String, default: "$" },
});

export default mongoose.model("Settings", SettingsSchema);
