import { verify } from "jsonwebtoken";

export const userMiddleware = async (req, res, next) => {
  const header = req.header("Authorization");
  const token = header.split(" ")[1];

  try {
    const verifiedToken = await verify(token, process.env.JWT_SECRET);
    if (verifiedToken) {
      res.status(200);
      await next();
    }
  } catch (e) {
    return res.status(403).json({
      message: "Not authorized.",
    });
  }
};
