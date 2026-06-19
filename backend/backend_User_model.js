/**
 * User Model
 * Handles user account management and authentication
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    camResearcherId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      comment: 'Format: CAM-YYYY-XXXXX'
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      },
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstNameKhmer: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Name in Khmer script'
    },
    lastNameKhmer: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Surname in Khmer script'
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emailVerificationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('researcher', 'admin', 'government'),
      defaultValue: 'researcher'
    },
    accountStatus: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended', 'deleted'),
      defaultValue: 'inactive'
    },
    profileCompletion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Profile completion percentage (0-100)'
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lockUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Account locked until this time after failed login attempts'
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {
        language: 'en',
        emailNotifications: true,
        publicProfile: false
      }
    },
    lastActivityAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['camResearcherId']
      },
      {
        fields: ['role']
      },
      {
        fields: ['accountStatus']
      }
    ]
  });

  // Hash password before saving
  User.beforeCreate(async (user) => {
    if (user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    }
  });

  // Hash password if modified
  User.beforeUpdate(async (user) => {
    if (user.changed('passwordHash')) {
      user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    }
  });

  // Instance methods
  User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  User.prototype.getFullName = function () {
    return `${this.firstName} ${this.lastName}`;
  };

  User.prototype.getFullNameKhmer = function () {
    if (this.firstNameKhmer && this.lastNameKhmer) {
      return `${this.firstNameKhmer} ${this.lastNameKhmer}`;
    }
    return null;
  };

  User.prototype.isAccountLocked = function () {
    return this.lockUntil && this.lockUntil > Date.now();
  };

  // Static methods
  User.findByEmail = function (email) {
    return this.findOne({ where: { email: email.toLowerCase() } });
  };

  User.findByCAMId = function (camResearcherId) {
    return this.findOne({ where: { camResearcherId } });
  };

  // Associations
  User.associate = (models) => {
    User.hasOne(models.ResearcherProfile, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Publication, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Award, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.TeachingExperience, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return User;
};
