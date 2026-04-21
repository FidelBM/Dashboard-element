-- Element Loyalty+ / Element Elite Fleet
-- Demo SQL seed for PostgreSQL generated to match the current Prisma schema.
--
-- Demo login password for seeded users:
--   Element123!
--
-- Password hash used below (bcrypt, compatible with bcryptjs):
--   $2b$12$2jBOL0fdi/Bw8QEGeM55t.4M4okPzxytZ45A.yNApROamghKWU3TS
--
-- Recommended usage:
--   psql "$DATABASE_URL" -f prisma/demo-full-seed.sql

BEGIN;

DELETE FROM "AuditLog";
DELETE FROM "RewardRedemption";
DELETE FROM "WorldCupBenefit";
DELETE FROM "Reward";
DELETE FROM "Campaign";
DELETE FROM "RewardCategory";
DELETE FROM "PointTransaction";
DELETE FROM "LoyaltyScoreHistory";
DELETE FROM "Purchase";
DELETE FROM "IncentiveRule";
DELETE FROM "LoyaltyProfile";
DELETE FROM "Vehicle";
DELETE FROM "Fleet";
DELETE FROM "User";
DELETE FROM "Role";
DELETE FROM "Company";

INSERT INTO "Role" ("id", "code", "name", "description", "createdAt") VALUES
  ('role_super_admin', 'SUPER_ADMIN'::"RoleCode", 'Super Admin', 'Control total del sistema y de la configuración global.', NOW()),
  ('role_admin_element', 'ADMIN_ELEMENT'::"RoleCode", 'Admin Element', 'Administración operativa de clientes, campañas, recompensas y usuarios.', NOW()),
  ('role_fleet_manager', 'FLEET_MANAGER'::"RoleCode", 'Fleet Manager', 'Responsable de la cuenta y la operación de la flotilla del cliente.', NOW()),
  ('role_analyst_ops', 'ANALYST_OPERATIONS'::"RoleCode", 'Analyst Operations', 'Analítica, monitoreo y detección de riesgo o intervención.', NOW());

INSERT INTO "Company" ("id", "name", "industry", "status", "accountOwner", "foundedAt", "createdAt", "updatedAt") VALUES
  ('company_logistica_norte', 'Logística del Norte', 'Logistics', 'ACTIVE'::"UserStatus", 'Paola Ramírez', '2015-05-12T00:00:00Z', '2021-03-12T12:00:00Z', NOW()),
  ('company_movilidad_urbana', 'Movilidad Urbana MX', 'Mobility Services', 'ACTIVE'::"UserStatus", 'Jorge Salinas', '2019-09-15T00:00:00Z', '2023-06-01T12:00:00Z', NOW()),
  ('company_retail_express', 'Retail Express Fleet', 'Retail Distribution', 'ACTIVE'::"UserStatus", 'Carla Mendoza', '2017-04-20T00:00:00Z', '2022-02-10T09:00:00Z', NOW()),
  ('company_energia_verde', 'Energía Verde Operaciones', 'Energy', 'ACTIVE'::"UserStatus", 'Mauricio Lozano', '2018-08-08T00:00:00Z', '2024-01-18T08:00:00Z', NOW());

