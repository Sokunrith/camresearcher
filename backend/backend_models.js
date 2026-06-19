/**
 * Publication Model
 * Tracks research publications and scholarly works
 */

const { DataTypes } = require('sequelize');

const PublicationModel = (sequelize) => {
  const Publication = sequelize.define('Publication', {
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
    titleEn: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    titleKm: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    authors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    },
    journal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    conferenceTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    publisherEn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    publisherKm: {
      type: DataTypes.STRING,
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    volume: {
      type: DataTypes.STRING,
      allowNull: true
    },
    issue: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pages: {
      type: DataTypes.STRING,
      allowNull: true
    },
    doi: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    abstractEn: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    abstractKm: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    keywords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    publicationType: {
      type: DataTypes.ENUM('journal', 'conference', 'book', 'book_chapter', 'preprint', 'other'),
      defaultValue: 'journal'
    },
    peerReviewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    citationCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    impactFactor: {
      type: DataTypes.DECIMAL(5, 3),
      allowNull: true
    },
    quartile: {
      type: DataTypes.ENUM('Q1', 'Q2', 'Q3', 'Q4', 'Not ranked'),
      allowNull: true
    },
    scopusIndexed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    webOfScienceIndexed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    fileAttachment: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'File path to PDF or document'
    },
    collaborators: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: [],
      comment: 'JSON array with collaborator info'
    },
    fundingInfo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    languageOfPublication: {
      type: DataTypes.STRING,
      defaultValue: 'English'
    },
    verificationStatus: {
      type: DataTypes.ENUM('unverified', 'verified', 'rejected'),
      defaultValue: 'unverified'
    },
    orderInList: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['year'] },
      { fields: ['doi'] }
    ]
  });

  Publication.associate = (models) => {
    Publication.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return Publication;
};

/**
 * Award Model
 * Tracks awards, honors, and recognition
 */

const AwardModel = (sequelize) => {
  const Award = sequelize.define('Award', {
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
    awardNameEn: {
      type: DataTypes.STRING,
      allowNull: false
    },
    awardNameKm: {
      type: DataTypes.STRING,
      allowNull: true
    },
    issuer: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Organization or institution giving the award'
    },
    issuerKhmer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.ENUM(
        'research_award',
        'teaching_award',
        'scholarship',
        'fellowship',
        'grant',
        'recognition',
        'other'
      ),
      defaultValue: 'recognition'
    },
    dateAwarded: {
      type: DataTypes.DATE,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Monetary amount of award if applicable'
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    descriptionKhmer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    certificateFile: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'File path to award certificate'
    },
    evidenceAttachment: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Supporting documentation'
    },
    significance: {
      type: DataTypes.ENUM('international', 'national', 'regional', 'institutional'),
      defaultValue: 'national'
    },
    verificationStatus: {
      type: DataTypes.ENUM('unverified', 'verified', 'rejected'),
      defaultValue: 'unverified'
    },
    verificationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    orderInList: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['dateAwarded'] },
      { fields: ['category'] }
    ]
  });

  Award.associate = (models) => {
    Award.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return Award;
};

/**
 * TeachingExperience Model
 * Tracks teaching and mentoring activities
 */

const TeachingExperienceModel = (sequelize) => {
  const TeachingExperience = sequelize.define('TeachingExperience', {
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
    courseNameEn: {
      type: DataTypes.STRING,
      allowNull: false
    },
    courseNameKm: {
      type: DataTypes.STRING,
      allowNull: true
    },
    institution: {
      type: DataTypes.STRING,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    level: {
      type: DataTypes.ENUM('undergraduate', 'graduate', 'professional'),
      defaultValue: 'undergraduate'
    },
    role: {
      type: DataTypes.ENUM('instructor', 'co_instructor', 'assistant', 'lecturer'),
      defaultValue: 'instructor'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    numberOfStudents: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    syllabusFile: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['startDate'] }
    ]
  });

  TeachingExperience.associate = (models) => {
    TeachingExperience.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return TeachingExperience;
};

/**
 * VerificationRequest Model
 * Tracks profile and record verification requests
 */

const VerificationRequestModel = (sequelize) => {
  const VerificationRequest = sequelize.define('VerificationRequest', {
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
    requestType: {
      type: DataTypes.ENUM('profile', 'publication', 'award', 'teaching'),
      defaultValue: 'profile'
    },
    recordId: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID of the record being verified'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    submissionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    reviewDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Admin ID who reviewed'
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    supportingDocuments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    }
  }, {
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['status'] },
      { fields: ['submissionDate'] }
    ]
  });

  VerificationRequest.associate = (models) => {
    VerificationRequest.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return VerificationRequest;
};

module.exports = {
  PublicationModel,
  AwardModel,
  TeachingExperienceModel,
  VerificationRequestModel
};
