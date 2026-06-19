/**
 * ResearcherProfile Model
 * Comprehensive researcher information and credentials
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ResearcherProfile = sequelize.define('ResearcherProfile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    institution: {
      type: DataTypes.STRING,
      allowNull: true
    },
    institutionKhmer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Job title: Professor, Associate Professor, Lecturer, etc.'
    },
    positionKhmer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    faculty: {
      type: DataTypes.STRING,
      allowNull: true
    },
    educationLevel: {
      type: DataTypes.ENUM('bachelor', 'master', 'phd', 'postdoc'),
      allowNull: true
    },
    fieldOfStudy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    universityName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    graduationYear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    biography: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    biographyKhmer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneCountryCode: {
      type: DataTypes.STRING,
      defaultValue: '+855',
      comment: 'Country code for Cambodia'
    },
    officeAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: 'Cambodia'
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    orcidId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        is: /^0000-000[1-3]-[0-9]{3}[0-9X]$/
      }
    },
    researcherId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Google Scholar ID'
    },
    scopusId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Scopus Author ID'
    },
    specializations: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: []
    },
    keywordEn: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
      comment: 'Research keywords in English'
    },
    keywordKm: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
      comment: 'Research keywords in Khmer'
    },
    researchInterests: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
      comment: 'JSON array of research interest areas'
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['Khmer', 'English'],
      comment: 'Languages spoken/written'
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'File path to profile picture'
    },
    cv: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'File path to CV/Resume'
    },
    collaborators: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: [],
      comment: 'List of collaborators with their institutions'
    },
    achievements: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: []
    },
    profileVisibility: {
      type: DataTypes.ENUM('public', 'private', 'restricted'),
      defaultValue: 'public'
    },
    verificationStatus: {
      type: DataTypes.ENUM('unverified', 'pending', 'verified', 'rejected'),
      defaultValue: 'unverified'
    },
    verificationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verificationNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profileCompletionPercentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '0-100 percentage of profile completion'
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['verificationStatus'] },
      { fields: ['institution'] }
    ]
  });

  ResearcherProfile.associate = (models) => {
    ResearcherProfile.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return ResearcherProfile;
};