INSERT INTO "User" ("id", "name", "email", "passwordHash", "status", "roleId", "companyId", "createdAt", "updatedAt") VALUES
  ('user_super_admin', 'Sofía Herrera', 'superadmin@element.com', '$2b$12$2jBOL0fdi/Bw8QEGeM55t.4M4okPzxytZ45A.yNApROamghKWU3TS', 'ACTIVE'::"UserStatus", 'role_super_admin', NULL, NOW(), NOW()),
  ('user_admin_element', 'Daniel Cruz', 'admin@element.com', '$2b$12$2jBOL0fdi/Bw8QEGeM55t.4M4okPzxytZ45A.yNApROamghKWU3TS', 'ACTIVE'::"UserStatus", 'role_admin_element', NULL, NOW(), NOW()),
  ('user_analyst_ops', 'Elena Torres', 'analyst@element.com', '$2b$12$2jBOL0fdi/Bw8QEGeM55t.4M4okPzxytZ45A.yNApROamghKWU3TS', 'ACTIVE'::"UserStatus", 'role_analyst_ops', NULL, NOW(), NOW()),
  ('user_ana_norte', 'Ana Martínez', 'ana@logisticadelnorte.com', '$2b$12$2jBOL0fdi/Bw8QEGeM55t.4M4okPzxytZ45A.yNApROamghKWU3TS', 'ACTIVE'::"UserStatus", 'role_fleet_manager', 'company_logistica_norte', NOW(), NOW()),
  ('user_luis_norte', 'Luis Ortega', 'luis@logisticadelnorte.com', '$2b$12$2jBOL0fdi/Bw8QEGeM55t.4M4okPzxytZ45A.yNApROamghKWU3TS', 'ACTIVE'::"UserStatus", 'role_fleet_manager', 'company_logistica_norte', NOW(), NOW()),
  ('user_marco_urbana', 'Marco Flores', 'marco@movilidadurbana.com', '$2b$12$2jBOL0fdi/Bw8QEGeM55t.4M4okPzxytZ45A.yNApROamghKWU3TS', 'ACTIVE'::"UserStatus", 'role_fleet_manager', 'company_movilidad_urbana', NOW(), NOW()),
  ('user_sandra_urbana', 'Sandra Vega', 'sandra@movilidadurbana.com', '$2b$12$2jBOL0fdi/Bw8QEGeM55t.4M4okPzxytZ45A.yNApROamghKWU3TS', 'ACTIVE'::"UserStatus", 'role_fleet_manager', 'company_movilidad_urbana', NOW(), NOW()),
  ('user_ricardo_retail', 'Ricardo Soto', 'ricardo@retailexpress.com', '$2b$12$2jBOL0fdi/Bw8QEGeM55t.4M4okPzxytZ45A.yNApROamghKWU3TS', 'ACTIVE'::"UserStatus", 'role_fleet_manager', 'company_retail_express', NOW(), NOW()),
  ('user_fernanda_energia', 'Fernanda Ibáñez', 'fernanda@energiaverde.com', '$2b$12$2jBOL0fdi/Bw8QEGeM55t.4M4okPzxytZ45A.yNApROamghKWU3TS', 'ACTIVE'::"UserStatus", 'role_fleet_manager', 'company_energia_verde', NOW(), NOW()),
  ('user_inactive_demo', 'Usuario Inactivo Demo', 'inactive.demo@element.com', '$2b$12$2jBOL0fdi/Bw8QEGeM55t.4M4okPzxytZ45A.yNApROamghKWU3TS', 'INACTIVE'::"UserStatus", 'role_fleet_manager', 'company_retail_express', NOW(), NOW());

INSERT INTO "Fleet" ("id", "companyId", "activeVehicles", "segments", "updatedAt") VALUES
  ('fleet_norte', 'company_logistica_norte', 124, 'Heavy cargo, vans, pickups', NOW()),
  ('fleet_urbana', 'company_movilidad_urbana', 62, 'Sedans, SUVs, urban vans', NOW()),
  ('fleet_retail', 'company_retail_express', 88, 'Last-mile vans, pickups', NOW()),
  ('fleet_energia', 'company_energia_verde', 41, 'Service trucks, pickups, SUVs', NOW());

