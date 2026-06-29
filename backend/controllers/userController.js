const User = require('../models/User');

const syncUser = async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, provider } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: 'UID and email are required for sync' });
    }

    // Upsert user: If exists, update lastLogin and fields. If not, create.
    const user = await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          email,
          displayName: displayName || '',
          photoURL: photoURL || '',
          provider: provider || 'password',
          lastLogin: new Date()
        }
      },
      { 
        new: true, // Return the updated/created document
        upsert: true, // Create if it doesn't exist
        setDefaultsOnInsert: true // Ensure default values like xp, level are set
      }
    );

    res.status(200).json(user);
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ message: 'Server error during user sync', error: error.message });
  }
};

module.exports = {
  syncUser
};
