const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};


const comparePasswords = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const checkUserExists = async (email, username) => {
  const userByEmail = await User.findOne({ email });
  const userByUsername = await User.findOne({ username });
  
  return {
    emailExists: !!userByEmail,
    usernameExists: !!userByUsername
  };
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePasswords,
  checkUserExists
};