// modules/profile/profile.business.js
const { getProfileById } = require('./profile.model.js');

/**
 * Returnează profilul user-ului logat (după ID din token)
 * @param {number} userId
 */
async function getMyProfile(userId) {
  if (!userId) {
    throw new Error('Missing user id');
  }

  const profile = await getProfileById(userId);

  if (!profile) {
    throw new Error('User not found');
  }

  return profile;
}

module.exports = {
  getMyProfile,
};