INSERT INTO "Vehicle" ("id", "fleetId", "label", "vin", "type", "status", "acquiredAt", "monthlyCost") VALUES
  ('veh_norte_001', 'fleet_norte', 'LDN Trailer 01', 'ELF0001LDNTRAILER', 'TRUCK'::"VehicleType", 'ACTIVE'::"VehicleStatus", '2024-01-15T12:00:00Z', 45000.00),
  ('veh_norte_002', 'fleet_norte', 'LDN Van 14', 'ELF0002LDNVAN014', 'VAN'::"VehicleType", 'ACTIVE'::"VehicleStatus", '2024-08-03T12:00:00Z', 18000.00),
  ('veh_norte_003', 'fleet_norte', 'LDN Pickup 08', 'ELF0003LDNPICK08', 'PICKUP'::"VehicleType", 'MAINTENANCE'::"VehicleStatus", '2025-02-20T12:00:00Z', 16500.00),
  ('veh_urbana_001', 'fleet_urbana', 'MUMX SUV 07', 'ELF0004MUMXSUV07', 'SUV'::"VehicleType", 'ACTIVE'::"VehicleStatus", '2025-02-11T12:00:00Z', 22000.00),
  ('veh_urbana_002', 'fleet_urbana', 'MUMX Sedan 21', 'ELF0005MUMXSED21', 'SEDAN'::"VehicleType", 'ACTIVE'::"VehicleStatus", '2025-03-05T12:00:00Z', 14000.00),
  ('veh_urbana_003', 'fleet_urbana', 'MUMX Van 04', 'ELF0006MUMXVAN004', 'VAN'::"VehicleType", 'ACTIVE'::"VehicleStatus", '2025-03-25T12:00:00Z', 17500.00),
  ('veh_retail_001', 'fleet_retail', 'REX Van 11', 'ELF0007REXVAN011', 'VAN'::"VehicleType", 'ACTIVE'::"VehicleStatus", '2024-11-09T12:00:00Z', 16000.00),
  ('veh_retail_002', 'fleet_retail', 'REX Pickup 03', 'ELF0008REXPICK03', 'PICKUP'::"VehicleType", 'ACTIVE'::"VehicleStatus", '2025-01-16T12:00:00Z', 15500.00),
  ('veh_retail_003', 'fleet_retail', 'REX Van 18', 'ELF0009REXVAN018', 'VAN'::"VehicleType", 'RETIRED'::"VehicleStatus", '2023-12-12T12:00:00Z', 14900.00),
  ('veh_energia_001', 'fleet_energia', 'EVO Service 05', 'ELF0010EVOSVC005', 'TRUCK'::"VehicleType", 'ACTIVE'::"VehicleStatus", '2024-07-12T12:00:00Z', 24000.00),
  ('veh_energia_002', 'fleet_energia', 'EVO Pickup 09', 'ELF0011EVOPICK09', 'PICKUP'::"VehicleType", 'ACTIVE'::"VehicleStatus", '2025-01-20T12:00:00Z', 17000.00),
  ('veh_energia_003', 'fleet_energia', 'EVO SUV 02', 'ELF0012EVOSUV002', 'SUV'::"VehicleType", 'ACTIVE'::"VehicleStatus", '2025-04-18T12:00:00Z', 19500.00);

INSERT INTO "LoyaltyProfile" (
  "id", "companyId", "loyaltyScore", "tier", "totalPoints", "purchasePoints", "redeemedPoints",
  "tenureScore", "serviceUsageScore", "fleetSizeScore", "renewalScore", "updatedAt"
) VALUES
  ('lp_norte', 'company_logistica_norte', 82, 'STRATEGIC'::"LoyaltyTier", 345, 465, 120, 100, 88, 50, 83, NOW()),
  ('lp_urbana', 'company_movilidad_urbana', 68, 'ELITE'::"LoyaltyTier", 220, 300, 80, 72, 76, 25, 88, NOW()),
  ('lp_retail', 'company_retail_express', 57, 'PARTNER'::"LoyaltyTier", 145, 185, 40, 84, 58, 35, 46, NOW()),
  ('lp_energia', 'company_energia_verde', 39, 'BASE'::"LoyaltyTier", 72, 92, 20, 54, 34, 16, 49, NOW());

