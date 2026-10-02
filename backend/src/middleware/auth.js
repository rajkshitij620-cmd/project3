const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'snip_secret_key_2024');
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};
