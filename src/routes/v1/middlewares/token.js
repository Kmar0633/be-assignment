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
    // const validate = await service.validate(token);
    const validate = jwt.verify(token, config.jwtSecret);

    if (!validate) {
      return res.status(401).json({
        status: "error",
        message: "invalid token",
      });
    }
    let userRaw = {};
    let user = {};

    userRaw = await main.masterUser.findUnique({
      where: {
        username: validate.username,
      },
      include: {
        userLobMap: { include: { MasterLob: true } },
        userCountryMap: {
          select: {
            MasterCountry: {
              select: { id: true, codeCountry: true, nameCountry: true },
            },
          },
        },
        masterRole: {
          include: {
            rolePermissionMap: {
              include: {
                masterPermission: true,
              },
            },
          },
        },
      },
    });
    user = {
      id: userRaw.id,
      username: userRaw.username,
      email: userRaw.email,
      lobModel: userRaw.userLobMap.map((rp) => rp.MasterLob),
      lob: userRaw.userLobMap.map((rp) => rp.MasterLob.nameLob),
      role: userRaw.masterRole.name,
      countryModel: userRaw.userCountryMap.map((rp) => rp.MasterCountry),
      country: userRaw.userCountryMap.map((rp) => rp.MasterCountry.codeCountry),
      permission: userRaw.masterRole.rolePermissionMap.map(
        (rp) => rp.masterPermission.name
      ),
      ...validate,
    };

    req.user = user;

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