INSERT INTO "LoyaltyScoreHistory" (
  "id", "loyaltyProfileId", "score", "tier", "tenureScore", "serviceUsageScore", "fleetSizeScore", "renewalScore", "note", "recordedAt"
) VALUES
  ('lsh_norte_01', 'lp_norte', 70, 'ELITE'::"LoyaltyTier", 92, 66, 44, 71, 'Recompute after Q4 fleet growth', '2025-11-15T12:00:00Z'),
  ('lsh_norte_02', 'lp_norte', 76, 'ELITE'::"LoyaltyTier", 96, 78, 48, 74, 'Service adoption increase', '2026-01-20T12:00:00Z'),
  ('lsh_norte_03', 'lp_norte', 82, 'STRATEGIC'::"LoyaltyTier", 100, 88, 50, 83, 'Strategic threshold reached', '2026-04-05T12:00:00Z'),
  ('lsh_urbana_01', 'lp_urbana', 52, 'PARTNER'::"LoyaltyTier", 61, 59, 18, 70, 'Base analytics snapshot', '2025-10-18T12:00:00Z'),
  ('lsh_urbana_02', 'lp_urbana', 61, 'ELITE'::"LoyaltyTier", 68, 70, 22, 81, 'Early renewal wave', '2026-02-14T12:00:00Z'),
  ('lsh_urbana_03', 'lp_urbana', 68, 'ELITE'::"LoyaltyTier", 72, 76, 25, 88, 'World Cup campaign qualification', '2026-04-11T12:00:00Z'),
  ('lsh_retail_01', 'lp_retail', 44, 'PARTNER'::"LoyaltyTier", 78, 42, 28, 31, 'Retail launch', '2025-09-10T12:00:00Z'),
  ('lsh_retail_02', 'lp_retail', 57, 'PARTNER'::"LoyaltyTier", 84, 58, 35, 46, 'Expanded last-mile services', '2026-03-19T12:00:00Z'),
  ('lsh_energia_01', 'lp_energia', 33, 'BASE'::"LoyaltyTier", 48, 22, 14, 44, 'Initial baseline', '2026-01-10T12:00:00Z'),
  ('lsh_energia_02', 'lp_energia', 39, 'BASE'::"LoyaltyTier", 54, 34, 16, 49, 'Positive maintenance behavior', '2026-04-12T12:00:00Z');

INSERT INTO "IncentiveRule" ("id", "name", "description", "ruleType", "threshold", "points", "active", "startsAt", "endsAt", "createdAt") VALUES
  ('rule_purchase_amount', 'High Value Fleet Purchase', 'Points for purchases above MXN 2,000,000', 'PURCHASE_AMOUNT'::"IncentiveRuleType", 2000000.00, 60, TRUE, NULL, NULL, NOW()),
  ('rule_vehicle_addition', 'Per Vehicle Added', 'Points per additional vehicle added to the fleet', 'VEHICLE_ADDITION'::"IncentiveRuleType", NULL, 5, TRUE, NULL, NULL, NOW()),
  ('rule_early_renewal', 'Early Renewal', 'Bonus for contracts renewed before maturity', 'EARLY_RENEWAL'::"IncentiveRuleType", NULL, 40, TRUE, NULL, NULL, NOW()),
  ('rule_multi_product', 'Multi Product Bonus', 'Bonus for 2 or more additional services', 'MULTI_PRODUCT'::"IncentiveRuleType", 2.00, 30, TRUE, NULL, NULL, NOW()),
  ('rule_positive_behavior', 'Positive Behavior', 'Bonus tied to operational excellence and compliance', 'POSITIVE_BEHAVIOR'::"IncentiveRuleType", NULL, 25, TRUE, NULL, NULL, NOW()),
  ('rule_ecosystem_usage', 'Ecosystem Usage', 'Usage bonus for 3 or more ecosystem interactions', 'ECOSYSTEM_USAGE'::"IncentiveRuleType", 3.00, 20, TRUE, NULL, NULL, NOW());

