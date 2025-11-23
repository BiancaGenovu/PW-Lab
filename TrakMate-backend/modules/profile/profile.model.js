// modules/profile/profile.model.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Ia profilul unui user + numărul de tururi logate (timeRecord)
 * @param {number} userId
 */
async function getProfileById(userId) {
  const id = Number(userId);
  if (!id) {
    throw new Error('Invalid user id');
  }

  // 1) luăm user-ul
  const user = await prisma.appUser.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      profileImage: true,
      createdAt: true,
      isActive: true,
    },
  });

  if (!user) {
    return null;
  }

  // 2) numărăm timpii din timeRecord pentru pilotul ăsta
  const lapCount = await prisma.timeRecord.count({
    where: { pilotId: id },
  });

  // 3) întoarcem tot ce trebuie către frontend
  return {
    ...user,
    lapCount,
  };
}

module.exports = {
  getProfileById,
};