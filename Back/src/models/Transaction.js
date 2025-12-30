import mongoose from "mongoose";

export const TRANSACTION_TYPES = ["invest", "repayment", "refund"];

const transactionSchema = new mongoose.Schema(
  {
    investmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Investment", required: true },
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => typeof value === "number" && value > 0,
        message: "Amount must be a positive number",
      },
    },
    type: { type: String, enum: TRANSACTION_TYPES, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

transactionSchema.index({ investmentId: 1, createdAt: -1 });
transactionSchema.index({ type: 1 });

export const createTransactionModel = (connection = mongoose.connection) =>
  connection.models.Transaction || connection.model("Transaction", transactionSchema);