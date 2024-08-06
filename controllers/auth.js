const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

dotenv.config(); 

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    user = new User({
      name,
      email,
      password : hashedPassword,
    });
    await user.save();
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
};


exports.signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return res.status(400).json({ msg: "All Field is required" });
  }

  try {
    const validuser = await User.findOne({ email });
    if (!validuser) {
      return res.status(404).json({ msg: "User not found" });
    }
    const validpassword = await bcrypt.compare(password, validuser.password);
    if (!validpassword) {
      return res.status(400).json({ msg: "Invalid password" });
    }
    const token = jwt.sign(
      { id: validuser._id, name: validuser.name,email: validuser.email,isAdmin: validuser.isAdmin },
      JWT_SECRET
    );
    const { password: userPassword, ...rest } = validuser._doc;

    res.cookie("access-token", token, { httpOnly: true, sameSite: 'Strict', })
    .json({ access_token:token}) // send the user details excluding the password
    .status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL,
    subject: 'Password Reset',
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
      http://localhost:5173/reset-password/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.error('There was an error:', err);
      res.status(500).json({ success: false, message: 'Error sending email' });
    } else {
      res.status(200).json({ success: true, message: 'Recovery email sent' });
    }
  });
};


exports.resetpassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Password has been reset' });
};