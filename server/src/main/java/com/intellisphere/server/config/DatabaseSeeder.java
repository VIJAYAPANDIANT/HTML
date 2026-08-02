package com.intellisphere.server.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    public DatabaseSeeder(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            Integer count = jdbcTemplate.queryForObject("SELECT count(*) FROM roles", Integer.class);
            if (count != null && count == 0) {
                System.out.println("No data found in 'roles' table. Seeding realistic enterprise demo dataset...");
                seedData();
            } else {
                System.out.println("Database already contains data or 'roles' table is not empty. Skipping seeder.");
            }
        } catch (Exception e) {
            System.err.println("DatabaseSeeder execution failed or skipped: " + e.getMessage());
        }
    }

    private void seedData() {
        try {
            // 1. Roles
            UUID adminRoleId = UUID.randomUUID();
            UUID operatorRoleId = UUID.randomUUID();
            UUID userRoleId = UUID.randomUUID();

            jdbcTemplate.update("INSERT INTO roles (id, name, permissions) VALUES (?, ?, ?)",
                    adminRoleId, "ADMIN", new String[]{"ALL_PRIVILEGES"});
            jdbcTemplate.update("INSERT INTO roles (id, name, permissions) VALUES (?, ?, ?)",
                    operatorRoleId, "OPERATOR", new String[]{"READ", "WRITE", "SIMULATE"});
            jdbcTemplate.update("INSERT INTO roles (id, name, permissions) VALUES (?, ?, ?)",
                    userRoleId, "USER", new String[]{"READ"});

            // 2. Users
            UUID adminUserId = UUID.randomUUID();
            UUID operatorUserId = UUID.randomUUID();
            String hashedAdminPass = passwordEncoder.encode("adminpassword");
            String hashedOperatorPass = passwordEncoder.encode("operatorpassword");

            jdbcTemplate.update("INSERT INTO users (id, email, password_hash, first_name, last_name, role_id) VALUES (?, ?, ?, ?, ?, ?)",
                    adminUserId, "admin@intellisphere.com", hashedAdminPass, "Alexander", "Mercer", adminRoleId);
            jdbcTemplate.update("INSERT INTO users (id, email, password_hash, first_name, last_name, role_id) VALUES (?, ?, ?, ?, ?, ?)",
                    operatorUserId, "operator@intellisphere.com", hashedOperatorPass, "Sarah", "Connor", operatorRoleId);

            // 3. Organizations
            UUID orgId = UUID.randomUUID();
            jdbcTemplate.update("INSERT INTO organizations (id, name, domain, created_by) VALUES (?, ?, ?, ?)",
                    orgId, "IntelliSphere Global Solutions", "intellisphere.com", adminUserId);

            // 4. Industry Modules
            UUID agModuleId = UUID.randomUUID();
            UUID hcModuleId = UUID.randomUUID();
            UUID mfgModuleId = UUID.randomUUID();
            UUID scModuleId = UUID.randomUUID();

            jdbcTemplate.update("INSERT INTO industry_modules (id, name, key, description, is_active) VALUES (?, ?, ?, ?, ?)",
                    agModuleId, "Agriculture & Smart Farm", "agriculture", "Precision crop hydration telemetry and yield forecasts.", true);
            jdbcTemplate.update("INSERT INTO industry_modules (id, name, key, description, is_active) VALUES (?, ?, ?, ?, ?)",
                    hcModuleId, "Clinical Health Logistics", "healthcare", "ER bed allocations, cardiac triage, and patient streams.", true);
            jdbcTemplate.update("INSERT INTO industry_modules (id, name, key, description, is_active) VALUES (?, ?, ?, ?, ?)",
                    mfgModuleId, "Advanced Manufacturing OEE", "manufacturing", "Assembly line downtime, press joint stress, and energy saving indexes.", true);
            jdbcTemplate.update("INSERT INTO industry_modules (id, name, key, description, is_active) VALUES (?, ?, ?, ?, ?)",
                    scModuleId, "Smart City Operations Center", "smartcity", "AQI mapping, traffic detours, waste fill heights, and grid optimization.", true);

            // 5. Assets
            UUID tractorAssetId = UUID.randomUUID();
            UUID scannerAssetId = UUID.randomUUID();
            UUID pressAssetId = UUID.randomUUID();

            jdbcTemplate.update("INSERT INTO assets (id, organization_id, name, type, status) VALUES (?, ?, ?, ?, ?)",
                    tractorAssetId, orgId, "Autonomous Tractor Sector 4B", "Tractor", "ACTIVE");
            jdbcTemplate.update("INSERT INTO assets (id, organization_id, name, type, status) VALUES (?, ?, ?, ?, ?)",
                    scannerAssetId, orgId, "MRI Machine East Wing", "MRI Scanner", "ACTIVE");
            jdbcTemplate.update("INSERT INTO assets (id, organization_id, name, type, status) VALUES (?, ?, ?, ?, ?)",
                    pressAssetId, orgId, "Hydraulic Press Unit 5", "Schuler Press", "ACTIVE");

            // 6. Sensors
            jdbcTemplate.update("INSERT INTO sensors (id, asset_id, name, type, unit, last_reading, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), tractorAssetId, "Soil Hydration Sensor 12", "Hydration", "%", 54.0, "ONLINE");
            jdbcTemplate.update("INSERT INTO sensors (id, asset_id, name, type, unit, last_reading, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), scannerAssetId, "Core Coolant Pressure Sensor", "Pressure", "PSI", 42.5, "ONLINE");
            jdbcTemplate.update("INSERT INTO sensors (id, asset_id, name, type, unit, last_reading, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), pressAssetId, "Spindle Vibration Sensor 3", "Vibration", "mm/s", 1.4, "ONLINE");

            // 7. Reports
            jdbcTemplate.update("INSERT INTO reports (id, organization_id, title, file_path, file_size, created_by) VALUES (?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), orgId, "Q2 Operational Yield Summary", "/reports/q2_yield_summary.pdf", "2.4 MB", adminUserId);

            // 8. Alerts
            jdbcTemplate.update("INSERT INTO alerts (id, organization_id, severity, message, is_read) VALUES (?, ?, ?, ?, ?)",
                    UUID.randomUUID(), orgId, "CRITICAL", "Hydration drops below 54% threshold on Sector 4B corn fields.", false);
            jdbcTemplate.update("INSERT INTO alerts (id, organization_id, severity, message, is_read) VALUES (?, ?, ?, ?, ?)",
                    UUID.randomUUID(), orgId, "WARNING", "ICU bed capacities reaching 84% peak threshold limit.", false);

            // 9. Predictions
            UUID predId = UUID.randomUUID();
            jdbcTemplate.update("INSERT INTO predictions (id, module_id, input_data, prediction_output, confidence_score) VALUES (?, ?, CAST(? AS jsonb), CAST(? AS jsonb), ?)",
                    predId, agModuleId, "{\"soil_humidity\": 54.0}", "{\"yield_decrease_percentage\": 6.5}", 0.912);

            // 10. Recommendations
            jdbcTemplate.update("INSERT INTO recommendations (id, prediction_id, suggestion, priority) VALUES (?, ?, ?, ?)",
                    UUID.randomUUID(), predId, "Schedule auxiliary evening drip loops for 45 minutes on Sector 4B.", "HIGH");

            // 11. Notifications
            jdbcTemplate.update("INSERT INTO notifications (id, user_id, message, type, is_read) VALUES (?, ?, ?, ?, ?)",
                    UUID.randomUUID(), adminUserId, "System initialized: all 4 modules are online and monitoring telemetry.", "SYSTEM", false);

            // 14. Farms
            UUID farmId = UUID.randomUUID();
            jdbcTemplate.update("INSERT INTO farms (id, organization_id, name, location, acreage) VALUES (?, ?, ?, ?, ?)",
                    farmId, orgId, "Fresno Sector 1A Farm", "Fresno, California", 250.0);

            // 15. Crops
            UUID cropId = UUID.randomUUID();
            jdbcTemplate.update("INSERT INTO crops (id, farm_id, name, type, acreage, status, health_index, growth_stage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    cropId, farmId, "Sanger Corn Field", "Corn", 80.0, "STRESSED", 78.5, "Vegetative");

            // 16. Diseases
            jdbcTemplate.update("INSERT INTO diseases (id, crop_id, name, risk_probability, status, recommended_action) VALUES (?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), cropId, "Corn Smut Fungus Rust", 0.65, "SUSPECTED", "Spray localized copper fungicide sprays on infected leaves.");

            // 17. Hospitals
            UUID hospId = UUID.randomUUID();
            jdbcTemplate.update("INSERT INTO hospitals (id, organization_id, name, location, beds_total) VALUES (?, ?, ?, ?, ?)",
                    hospId, orgId, "IntelliSphere Central Medical Center", "Clovis Road, Fresno", 150);

            // 18. Patients
            UUID patientId = UUID.randomUUID();
            jdbcTemplate.update("INSERT INTO patients (id, hospital_id, first_name, last_name, admission_status, room_number, stability_index) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    patientId, hospId, "Eleanor", "Vance", "ADMITTED", "Room 304", 94.2);

            // 19. Emergency Cases
            jdbcTemplate.update("INSERT INTO emergency_cases (id, hospital_id, patient_id, category, severity, triage_level) VALUES (?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), hospId, patientId, "Cardiac Arrhythmia", "CRITICAL", 1);

            // 20. Departments
            UUID deptId = UUID.randomUUID();
            jdbcTemplate.update("INSERT INTO departments (id, hospital_id, name) VALUES (?, ?, ?)",
                    deptId, hospId, "Emergency Medicine ICU");

            // 21. Beds
            jdbcTemplate.update("INSERT INTO beds (id, department_id, room_number, bed_number, status) VALUES (?, ?, ?, ?, ?)",
                    UUID.randomUUID(), deptId, "304", "Bed A", "OCCUPIED");

            // 22. Medical Reports
            jdbcTemplate.update("INSERT INTO medical_reports (id, patient_id, title, content, file_path) VALUES (?, ?, ?, ?, ?)",
                    UUID.randomUUID(), patientId, "Cardiology Stress ECG Report", "Slight ST elevation noted. Stability index optimal at 94.2%.", "/reports/ecg_patient_vance.pdf");

            // 23. Healthcare Alerts
            jdbcTemplate.update("INSERT INTO healthcare_alerts (id, hospital_id, severity, message, is_resolved) VALUES (?, ?, ?, ?, ?)",
                    UUID.randomUUID(), hospId, "CRITICAL", "ICU Ventilator pressure anomalies detected on Room 304.", false);

            // 24. Healthcare Recommendations
            jdbcTemplate.update("INSERT INTO healthcare_recommendations (id, patient_id, suggestion) VALUES (?, ?, ?)",
                    UUID.randomUUID(), patientId, "Schedule bedside echocardiogram scan checklist loop.");

            // 25. Mfg Factories
            UUID factoryId = UUID.randomUUID();
            jdbcTemplate.update("INSERT INTO mfg_factories (id, name, location, status, oee_percentage, active_lines, total_machines, active_workers, daily_output_target, current_daily_output) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    factoryId, "Central Assembly Plant A", "Industrial Loop, Sanger", "OPERATIONAL", 88.4, 4, 24, 142, 12000.0, 10850.0);

            // 26. Mfg Production Lines
            UUID lineId = UUID.randomUUID();
            jdbcTemplate.update("INSERT INTO mfg_production_lines (id, factory_id, name, status, target_output, actual_output, oee_percentage) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    lineId, factoryId, "Press Line 1", "OPERATIONAL", 3000.0, 2890.0, 91.2);

            // 27. Mfg Machines
            UUID machineId = UUID.randomUUID();
            jdbcTemplate.update("INSERT INTO mfg_machines (id, production_line_id, name, machine_code, type, status, health_score, temperature, vibration, spindle_speed, hydraulic_pressure, age_months, last_maintenance, next_maintenance, failure_risk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    machineId, lineId, "Schuler Press 500T", "PR-500T", "Stamping Press", "OPERATIONAL", 94, 68.5, 1.4, 3000, 1400, 18, "June 12, 2026", "Sept 12, 2026", "Low");

            // 28. Mfg Production Metrics
            jdbcTemplate.update("INSERT INTO mfg_production_metrics (id, factory_id, target_units, actual_units, scrap_units, yield_rate, defect_rate, throughput_per_hour) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), factoryId, 12000, 10850, 195, 98.2, 1.8, 1350.0);

            // 29. Mfg Maintenance Logs
            jdbcTemplate.update("INSERT INTO mfg_maintenance_logs (id, machine_id, work_order_number, issue_description, priority, status, failure_probability, assigned_technician, scheduled_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), machineId, "WO-99120", "Check joint stress indicators and replace worn hydraulic seal.", "MEDIUM", "SCHEDULED", 0.12, "Mark Miller", "Aug 15, 2026");

            // 30. Mfg Energy Usage
            jdbcTemplate.update("INSERT INTO mfg_energy_usage (id, factory_id, current_kwh, daily_kwh_total, cost_today_usd, efficiency_kwh_per_unit, peak_demand_mw, carbon_footprint_kg) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), factoryId, 450.0, 10800.0, 3400.0, 0.99, 1.8, 2450.0);

            // 31. Mfg Alerts
            jdbcTemplate.update("INSERT INTO mfg_alerts (id, factory_id, title, category, severity, message, machine_code, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), factoryId, "Temperature Warning", "Thermal Stress", "WARNING", "Hydraulic press fluid temperature is elevated at 68.5 C.", "PR-500T", "ACTIVE");

            // 32. Mfg Predictions
            jdbcTemplate.update("INSERT INTO mfg_predictions (id, machine_id, predicted_failure_time, probability, confidence, details) VALUES (?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), machineId, new Date(System.currentTimeMillis() + 864000000), 0.145, 0.94, "Press hydraulic pump seal shows wear patterns.");

            // 33. Mfg Recommendations
            jdbcTemplate.update("INSERT INTO mfg_recommendations (id, machine_id, suggestion, priority) VALUES (?, ?, ?, ?)",
                    UUID.randomUUID(), machineId, "Recalibrate thermal sensor limits to filter normal heat spikes.", "LOW");

            // 34. Cities
            UUID cityId = UUID.randomUUID();
            jdbcTemplate.update("INSERT INTO cities (id, name, state, country, population, area_sq_km, health_score, sustainability_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    cityId, "Metropolis Fresno", "California", "USA", 542000, 300.0, 92.0, 88.0);

            // 35. Traffic Zones
            jdbcTemplate.update("INSERT INTO traffic_zones (id, city_id, name, congestion_level, average_speed, active_vehicles, camera_count) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), cityId, "Interstate-90 Expressway", 24.2, 45.0, 3350, 12);

            // 36. AQI Pollution
            jdbcTemplate.update("INSERT INTO aqi_pollution (id, city_id, location, aqi_index, pm25_level, pm10_level, main_pollutant) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), cityId, "Downtown Central Park", 64.0, 18.5, 34.2, "PM2.5");

            // 37. Waste Collection
            jdbcTemplate.update("INSERT INTO waste_collection (id, city_id, sector, container_type, fill_level_percentage, last_collection_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), cityId, "Sector 4B Residential", "Recycling bin", 52.4, new Date(), "ONLINE");

            // 38. Water Distribution
            jdbcTemplate.update("INSERT INTO water_distribution (id, city_id, station_name, flow_rate_lps, pressure_psi, quality_ph, turbidity_ntu) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), cityId, "Madison Road Main Loop", 3370.0, 52.0, 7.2, 0.45);

            // 39. Energy Grids
            jdbcTemplate.update("INSERT INTO energy_grids (id, city_id, substation_name, load_megawatts, capacity_megawatts, renewable_source_percentage, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), cityId, "Metropolitan Grid B Substation", 142.5, 200.0, 38.5, "STABLE");

            // 40. Complaints
            jdbcTemplate.update("INSERT INTO complaints (id, city_id, title, description, category, severity, status, submitted_by, assigned_department) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), cityId, "Water Main Anomaly Leak", "Vast water puddle leaking from Madison road pavement.", "Water Leak", "HIGH", "OPEN", adminUserId, "MUNICIPAL_WATER_WORKS");

            // 41. Emergencies
            jdbcTemplate.update("INSERT INTO emergencies (id, city_id, title, category, severity, status, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    UUID.randomUUID(), cityId, "Grid B Load shedding warning", "Power", "HIGH", "ACTIVE", 36.7820, -119.4200);

            // 42. Smartcity Predictions
            jdbcTemplate.update("INSERT INTO smartcity_predictions (id, city_id, target_module, prediction_details, confidence_score) VALUES (?, ?, ?, ?, ?)",
                    UUID.randomUUID(), cityId, "Traffic Bypass", "Traffic congestion detour optimization saves trip latency by 14 mins.", 0.942);

            // 43. Smartcity Recommendations
            jdbcTemplate.update("INSERT INTO smartcity_recommendations (id, city_id, suggestion, priority) VALUES (?, ?, ?, ?)",
                    UUID.randomUUID(), cityId, "Deploy temporary mobile flood walls at Sector 7 Reservoir 4.", "HIGH");

            // 44. Smartcity Notifications
            jdbcTemplate.update("INSERT INTO smartcity_notifications (id, city_id, message, severity, status) VALUES (?, ?, ?, ?, ?)",
                    UUID.randomUUID(), cityId, "River height levels approaching caution margins (4.2m).", "WARNING", "ACTIVE");

            System.out.println("Demo seeder successfully populated all 42 tables.");

        } catch (Exception e) {
            System.err.println("Failed to insert seeder data row elements: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
