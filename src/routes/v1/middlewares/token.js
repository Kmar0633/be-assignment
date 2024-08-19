import jwt from "jsonwebtoken";
import config from "../../../../config/config.js";
import db from "../../../../db/db.js";

const { main } = db;
export default async (req, res, next) => {
  try {
    const token = req.headers["x-auth-token"];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized, No token provided",
      });
    }

    const validate = jwt.verify(token, config.jwtSecret);

    if (!validate) {
      return res.status(401).json({
        status: "error",
        message: "invalid token",
      });
    }

    const rawUser = await main.user.findUnique({
      where: {
        username:validate.username,
      },
      include: {
        paymentAccounts: {
          include: {
            paymentHistory: true,
          },
        },
      },
    });
    
    req.user = rawUser;

    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({
      status: "error",
      message: "invalid token",
    });
    next();
  }
};
