import db from "../../../../../db/db.js";
import helper from "../../helpers/helper.js";
import config from "../../../../../config/config.js";

const { main } = db;
const get = async (req, res, next) => {
  const { username } = req.params;

  try {
    const findUser = await main.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!findUser) {
      return res.status(400).json({
        status: "error",
        message: "User does not exist",
      });
    }
    const user = await main.user.findUnique({
      where: {
        username: username,
      },
      include: {
        paymentAccounts: {
          include: {
            paymentHistory: true,
          },
        },
      },
    });

    return res.json({
      status: "success",
      message: "user fetched successfully",
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  get,
};
