const bcrypt = require('bcrypt');
const User = require('../models/user');



exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.name = name;
    user.email = email;
    user.password = password;
    await user.save();
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    await user.deleteOne();
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
};
