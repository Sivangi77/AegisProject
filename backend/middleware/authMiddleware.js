const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const uid = authHeader.split(' ')[1];
    
    // Find user by Firebase UID
    const user = await User.findOne({ uid });
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found in database' });
    }

    // Attach MongoDB user document to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

module.exports = { requireAuth };
