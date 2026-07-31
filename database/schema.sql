-- IntelliSphere Enterprise PostgreSQL Schema
-- Target Database Version: PostgreSQL 15+

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'ADMIN', 'OPERATOR', 'USER'
    permissions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Organizations Table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Industry Modules Table
CREATE TABLE industry_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL, -- 'Agriculture', 'Healthcare', etc.
    key VARCHAR(50) UNIQUE NOT NULL, -- 'agriculture', 'healthcare', etc.
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Assets Table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- e.g., 'Tractor', 'CT Scanner', 'Turbine'
    status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'MAINTENANCE', 'DECOMMISSIONED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Sensors Table
CREATE TABLE sensors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL, -- e.g., 'Temperature', 'Hydration', 'Vibration'
    unit VARCHAR(20),
    last_reading DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'ONLINE', -- 'ONLINE', 'OFFLINE', 'ALERT'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Reports Table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_size VARCHAR(50),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Alerts Table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    severity VARCHAR(50) NOT NULL, -- 'INFO', 'WARNING', 'CRITICAL'
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Predictions Table
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES industry_modules(id) ON DELETE CASCADE,
    input_data JSONB NOT NULL,
    prediction_output JSONB NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Recommendations Table
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id UUID REFERENCES predictions(id) ON DELETE CASCADE,
    suggestion TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'SYSTEM', -- 'SYSTEM', 'ALARM', 'REMINDER'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_assets_org ON assets(organization_id);
CREATE INDEX idx_sensors_asset ON sensors(asset_id);
CREATE INDEX idx_alerts_org ON alerts(organization_id);
CREATE INDEX idx_predictions_module ON predictions(module_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- 13. User Sessions Table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token);

-- 14. Farms Table
CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    acreage DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Crops Table
CREATE TABLE crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    acreage DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'HEALTHY', -- 'HEALTHY', 'STRESSED', 'INFESTED'
    health_index DOUBLE PRECISION DEFAULT 100.0,
    growth_stage VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Diseases Table
CREATE TABLE diseases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_id UUID REFERENCES crops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    risk_probability DOUBLE PRECISION DEFAULT 0.0,
    status VARCHAR(50) DEFAULT 'NONE', -- 'NONE', 'SUSPECTED', 'CONFIRMED'
    recommended_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Agriculture optimization
CREATE INDEX idx_farms_org ON farms(organization_id);
CREATE INDEX idx_crops_farm ON crops(farm_id);
CREATE INDEX idx_diseases_crop ON diseases(crop_id);

-- 17. Hospitals Table
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    beds_total INT DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. Patients Table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    admission_status VARCHAR(50) DEFAULT 'ADMITTED', -- 'ADMITTED', 'DISCHARGED', 'CRITICAL'
    room_number VARCHAR(20),
    stability_index DOUBLE PRECISION DEFAULT 100.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. Emergency Cases Table
CREATE TABLE emergency_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'Trauma', 'Stroke', 'Cardiac'
    severity VARCHAR(50) NOT NULL, -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    triage_level INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Healthcare optimization
CREATE INDEX idx_hospitals_org ON hospitals(organization_id);
CREATE INDEX idx_patients_hospital ON patients(hospital_id);
CREATE INDEX idx_emergencies_hospital ON emergency_cases(hospital_id);

-- 20. Departments Table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. Beds Table
CREATE TABLE beds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    bed_number VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'UNOCCUPIED', -- 'UNOCCUPIED', 'OCCUPIED', 'OCCUPIED_CRITICAL'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 22. Medical Reports Table
CREATE TABLE medical_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    file_path VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 23. Healthcare Alerts Table
CREATE TABLE healthcare_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
    severity VARCHAR(50) NOT NULL, -- 'CRITICAL', 'MEDIUM', 'LOW'
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 24. Healthcare Recommendations Table
CREATE TABLE healthcare_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    suggestion TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Additional Indexes for Healthcare Module
CREATE INDEX idx_departments_hospital ON departments(hospital_id);
CREATE INDEX idx_beds_department ON beds(department_id);
CREATE INDEX idx_medreports_patient ON medical_reports(patient_id);
CREATE INDEX idx_hcalerts_hospital ON healthcare_alerts(hospital_id);
CREATE INDEX idx_hcrecs_patient ON healthcare_recommendations(patient_id);

