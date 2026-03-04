import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import Book from "./models/Book.js";
import Category from "./models/Category.js";
import Client from "./models/Client.js";
import Transaction from "./models/Transaction.js";
import Settings from "./models/Settings.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI =
  "mongodb+srv://admin:dbPassword@cluster0.pmtl12p.mongodb.net/library?appName=Cluster0";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("Connection error:", err));

const syncCategories = async (categories) => {
  if (categories && Array.isArray(categories)) {
    for (let catName of categories) {
      const trimmed = catName.trim();
      if (trimmed !== "") {
        await Category.findOneAndUpdate(
          { name: trimmed },
          { name: trimmed },
          { upsert: true },
        );
      }
    }
  }
};

app.get("/api/books", async (req, res) => {
  try {
    res.json(await Book.find());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    await syncCategories(req.body.categories);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/books/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    await syncCategories(req.body.categories);
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    res.json(await Category.find().sort({ name: 1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) return res.status(200).json(existing);
    const newCat = new Category({ name: name.trim() });
    await newCat.save();
    res.status(201).json(newCat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/api/clients", async (req, res) => {
  try {
    const clients = await Client.find();
    const transactions = await Transaction.find({ finePaid: { $ne: true } });
    const settings = (await Settings.findOne()) || {
      fineAmount: 10,
      gracePeriod: 0,
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const clientsWithFines = clients.map((client) => {
      const clientObj = client.toObject();
      const clientTxs = transactions.filter(
        (tx) => String(tx.clientId) === client._id.toString(),
      );

      let totalFine = 0;
      clientTxs.forEach((tx) => {
        if (tx.dueDate) {
          const dueDate = new Date(tx.dueDate);
          dueDate.setHours(0, 0, 0, 0);

          if (today > dueDate) {
            const diffDays = Math.floor(
              (today - dueDate) / (1000 * 60 * 60 * 24),
            );
            if (diffDays > settings.gracePeriod) {
              totalFine +=
                (diffDays - settings.gracePeriod) * settings.fineAmount;
            }
          }
        }
      });

      return { ...clientObj, fineAmount: totalFine, hasFine: totalFine > 0 };
    });

    res.json(clientsWithFines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/clients/:id/pay-fine", async (req, res) => {
  try {
    const clientId = req.params.id;

    await Transaction.updateMany(
      { clientId: clientId, status: "returned", finePaid: { $ne: true } },
      { $set: { finePaid: true } },
    );

    const remainingTransactions = await Transaction.find({
      clientId: clientId,
      status: "borrowed",
      finePaid: { $ne: true },
    });

    const settings = (await Settings.findOne()) || {
      fineAmount: 10,
      gracePeriod: 0,
    };
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let remainingFine = 0;
    remainingTransactions.forEach((tx) => {
      if (tx.dueDate) {
        const dueDate = new Date(tx.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        if (today > dueDate) {
          const diffDays = Math.floor(
            (today - dueDate) / (1000 * 60 * 60 * 24),
          );
          if (diffDays > settings.gracePeriod) {
            remainingFine +=
              (diffDays - settings.gracePeriod) * settings.fineAmount;
          }
        }
      }
    });

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { hasFine: remainingFine > 0 },
      { new: true },
    );

    res.json({
      ...updatedClient.toObject(),
      fineAmount: remainingFine,
      hasFine: remainingFine > 0,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/api/clients", async (req, res) => {
  try {
    const n = new Client(req.body);
    await n.save();
    res.status(201).json(n);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
app.patch("/api/clients/:id", async (req, res) => {
  try {
    const u = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(u);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
app.delete("/api/clients/:id", async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    res.json(await Transaction.find().sort({ date: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const newTx = new Transaction(req.body);
    await newTx.save();
    await Book.findByIdAndUpdate(req.body.bookId, {
      $inc: { available: -req.body.quantity },
    });
    res.status(201).json(newTx);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch("/api/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    const updatedTx = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (transaction.status !== "returned" && req.body.status === "returned") {
      await Book.findByIdAndUpdate(transaction.bookId, {
        $inc: { available: transaction.quantity },
      });
    }
    res.json(updatedTx);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (tx && tx.status !== "returned") {
      await Book.findByIdAndUpdate(tx.bookId, {
        $inc: { available: tx.quantity },
      });
    }
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/settings", async (req, res) => {
  try {
    let s =
      (await Settings.findOne()) ||
      (await Settings.create({
        fineAmount: 10,
        gracePeriod: 0,
        currency: "$",
      }));
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/settings", async (req, res) => {
  try {
    res.json(
      await Settings.findOneAndUpdate({}, req.body, {
        new: true,
        upsert: true,
      }),
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
