import db from "../db/db.js";
const { main } = db;
async function processTransaction(transaction) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Transaction processing started for:", transaction);
      const userPaymentAccount = transaction.paymentAccounts.find(
        (account) => account.id === transaction.toAddress
      );
  /*     if (userPaymentAccount.balance < transaction.amount) {
        return res.status(500).json({
          status: "error",
          message: "Transfer failed: The amount exceeds your current balance.",
        });
      } */
     console.log(userPaymentAccount)
        userPaymentAccount
      const newTransaction = await main.transaction.create({
        data: {
          amount: transaction.amount,
          toAddress: userPaymentAccount,
          currency:transaction.currency,
          status: "pending",
          type:"Deposit",
          timestamp: new Date(),
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

        const updateUser = await main.user.update({
            where: {
                username: transaction.username,
            },
            data: {
              balance: userPaymentAccount.balance+amount,
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
