import jwt from "jsonwebtoken";

export const generateJWT = (payload: jwt.JwtPayload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};