INSERT INTO "Purchase" (
  "id", "companyId", "title", "type", "amount", "vehiclesAdded", "additionalServices",
  "ecosystemUsage", "renewedEarly", "positiveBehavior", "pointsAwarded", "purchasedAt"
) VALUES
  ('pur_norte_01', 'company_logistica_norte', 'Fleet expansion Monterrey hub', 'FLEET_EXPANSION'::"PurchaseType", 3600000.00, 18, 3, 4, FALSE, TRUE, 235, '2026-02-15T12:00:00Z'),
  ('pur_norte_02', 'company_logistica_norte', 'Early renewal 2026 package', 'RENEWAL'::"PurchaseType", 1850000.00, 0, 2, 3, TRUE, TRUE, 150, '2026-03-20T12:00:00Z'),
  ('pur_urbana_01', 'company_movilidad_urbana', 'Airport shuttle fleet growth', 'FLEET_EXPANSION'::"PurchaseType", 2450000.00, 10, 2, 3, FALSE, TRUE, 190, '2026-02-28T12:00:00Z'),
  ('pur_urbana_02', 'company_movilidad_urbana', 'Mobility services bundle', 'MULTIPRODUCT'::"PurchaseType", 920000.00, 4, 4, 5, FALSE, TRUE, 110, '2026-04-10T12:00:00Z'),
  ('pur_retail_01', 'company_retail_express', 'Last-mile vans phase II', 'FLEET_EXPANSION'::"PurchaseType", 2100000.00, 9, 1, 2, FALSE, TRUE, 130, '2026-03-08T12:00:00Z'),
  ('pur_retail_02', 'company_retail_express', 'Renewal and maintenance package', 'RENEWAL'::"PurchaseType", 640000.00, 0, 2, 2, TRUE, FALSE, 70, '2026-04-03T12:00:00Z'),
  ('pur_energia_01', 'company_energia_verde', 'Field operations pickup expansion', 'FLEET_EXPANSION'::"PurchaseType", 1180000.00, 5, 1, 2, FALSE, TRUE, 50, '2026-02-17T12:00:00Z'),
  ('pur_energia_02', 'company_energia_verde', 'Green operations service upgrade', 'ADDITIONAL_SERVICES'::"PurchaseType", 780000.00, 1, 3, 3, FALSE, TRUE, 42, '2026-04-09T12:00:00Z');

INSERT INTO "Campaign" (
  "id", "name", "slug", "type", "description", "bonusPoints",
  "eligibilityMinTier", "eligibilityMinPoints", "startsAt", "endsAt", "active"
) VALUES
  ('camp_growth_q2', 'Growth Accelerator Q2', 'growth-accelerator-q2', 'STANDARD'::"CampaignType", 'Quarterly program to accelerate fleet expansion and account share.', 20, 'PARTNER'::"LoyaltyTier", 120, '2026-03-01T00:00:00Z', '2026-06-30T23:59:59Z', TRUE),
  ('camp_world_cup', 'Road to the World Cup 2026', 'road-to-the-world-cup-2026', 'WORLD_CUP'::"CampaignType", 'Special incentive wave tied to Mexico-hosted World Cup activations.', 35, 'PARTNER'::"LoyaltyTier", 140, '2026-04-01T00:00:00Z', '2026-07-31T23:59:59Z', TRUE),
  ('camp_executive_push', 'Executive Value Sprint', 'executive-value-sprint', 'STANDARD'::"CampaignType", 'Tactical push for strategic upsell and account planning.', 15, 'ELITE'::"LoyaltyTier", 200, '2026-04-15T00:00:00Z', '2026-05-31T23:59:59Z', TRUE),
  ('camp_world_cup_drivers', 'Experiencias Mundial Conductores', 'experiencias-mundial-conductores', 'WORLD_CUP'::"CampaignType", 'Driver engagement and hospitality activations for selected accounts.', 25, 'PARTNER'::"LoyaltyTier", 100, '2026-05-01T00:00:00Z', '2026-07-15T23:59:59Z', TRUE);

