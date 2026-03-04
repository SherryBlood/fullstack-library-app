import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  total: { type: Number, required: true },
  available: { type: Number, required: true },
  categories: [String],
  description: String,
  image: String,
});

export default mongoose.model("Book", bookSchema);
