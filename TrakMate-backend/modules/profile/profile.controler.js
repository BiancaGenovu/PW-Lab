// modules/profile/profile.controler.js
const { getMyProfile } = require('./profile.business.js');

async function getMyProfileController(req, res) {
  try {
    const userId = req.user?.id; // ← schimbă din req.userId în req.user.id
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = await getMyProfile(userId);
    res.json(data);
  } catch (e) {
    console.error('Profile error', e);
    res.status(500).json({ message: 'DB error', detail: String(e.message || e) });
  }
}

module.exports = {
  getMyProfileController,
};