const express = require('express');
const Router = express.Router();

const bcrypt = require('bcryptjs');
//const config = require('../../config');
const jwt = require('jsonwebtoken');
//const auth = require('../../middleware/auth');
const User = require('../models/User');
//import { Router } from 'express';
//import bcrypt from 'bcryptjs';
//import config from '../../config';
//import jwt from 'jsonwebtoken';
//import auth from '../../middleware/auth';
// User Model
//import User from '../../models/User';

const  JWT_SECRET = "tl_myjwt";
//const router = Router();
const router = Router;

/**
 * @route   POST api/auth/login
 * @desc    Login user
 * @access  Public
 */

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ username });
    if (!user) throw Error('User Does not exist');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error('Invalid credentials');

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
    if (!token) throw Error('Couldnt sign the token');

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        country: user.country
      }
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
 * @route   POST api/users
 * @desc    Register new user
 * @access  Public
 */

router.post('/register', async (req, res) => {
  const { username, password, role, country } = req.body;

  // Simple validation
  if (!username || !password || !role || !country) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ username });   
   // if (user) throw Error('User already exists');
   if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error('Something went wrong with bcrypt');

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error('Something went wrong hashing the password');

    const newUser = new User({      
      username, 
      password: hash,
      role,
      country
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error('Something went wrong saving the user');

    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: 3600
    });

    res.status(200).json({
      token,
      user: {
        id: savedUser.id,
        username: savedUser.username, 
        role: savedUser.role,
        country: savedUser.country
      }
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 * @access  Private
 */

router.get('/users', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw Error('User Does not exist');
    res.json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;

