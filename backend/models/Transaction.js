import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  clientName: String,
  bookTitle: String,
  phone: String,
  quantity: { type: Number, required: true },
  days: Number,
  date: { type: String, required: true },
  dueDate: String,
  status: {
    type: String,
    enum: ["borrowed", "reserved", "returned"],
    default: "borrowed",
  },
  finePaid: { type: Boolean, default: false },
});

export default mongoose.model("Transaction", transactionSchema);