INSERT INTO "RewardCategory" ("id", "name", "slug", "description", "isWorldCup") VALUES
  ('cat_operational', 'Operational Value', 'operational-value', 'Benefits tied to efficiency, service and account support.', FALSE),
  ('cat_premium', 'Premium Access', 'premium-access', 'High-value executive experiences and strategic support.', FALSE),
  ('cat_world_cup', 'World Cup Experiences', 'world-cup-experiences', 'World Cup themed benefits and experiences.', TRUE),
  ('cat_driver', 'Driver Engagement', 'driver-engagement', 'Benefits aimed at driver experience and activations.', TRUE);

INSERT INTO "Reward" (
  "id", "name", "description", "categoryId", "minTier", "pointsCost", "stock", "active", "campaignId", "createdAt"
) VALUES
  ('reward_audit_pack', 'Service Audit Pack', 'Quarterly operational fleet audit with tailored improvement recommendations.', 'cat_operational', 'BASE'::"LoyaltyTier", 80, NULL, TRUE, NULL, NOW()),
  ('reward_account_sprint', 'Dedicated Account Sprint', 'Two-week premium intervention sprint with account strategy follow-up.', 'cat_premium', 'PARTNER'::"LoyaltyTier", 140, NULL, TRUE, 'camp_growth_q2', NOW()),
  ('reward_strategy_workshop', 'VIP Fleet Strategy Workshop', 'Executive workshop for long-term fleet optimization and relationship planning.', 'cat_premium', 'ELITE'::"LoyaltyTier", 220, NULL, TRUE, 'camp_executive_push', NOW()),
  ('reward_worldcup_kit', 'World Cup Driver Kit', 'Limited edition World Cup themed kit for drivers and key client contacts.', 'cat_world_cup', 'PARTNER'::"LoyaltyTier", 160, 50, TRUE, 'camp_world_cup', NOW()),
  ('reward_hospitality', 'Hospitality Match Experience', 'VIP hospitality package for qualified client teams.', 'cat_world_cup', 'STRATEGIC'::"LoyaltyTier", 300, 10, TRUE, 'camp_world_cup', NOW()),
  ('reward_branding', 'Fleet Branding Upgrade', 'Temporary thematic branding package for selected fleet units.', 'cat_world_cup', 'ELITE'::"LoyaltyTier", 210, 20, TRUE, 'camp_world_cup_drivers', NOW()),
  ('reward_driver_activation', 'Driver Activation Day', 'On-site driver engagement activation with branded materials.', 'cat_driver', 'PARTNER'::"LoyaltyTier", 125, 35, TRUE, 'camp_world_cup_drivers', NOW()),
  ('reward_priority_support', 'Priority Operations Support', 'Priority support lane for critical operational incidents.', 'cat_operational', 'PARTNER'::"LoyaltyTier", 110, NULL, TRUE, NULL, NOW());

INSERT INTO "WorldCupBenefit" (
  "id", "rewardId", "campaignId", "venue", "activationType", "hospitality", "limitedEdition"
) VALUES
  ('wcb_kit', 'reward_worldcup_kit', 'camp_world_cup', 'CDMX Fan Hub', 'Merch Kit', FALSE, TRUE),
  ('wcb_hospitality', 'reward_hospitality', 'camp_world_cup', 'Estadio BBVA', 'Hospitality', TRUE, TRUE),
  ('wcb_branding', 'reward_branding', 'camp_world_cup_drivers', 'Guadalajara Mobility Hub', 'Fleet Branding', FALSE, TRUE),
  ('wcb_driver_day', 'reward_driver_activation', 'camp_world_cup_drivers', 'Monterrey Driver Center', 'Driver Activation', FALSE, TRUE);

