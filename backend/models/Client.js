import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  hasFine: { type: Boolean, default: false },
  fineAmount: { type: Number, default: 0 },
});

export default mongoose.model("Client", clientSchema);
