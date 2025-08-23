const jwt = require("jsonwebtoken");

const generateJWT = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

module.exports = generateJWT;
