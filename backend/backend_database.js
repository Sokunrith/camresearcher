/**
 * Database Configuration
 * PostgreSQL connection and Sequelize ORM setup
 */

const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'camresearcher',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

// Import models
const User = require('../models/User')(sequelize);
const ResearcherProfile = require('../models/ResearcherProfile')(sequelize);
const Publication = require('../models/Publication')(sequelize);
const Award = require('../models/Award')(sequelize);
const VerificationRequest = require('../models/VerificationRequest')(sequelize);
const TeachingExperience = require('../models/TeachingExperience')(sequelize);

// Define associations
Object.keys(require('../models')).forEach((modelName) => {
  const model = require('../models')[modelName];
  if (model.associate) {
    model.associate({ User, ResearcherProfile, Publication, Award, VerificationRequest, TeachingExperience });
  }
});

// Sync database
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true }).catch((err) => {
    console.error('Database sync error:', err);
  });
}

module.exports = {
  sequelize,
  Sequelize,
  User,
  ResearcherProfile,
  Publication,
  Award,
  VerificationRequest,
  TeachingExperience
};
