// modules/auth/auth.model.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Creează un user nou (Pilot sau Admin).
 * Aici primim DEJA parola hash-uită.
 */
async function createUser({ email, passwordHash, firstName, lastName, role = 'Pilot' }) {
  return prisma.appUser.create({
    data: {
      email,
      password: passwordHash,
      firstName,
      lastName,
      role,
      isActive: true
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true
    }
  });
}

/**
 * Găsește user după email (pentru login).
 * Aici avem nevoie și de parolă, deci o selectăm.
 */
async function findUserByEmail(email) {
  return prisma.appUser.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true
    }
  });
}

module.exports = {
  createUser,
  findUserByEmail
};