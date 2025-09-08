const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const hashPassword = (password) => {
  const salt = uid2(16);
  const hash = SHA256(password + salt).toString(encBase64);
  return { hash, salt };
};

const verifyPassword = (password, hash, salt) => {
  const testHash = SHA256(password + salt).toString(encBase64);
  return testHash === hash;
};

const generateToken = () => uid2(16);

module.exports = { hashPassword, verifyPassword, generateToken };