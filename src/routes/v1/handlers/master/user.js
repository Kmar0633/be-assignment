import jwt from "jsonwebtoken";
import db from "../../../../../db/db.js";
import helper from "../../helpers/helper.js";
import config from "../../../../../config/config.js";

const { main } = db;
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (username === "" || password === "") {
      return res.status(400).json({
        status: "error",
        message: "No username/ No Password provided",
      });
    }
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
    const passwordMatch =
      password == helper.decodeText(findUser.password).replace(/\0/g, "");
    if (!passwordMatch) {
      return res.status(400).json({
        status: "fail",
        message: "Login Failed: Wrong Password",
      });
    }

    let token = "";

    const data = {username: username}
    
    token = jwt.sign(data, config.jwtSecret);

    return res.json({
      status: "success",
      message: "login successfull",
      data: {
        token,
        ...data,
      },
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (username === "" || password === "") {
      return res.status(400).json({
        status: "error",
        message: "No username/ No Password provided",
      });
    }

    const findUser = await main.user.findFirst({
      where: {
        username: username,
      },
    });

    if (findUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }
    console.log(password);
    console.log(username);
    const user = await main.user.create({
      data: {
        username: username,
        password: helper.encryptText(password),
        paymentAccounts: {
          create: [{ type: "credit" }, { type: "debit" }, { type: "loan" }],
        },
      },
      include: {
        paymentAccounts: true, // Include paymentAccounts in the response
      },
    });

    return res.json({
      status: 200,
      message: "user created",
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  login,
  createUser,
};
