import createError from "http-errors";
import { getDealsConnection } from "../db/dealsConnection.js";
import { createInvestmentModel } from "../models/Investment.js";
import { createTransactionModel, TRANSACTION_TYPES } from "../models/Transaction.js";

const getInvestmentModel = () => createInvestmentModel(getDealsConnection());
const getTransactionModel = () => createTransactionModel(getDealsConnection());
const NON_REPLICA_SET_CODE = 20; // MongoDB error code when transactions are run on non-replica deployments
const NON_REPLICA_TRANSACTION_MESSAGE = "Transaction numbers are only allowed on a replica set member";
const REPAYMENT_TYPES = TRANSACTION_TYPES.filter((type) => type !== "invest");
const logRollbackFailure = (message, error) => {
  // Replace with structured logger when available
  console.error(message, error);
};

const createInvestmentWithoutSession = async (
  { dealId, investorId, amount, status, toUserId },
  Investment,
  Transaction
) => {
  const investmentRecord = await Investment.create({
    dealId,
    investorId,
    amount,
    status,
  });

  try {
    await Transaction.create({
      investmentId: investmentRecord._id,
      fromUserId: investorId,
      toUserId,
      amount,
      type: "invest",
    });
  } catch (err) {
    try {
      await Investment.deleteOne({ _id: investmentRecord._id });
    } catch (rollbackErr) {
      logRollbackFailure("Failed to rollback investment after transaction error", rollbackErr);
    }
    throw err;
  }

  return investmentRecord;
};

const recordRepaymentWithoutSession = async (
  { investmentId, fromUserId, toUserId, amount, type },
  Investment,
  Transaction
) => {
  const investment = await Investment.findById(investmentId);
  if (!investment) {
    throw createError(404, "Investment not found");
  }

  return Transaction.create({
    investmentId,
    fromUserId,
    toUserId,
    amount,
    type,
  });
};

export const createInvestmentWithTransaction = async ({
  dealId,
  investorId,
  amount,
  toUserId,
  status = "active",
}) => {
  if (!dealId || !investorId) {
    throw createError(400, "dealId and investorId are required");
  }
  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    throw createError(400, "amount must be a positive number");
  }
  if (!toUserId) {
    throw createError(400, "toUserId is required for investment transaction");
  }

  const Investment = getInvestmentModel();
  const Transaction = getTransactionModel();
  const connection = getDealsConnection();
  const session = await connection.startSession();
  let investmentRecord;
  try {
    await session.withTransaction(async () => {
      const [investment] = await Investment.create(
        [{ dealId, investorId, amount, status }],
        { session }
      );
      investmentRecord = investment;

      await Transaction.create(
        [
          {
            investmentId: investment._id,
            fromUserId: investorId,
            toUserId,
            amount,
            type: "invest",
          },
        ],
        { session }
      );
    });
  } catch (err) {
    if (
      err?.code === NON_REPLICA_SET_CODE ||
      err?.message?.includes(NON_REPLICA_TRANSACTION_MESSAGE)
    ) {
      return createInvestmentWithoutSession(
        { dealId, investorId, amount, status, toUserId },
        Investment,
        Transaction
      );
    }
    throw err;
  } finally {
    await session.endSession();
  }

  return investmentRecord;
};

export const recordRepaymentTransaction = async ({
  investmentId,
  fromUserId,
  toUserId,
  amount,
  type = "repayment",
}) => {
  if (!investmentId) {
    throw createError(400, "investmentId is required");
  }
  if (!fromUserId || !toUserId) {
    throw createError(400, "fromUserId and toUserId are required");
  }
  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    throw createError(400, "amount must be a positive number");
  }
  if (!REPAYMENT_TYPES.includes(type)) {
    throw createError(400, "Invalid transaction type");
  }

  const Investment = getInvestmentModel();
  const Transaction = getTransactionModel();

  const connection = getDealsConnection();
  const session = await connection.startSession();
  let transactionRecord;

  try {
    await session.withTransaction(async () => {
      const investment = await Investment.findById(investmentId).session(session);
      if (!investment) {
        throw createError(404, "Investment not found");
      }

      const [createdTransaction] = await Transaction.create(
        [
          {
            investmentId,
            fromUserId,
            toUserId,
            amount,
            type,
          },
        ],
        { session }
      );
      transactionRecord = createdTransaction;
    });
  } catch (err) {
    if (
      err?.code === NON_REPLICA_SET_CODE ||
      err?.message?.includes(NON_REPLICA_TRANSACTION_MESSAGE)
    ) {
      return recordRepaymentWithoutSession(
        { investmentId, fromUserId, toUserId, amount, type },
        Investment,
        Transaction
      );
    }
    throw err;
  } finally {
    await session.endSession();
  }

  return transactionRecord;
};