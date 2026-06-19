/**
 * CAMResearcher ID Generator
 * Generates unique CAM-YYYY-XXXXX identifiers for researchers
 */

const crypto = require('crypto');
const { User } = require('../config/database');

/**
 * Generate unique CAMResearcher ID in format: CAM-YYYY-XXXXX
 * CAM = Cambodia
 * YYYY = Current year
 * XXXXX = 5-digit random sequence with validation
 */

const generateCAMResearcherId = async () => {
  let camId;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 100;
  const currentYear = new Date().getFullYear();

  while (!isUnique && attempts < maxAttempts) {
    // Generate 5 random digits
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    camId = `CAM-${currentYear}-${randomPart}`;

    // Check if ID already exists
    const existingUser = await User.findOne({
      where: { camResearcherId: camId }
    });

    if (!existingUser) {
      isUnique = true;
    }

    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique CAMResearcher ID after maximum attempts');
  }

  return camId;
};

/**
 * Validate CAMResearcher ID format
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid format
 */

const validateCAMResearcherId = (id) => {
  const pattern = /^CAM-\d{4}-\d{5}$/;
  return pattern.test(id);
};

/**
 * Extract year from CAMResearcher ID
 * @param {string} id - The CAMResearcher ID
 * @returns {number} - The year extracted from the ID
 */

const extractYearFromCAMId = (id) => {
  const match = id.match(/^CAM-(\d{4})-/);
  return match ? parseInt(match[1]) : null;
};

/**
 * Generate batch CAMResearcher IDs for bulk operations
 * @param {number} count - Number of IDs to generate
 * @returns {Promise<Array>} - Array of unique CAMResearcher IDs
 */

const generateBatchCAMResearcherIds = async (count) => {
  const ids = [];
  const currentYear = new Date().getFullYear();
  const existingIds = new Set();

  // Get all existing CAMResearcher IDs
  const existingUsers = await User.findAll({
    attributes: ['camResearcherId']
  });

  existingUsers.forEach(user => {
    existingIds.add(user.camResearcherId);
  });

  let generated = 0;
  let attempts = 0;
  const maxTotalAttempts = count * 100;

  while (generated < count && attempts < maxTotalAttempts) {
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    const id = `CAM-${currentYear}-${randomPart}`;

    if (!existingIds.has(id)) {
      ids.push(id);
      existingIds.add(id);
      generated++;
    }

    attempts++;
  }

  if (generated < count) {
    throw new Error(`Could not generate ${count} unique IDs. Generated ${generated} instead.`);
  }

  return ids;
};

/**
 * Get CAMResearcher ID statistics
 * @returns {Promise<Object>} - Statistics about generated IDs
 */

const getCAMIdStatistics = async () => {
  const users = await User.findAll({
    attributes: ['camResearcherId', 'createdAt'],
    raw: true
  });

  const stats = {
    totalResearchers: users.length,
    idsByYear: {},
    createdThisYear: 0,
    createdThisMonth: 0
  };

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  users.forEach(user => {
    const year = parseInt(user.camResearcherId.split('-')[1]);
    const createdDate = new Date(user.createdAt);

    if (!stats.idsByYear[year]) {
      stats.idsByYear[year] = 0;
    }
    stats.idsByYear[year]++;

    if (year === currentYear) {
      stats.createdThisYear++;

      if (createdDate.getFullYear() === currentYear && 
          createdDate.getMonth() === currentMonth) {
        stats.createdThisMonth++;
      }
    }
  });

  return stats;
};

/**
 * Verify CAMResearcher ID ownership
 * @param {string} camResearcherId - The CAM ID to verify
 * @param {string} userId - The user ID to match against
 * @returns {Promise<boolean>} - True if the ID belongs to the user
 */

const verifyCAMIdOwnership = async (camResearcherId, userId) => {
  const user = await User.findOne({
    where: {
      id: userId,
      camResearcherId: camResearcherId
    }
  });

  return !!user;
};

module.exports = {
  generateCAMResearcherId,
  validateCAMResearcherId,
  extractYearFromCAMId,
  generateBatchCAMResearcherIds,
  getCAMIdStatistics,
  verifyCAMIdOwnership
};