INSERT INTO "PointTransaction" (
  "id", "loyaltyProfileId", "companyId", "purchaseId", "userId", "type", "points", "description", "createdAt"
) VALUES
  ('pt_norte_01', 'lp_norte', 'company_logistica_norte', 'pur_norte_01', 'user_ana_norte', 'EARNED'::"PointTransactionType", 235, 'Purchase points awarded: Fleet expansion Monterrey hub', '2026-02-15T12:05:00Z'),
  ('pt_norte_02', 'lp_norte', 'company_logistica_norte', 'pur_norte_02', 'user_luis_norte', 'EARNED'::"PointTransactionType", 150, 'Purchase points awarded: Early renewal 2026 package', '2026-03-20T12:05:00Z'),
  ('pt_norte_03', 'lp_norte', 'company_logistica_norte', NULL, 'user_admin_element', 'ADJUSTMENT'::"PointTransactionType", 80, 'Manual premium service recovery credit', '2026-04-02T09:15:00Z'),
  ('pt_norte_04', 'lp_norte', 'company_logistica_norte', NULL, 'user_ana_norte', 'REDEMPTION'::"PointTransactionType", -120, 'Reward redeemed: Service Audit Pack', '2026-04-06T11:00:00Z'),
  ('pt_urbana_01', 'lp_urbana', 'company_movilidad_urbana', 'pur_urbana_01', 'user_marco_urbana', 'EARNED'::"PointTransactionType", 190, 'Purchase points awarded: Airport shuttle fleet growth', '2026-02-28T12:05:00Z'),
  ('pt_urbana_02', 'lp_urbana', 'company_movilidad_urbana', 'pur_urbana_02', 'user_marco_urbana', 'EARNED'::"PointTransactionType", 110, 'Purchase points awarded: Mobility services bundle', '2026-04-10T12:05:00Z'),
  ('pt_urbana_03', 'lp_urbana', 'company_movilidad_urbana', NULL, 'user_admin_element', 'REDEMPTION'::"PointTransactionType", -80, 'Reward redeemed: Driver Activation Day', '2026-04-18T10:00:00Z'),
  ('pt_retail_01', 'lp_retail', 'company_retail_express', 'pur_retail_01', 'user_ricardo_retail', 'EARNED'::"PointTransactionType", 130, 'Purchase points awarded: Last-mile vans phase II', '2026-03-08T12:05:00Z'),
  ('pt_retail_02', 'lp_retail', 'company_retail_express', 'pur_retail_02', 'user_ricardo_retail', 'EARNED'::"PointTransactionType", 70, 'Purchase points awarded: Renewal and maintenance package', '2026-04-03T12:05:00Z'),
  ('pt_retail_03', 'lp_retail', 'company_retail_express', NULL, 'user_admin_element', 'REDEMPTION'::"PointTransactionType", -40, 'Reward redeemed: Priority Operations Support', '2026-04-12T15:00:00Z'),
  ('pt_energia_01', 'lp_energia', 'company_energia_verde', 'pur_energia_01', 'user_fernanda_energia', 'EARNED'::"PointTransactionType", 50, 'Purchase points awarded: Field operations pickup expansion', '2026-02-17T12:05:00Z'),
  ('pt_energia_02', 'lp_energia', 'company_energia_verde', 'pur_energia_02', 'user_fernanda_energia', 'EARNED'::"PointTransactionType", 42, 'Purchase points awarded: Green operations service upgrade', '2026-04-09T12:05:00Z'),
  ('pt_energia_03', 'lp_energia', 'company_energia_verde', NULL, 'user_admin_element', 'ADJUSTMENT'::"PointTransactionType", -20, 'Adjustment after duplicate submission cleanup', '2026-04-15T08:30:00Z');

