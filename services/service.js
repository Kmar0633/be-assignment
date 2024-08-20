import db from "../db/db.js";
const { main } = db;
async function processTransaction(transaction) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Transaction processing started for:", transaction);
      const userPaymentAccount = transaction.paymentAccounts.find(
        (account) => account.id === transaction.toAddress
      );
      if (!userPaymentAccount) {
        throw new Error("Payment account not found");
      }
      if (
        transaction.transactionType === "Withdraw" &&
        userPaymentAccount.balance < transaction.amount
      ) {
        throw new Error(
          "Insufficient Funds. Withdrawn amount exceeeds current balance"
        );
      }

      const account = await main.paymentAccount.findUnique({
        where: { id: transaction.toAddress },
        include: {
          paymentHistory: true,
        },
      });
      

      const paymentHistoryOne = await main.paymentHistory.findFirst({
        where: { paymentAccountId: account.id },
      });

      if (!paymentHistoryOne) {
        const paymentHistory = await main.paymentHistory.create({
          data: { paymentAccountId: account.id, amount: 0 },
        });
      }

      const paymentHistorySelect = await main.paymentHistory.findFirst({
        where: { paymentAccountId: account.id },
      });
     
      /*     if (userPaymentAccount.balance < transaction.amount) {
        return res.status(500).json({
          status: "error",
          message: "Transfer failed: The amount exceeds your current balance.",
        });
      } */

      const newTransaction = await main.transaction.create({
        data: {
          amount: transaction.amount,
          toAddressName: transaction.username,
          currency: transaction.currency,
          status: "pending",
          type: transaction.transactionType,
          timestamp: new Date(),
          paymentHistoryId: paymentHistorySelect.id,
        },
      });

      setTimeout(async () => {
        const processedTransaction = await main.transaction.update({
          where: {
            id: newTransaction.id,
          },
          data: {
            status: "processed",
          },
        });

        const updatePaymentAccount = await main.paymentAccount.update({
          where: {
            id: transaction.toAddress,
          },
          data: {
            balance:
              transaction.transactionType === "Deposit"
                ? account.balance + transaction.amount
                : account.balance - transaction.amount,
          },
        });
        console.log("Transaction processed for:", processedTransaction);
        resolve(processedTransaction);
      }, 30000); // 30 seconds
    } catch (error) {
      console.error("Error processing transaction:", error);
      reject(error);
    }
  });
}
export default {
  processTransaction,
};
