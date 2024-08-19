import jwt from "jsonwebtoken";
import db from "../../../../../db/db.js";
import helper from "../../helpers/helper.js";
import config from "../../../../../config/config.js";
import service from "../../../../../services/service.js";
const send = async (req, res, next) => {
    const { currency, amount, fromAddress, toAddress} = req.body;
    const { paymentAccounts,username } = req.user;
    console.log(username)
    console.log(req.user)
    try {
        const processedTransaction = await service.processTransaction({paymentAccounts, currency, username, amount, toAddress });
        res.json({
            status: 'success',
            message: 'Transaction processed successfully',
            data: processedTransaction,
        });
    } catch (error) {
        console.error('Transaction processing failed:', error);
        res.status(500).json({
            status: 'error',
            message: 'Transaction processing failed',
        });
    }
  };

  export default {
    send,
  };
  