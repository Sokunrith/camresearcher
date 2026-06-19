/**
 * CAMResearcher Database Schema
 * PostgreSQL 13+
 */

-- Create UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===== Users Table =====
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cam_researcher_id VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  first_name_khmer VARCHAR(255),
  last_name_khmer VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_token_expires TIMESTAMP,
  password_reset_token VARCHAR(255),
  password_reset_token_expires TIMESTAMP,
  role ENUM ('researcher', 'admin', 'government') DEFAULT 'researcher',
  account_status ENUM ('active', 'inactive', 'suspended', 'deleted') DEFAULT 'inactive',
  profile_completion INTEGER DEFAULT 0,
  last_login_at TIMESTAMP,
  login_attempts INTEGER DEFAULT 0,
  lock_until TIMESTAMP,
  preferences JSONB DEFAULT '{"language":"en","emailNotifications":true,"publicProfile":false}',
  last_activity_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT cam_id_format CHECK (cam_researcher_id ~* '^CAM-[0-9]{4}-[0-9]{5}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cam_researcher_id ON users(cam_researcher_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_account_status ON users(account_status);

-- ===== Researcher Profiles Table =====
CREATE TABLE IF NOT EXISTS researcher_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  institution VARCHAR(255),
  institution_khmer VARCHAR(255),
  position VARCHAR(100),
  position_khmer VARCHAR(100),
  department VARCHAR(100),
  faculty VARCHAR(100),
  education_level ENUM ('bachelor', 'master', 'phd', 'postdoc'),
  field_of_study VARCHAR(100),
  university_name VARCHAR(255),
  graduation_year INTEGER,
  biography TEXT,
  biography_khmer TEXT,
  phone VARCHAR(20),
  phone_country_code VARCHAR(5) DEFAULT '+855',
  office_address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Cambodia',
  postal_code VARCHAR(20),
  website VARCHAR(255),
  orcid_id VARCHAR(50) UNIQUE,
  researcher_id VARCHAR(100),
  scopus_id VARCHAR(100),
  specializations TEXT[],
  keyword_en TEXT[],
  keyword_km TEXT[],
  research_interests TEXT[],
  languages VARCHAR(100)[] DEFAULT ARRAY['Khmer', 'English'],
  profile_photo VARCHAR(255),
  cv VARCHAR(255),
  collaborators JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',
  profile_visibility ENUM ('public', 'private', 'restricted') DEFAULT 'public',
  verification_status ENUM ('unverified', 'pending', 'verified', 'rejected') DEFAULT 'unverified',
  verification_date TIMESTAMP,
  verification_notes TEXT,
  profile_completion_percentage INTEGER DEFAULT 0,
  last_updated TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_researcher_profiles_user_id ON researcher_profiles(user_id);
CREATE INDEX idx_researcher_profiles_verification_status ON researcher_profiles(verification_status);
CREATE INDEX idx_researcher_profiles_institution ON researcher_profiles(institution);

-- ===== Publications Table =====
CREATE TABLE IF NOT EXISTS publications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_km TEXT,
  authors VARCHAR(255)[] NOT NULL,
  journal VARCHAR(255),
  conference_title VARCHAR(255),
  publisher_en VARCHAR(255),
  publisher_km VARCHAR(255),
  year INTEGER NOT NULL,
  month INTEGER,
  volume VARCHAR(50),
  issue VARCHAR(50),
  pages VARCHAR(50),
  doi VARCHAR(100) UNIQUE,
  url VARCHAR(500),
  abstract_en TEXT,
  abstract_km TEXT,
  keywords TEXT[],
  publication_type ENUM ('journal', 'conference', 'book', 'book_chapter', 'preprint', 'other') DEFAULT 'journal',
  peer_reviewed BOOLEAN DEFAULT TRUE,
  citation_count INTEGER DEFAULT 0,
  impact_factor DECIMAL(5,3),
  quartile ENUM ('Q1', 'Q2', 'Q3', 'Q4', 'Not ranked'),
  scopus_indexed BOOLEAN DEFAULT FALSE,
  web_of_science_indexed BOOLEAN DEFAULT FALSE,
  file_attachment VARCHAR(255),
  collaborators JSONB DEFAULT '[]',
  funding_info TEXT,
  language_of_publication VARCHAR(50) DEFAULT 'English',
  verification_status ENUM ('unverified', 'verified', 'rejected') DEFAULT 'unverified',
  order_in_list INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_publications_user_id ON publications(user_id);
CREATE INDEX idx_publications_year ON publications(year);
CREATE INDEX idx_publications_doi ON publications(doi);

-- ===== Awards Table =====
CREATE TABLE IF NOT EXISTS awards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  award_name_en VARCHAR(255) NOT NULL,
  award_name_km VARCHAR(255),
  issuer VARCHAR(255) NOT NULL,
  issuer_khmer VARCHAR(255),
  category ENUM ('research_award', 'teaching_award', 'scholarship', 'fellowship', 'grant', 'recognition', 'other') DEFAULT 'recognition',
  date_awarded DATE NOT NULL,
  amount DECIMAL(15,2),
  currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  description_khmer TEXT,
  certificate_file VARCHAR(255),
  evidence_attachment VARCHAR(255),
  significance ENUM ('international', 'national', 'regional', 'institutional') DEFAULT 'national',
  verification_status ENUM ('unverified', 'verified', 'rejected') DEFAULT 'unverified',
  verification_date TIMESTAMP,
  order_in_list INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_awards_user_id ON awards(user_id);
CREATE INDEX idx_awards_date_awarded ON awards(date_awarded);
CREATE INDEX idx_awards_category ON awards(category);

-- ===== Teaching Experience Table =====
CREATE TABLE IF NOT EXISTS teaching_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_name_en VARCHAR(255) NOT NULL,
  course_name_km VARCHAR(255),
  institution VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  level ENUM ('undergraduate', 'graduate', 'professional') DEFAULT 'undergraduate',
  role ENUM ('instructor', 'co_instructor', 'assistant', 'lecturer') DEFAULT 'instructor',
  start_date DATE NOT NULL,
  end_date DATE,
  number_of_students INTEGER,
  syllabus_file VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_teaching_experiences_user_id ON teaching_experiences(user_id);
CREATE INDEX idx_teaching_experiences_start_date ON teaching_experiences(start_date);

-- ===== Verification Requests Table =====
CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_type ENUM ('profile', 'publication', 'award', 'teaching') DEFAULT 'profile',
  record_id UUID,
  status ENUM ('pending', 'approved', 'rejected') DEFAULT 'pending',
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  review_date TIMESTAMP,
  reviewed_by UUID,
  comments TEXT,
  supporting_documents VARCHAR(255)[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_verification_requests_user_id ON verification_requests(user_id);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);
CREATE INDEX idx_verification_requests_submission_date ON verification_requests(submission_date);

-- ===== Grant Opportunities Table =====
CREATE TABLE IF NOT EXISTS grant_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grant_name_en VARCHAR(255) NOT NULL,
  grant_name_km VARCHAR(255),
  issuer VARCHAR(255) NOT NULL,
  issuer_khmer VARCHAR(255),
  description_en TEXT,
  description_km TEXT,
  funding_amount DECIMAL(15,2),
  currency VARCHAR(3) DEFAULT 'USD',
  deadline DATE NOT NULL,
  eligibility_criteria TEXT,
  required_documents TEXT[],
  contact_email VARCHAR(255),
  website VARCHAR(500),
  status ENUM ('open', 'closed', 'paused') DEFAULT 'open',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_grant_opportunities_status ON grant_opportunities(status);
CREATE INDEX idx_grant_opportunities_deadline ON grant_opportunities(deadline);

-- ===== Grant Applications Table =====
CREATE TABLE IF NOT EXISTS grant_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grant_id UUID NOT NULL REFERENCES grant_opportunities(id) ON DELETE CASCADE,
  application_status ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'withdrawn') DEFAULT 'draft',
  submission_date TIMESTAMP,
  review_date TIMESTAMP,
  reviewer_id UUID REFERENCES users(id),
  reviewer_comments TEXT,
  supporting_documents VARCHAR(255)[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_application UNIQUE (user_id, grant_id)
);

CREATE INDEX idx_grant_applications_user_id ON grant_applications(user_id);
CREATE INDEX idx_grant_applications_grant_id ON grant_applications(grant_id);
CREATE INDEX idx_grant_applications_status ON grant_applications(application_status);

-- ===== Audit Log Table =====
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ===== System Settings Table =====
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== Notifications Table =====
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ===== Create Function for Updated Timestamp =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ===== Create Triggers for Updated Timestamp =====
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_researcher_profiles_updated_at BEFORE UPDATE ON researcher_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publications_updated_at BEFORE UPDATE ON publications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_awards_updated_at BEFORE UPDATE ON awards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teaching_experiences_updated_at BEFORE UPDATE ON teaching_experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== Sample Inserts (Remove for production) =====
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('app_name', 'CAMResearcher', 'Application name'),
('app_version', '1.0.0', 'Current application version'),
('max_file_upload_size', '5242880', 'Maximum file upload size in bytes'),
('require_email_verification', 'true', 'Require email verification for signup');

COMMIT;