INSERT INTO "RewardRedemption" (
  "id", "rewardId", "companyId", "userId", "pointsSpent", "status", "redeemedAt"
) VALUES
  ('rr_norte_01', 'reward_audit_pack', 'company_logistica_norte', 'user_ana_norte', 120, 'FULFILLED'::"RedemptionStatus", '2026-04-06T11:00:00Z'),
  ('rr_urbana_01', 'reward_driver_activation', 'company_movilidad_urbana', 'user_marco_urbana', 80, 'APPROVED'::"RedemptionStatus", '2026-04-18T10:00:00Z'),
  ('rr_retail_01', 'reward_priority_support', 'company_retail_express', 'user_ricardo_retail', 40, 'APPROVED'::"RedemptionStatus", '2026-04-12T15:00:00Z'),
  ('rr_norte_02', 'reward_branding', 'company_logistica_norte', 'user_luis_norte', 90, 'PENDING'::"RedemptionStatus", '2026-04-20T09:30:00Z');

INSERT INTO "AuditLog" (
  "id", "actorId", "actorName", "action", "entityType", "entityId", "metadata", "createdAt"
) VALUES
  ('audit_001', 'user_super_admin', 'Sofía Herrera', 'AUTH_LOGIN', 'User', 'user_super_admin', '{"role":"SUPER_ADMIN"}', '2026-04-20T08:00:00Z'),
  ('audit_002', 'user_admin_element', 'Daniel Cruz', 'AUTH_LOGIN', 'User', 'user_admin_element', '{"role":"ADMIN_ELEMENT"}', '2026-04-20T08:03:00Z'),
  ('audit_003', 'user_admin_element', 'Daniel Cruz', 'CAMPAIGN_CREATED', 'Campaign', 'camp_world_cup', '{"slug":"road-to-the-world-cup-2026"}', '2026-03-28T14:00:00Z'),
  ('audit_004', 'user_admin_element', 'Daniel Cruz', 'REWARD_CREATED', 'Reward', 'reward_worldcup_kit', '{"campaignId":"camp_world_cup"}', '2026-03-29T11:00:00Z'),
  ('audit_005', 'user_admin_element', 'Daniel Cruz', 'POINTS_ADJUSTED', 'Company', 'company_logistica_norte', '{"points":80,"reason":"Manual premium service recovery credit"}', '2026-04-02T09:15:00Z'),
  ('audit_006', 'user_ana_norte', 'Ana Martínez', 'REWARD_REDEEMED', 'RewardRedemption', 'rr_norte_01', '{"rewardId":"reward_audit_pack","companyId":"company_logistica_norte"}', '2026-04-06T11:00:00Z'),
  ('audit_007', 'user_marco_urbana', 'Marco Flores', 'REWARD_REDEEMED', 'RewardRedemption', 'rr_urbana_01', '{"rewardId":"reward_driver_activation","companyId":"company_movilidad_urbana"}', '2026-04-18T10:00:00Z'),
  ('audit_008', 'user_ricardo_retail', 'Ricardo Soto', 'PURCHASE_CREATED', 'Purchase', 'pur_retail_02', '{"companyId":"company_retail_express","title":"Renewal and maintenance package"}', '2026-04-03T12:05:00Z'),
  ('audit_009', 'user_admin_element', 'Daniel Cruz', 'USER_CREATED', 'User', 'user_inactive_demo', '{"email":"inactive.demo@element.com","role":"FLEET_MANAGER"}', '2026-04-01T13:30:00Z'),
  ('audit_010', 'user_admin_element', 'Daniel Cruz', 'ADMIN_USERS_ACCESS_GRANTED', 'AdminUsersAccess', 'user_admin_element', '{"role":"ADMIN_ELEMENT"}', '2026-04-20T10:10:00Z'),
  ('audit_011', 'user_admin_element', 'Daniel Cruz', 'ADMIN_USERS_ACCESS_FAILED', 'AdminUsersAccess', 'user_admin_element', '{"role":"ADMIN_ELEMENT"}', '2026-04-20T10:12:00Z'),
  ('audit_012', 'user_super_admin', 'Sofía Herrera', 'USER_ROLE_CHANGED', 'User', 'user_analyst_ops', '{"previousRole":"ANALYST_OPERATIONS","nextRole":"ANALYST_OPERATIONS"}', '2026-04-20T10:30:00Z');

COMMIT;
