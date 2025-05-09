const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production'
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User with that email or username already exists'
      });
    }

    const newUser = await User.create({
      username,
      email,
      password
    });

    const token = signToken(newUser._id);

    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    const token = signToken(user._id);

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.'
    });
  }
};

exports.readUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateUsername = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username required' });

    await User.findByIdAndUpdate(userId, { username });
    res.json({ message: 'Username updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    await User.findByIdAndUpdate(userId, { email });
    res.json({ message: 'Email updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });

    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hashed });
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndDelete(userId);
    req.session?.destroy(() => {});
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.verifyUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(400).json({ error: 'Username not found.' });
    }
    res.status(200).json({ message: 'Username verified.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user  = req.user;

    if (!user) {
      return res.status(400).json({ error: 'Email not found.' });
    }
    res.status(200).json({ message: 'Email verified.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

exports.verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user =  req.user;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Password is incorrect.' });
    }
    res.status(200).json({ message: 'Password verified.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}