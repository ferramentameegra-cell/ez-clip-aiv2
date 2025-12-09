-- 🔥 COPIE E COLE ESTE SQL NO RAILWAY DASHBOARD
-- Vá em: Railway > Projeto > MySQL > Query > Cole e Execute

ALTER TABLE users ADD COLUMN onboarding_use_case TEXT;
ALTER TABLE users ADD COLUMN onboarding_niche VARCHAR(255);
ALTER TABLE users ADD COLUMN onboarding_at TIMESTAMP NULL;

