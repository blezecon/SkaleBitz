import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    dealId: { type: mongoose.Schema.Types.ObjectId, ref: "Deal", required: true },
    investorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => typeof value === "number" && value > 0,
        message: "Amount must be a positive number",
      },
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
      trim: true,
    },
  },
  { timestamps: true }
);

investmentSchema.index({ dealId: 1 });
investmentSchema.index({ investorId: 1 });
investmentSchema.index({ dealId: 1, investorId: 1 });

export const createInvestmentModel = (connection = mongoose.connection) =>
  connection.models.Investment || connection.model("Investment", investmentSchema);