-- 25. Manufacturing Factories Table
CREATE TABLE mfg_factories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'OPERATIONAL',
    oee_percentage DOUBLE PRECISION DEFAULT 87.5,
    active_lines INT DEFAULT 4,
    total_machines INT DEFAULT 24,
    active_workers INT DEFAULT 142,
    daily_output_target DOUBLE PRECISION DEFAULT 12000.0,
    current_daily_output DOUBLE PRECISION DEFAULT 10850.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 26. Manufacturing Production Lines Table
CREATE TABLE mfg_production_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factory_id UUID REFERENCES mfg_factories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'OPERATIONAL',
    target_output DOUBLE PRECISION DEFAULT 3000.0,
    actual_output DOUBLE PRECISION DEFAULT 2890.0,
    oee_percentage DOUBLE PRECISION DEFAULT 91.2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 27. Manufacturing Machines Table
CREATE TABLE mfg_machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    production_line_id UUID REFERENCES mfg_production_lines(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    machine_code VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'OPERATIONAL',
    health_score INT DEFAULT 100,
    temperature DOUBLE PRECISION DEFAULT 65.0,
    vibration DOUBLE PRECISION DEFAULT 1.0,
    spindle_speed INT DEFAULT 3000,
    hydraulic_pressure INT DEFAULT 1400,
    age_months INT DEFAULT 12,
    last_maintenance VARCHAR(50),
    next_maintenance VARCHAR(50),
    failure_risk VARCHAR(100) DEFAULT 'Low',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 28. Manufacturing Production Metrics Table
CREATE TABLE mfg_production_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factory_id UUID REFERENCES mfg_factories(id) ON DELETE CASCADE,
    target_units INT DEFAULT 12000,
    actual_units INT DEFAULT 10850,
    scrap_units INT DEFAULT 195,
    yield_rate DOUBLE PRECISION DEFAULT 98.2,
    defect_rate DOUBLE PRECISION DEFAULT 1.8,
    throughput_per_hour DOUBLE PRECISION DEFAULT 1350.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 29. Manufacturing Maintenance Logs Table
CREATE TABLE mfg_maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID REFERENCES mfg_machines(id) ON DELETE CASCADE,
    work_order_number VARCHAR(100) NOT NULL UNIQUE,
    issue_description TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'MEDIUM',
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    failure_probability DOUBLE PRECISION DEFAULT 0.0,
    assigned_technician VARCHAR(255),
    scheduled_date VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 30. Manufacturing Energy Usage Table
CREATE TABLE mfg_energy_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factory_id UUID REFERENCES mfg_factories(id) ON DELETE CASCADE,
    current_kwh DOUBLE PRECISION DEFAULT 0.0,
    daily_kwh_total DOUBLE PRECISION DEFAULT 0.0,
    cost_today_usd DOUBLE PRECISION DEFAULT 0.0,
    efficiency_kwh_per_unit DOUBLE PRECISION DEFAULT 0.0,
    peak_demand_mw DOUBLE PRECISION DEFAULT 0.0,
    carbon_footprint_kg DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 31. Manufacturing Alerts Table
CREATE TABLE mfg_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factory_id UUID REFERENCES mfg_factories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    machine_code VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 32. Manufacturing Predictions Table
CREATE TABLE mfg_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID REFERENCES mfg_machines(id) ON DELETE CASCADE,
    predicted_failure_time TIMESTAMP WITH TIME ZONE,
    probability DOUBLE PRECISION NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 33. Manufacturing Recommendations Table
CREATE TABLE mfg_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID REFERENCES mfg_machines(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    suggestion TEXT NOT NULL,
    impact VARCHAR(50) DEFAULT 'MEDIUM',
    estimated_savings VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Manufacturing optimization
CREATE INDEX idx_mfg_prodlines_factory ON mfg_production_lines(factory_id);
CREATE INDEX idx_mfg_machines_line ON mfg_machines(production_line_id);
CREATE INDEX idx_mfg_metrics_factory ON mfg_production_metrics(factory_id);
CREATE INDEX idx_mfg_maint_machine ON mfg_maintenance_logs(machine_id);
CREATE INDEX idx_mfg_energy_factory ON mfg_energy_usage(factory_id);
CREATE INDEX idx_mfg_alerts_factory ON mfg_alerts(factory_id);
CREATE INDEX idx_mfg_pred_machine ON mfg_predictions(machine_id);
CREATE INDEX idx_mfg_recs_machine ON mfg_recommendations(machine_id);
