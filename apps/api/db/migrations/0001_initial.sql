CREATE TABLE domains (
  id UUID PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE,
  first_seen_at TIMESTAMPTZ NOT NULL,
  last_checked_at TIMESTAMPTZ
);

CREATE TABLE checks (
  id UUID PRIMARY KEY,
  domain_id UUID NOT NULL REFERENCES domains(id),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  badge TEXT NOT NULL CHECK (badge IN ('green', 'yellow', 'red')),
  checked_at TIMESTAMPTZ NOT NULL,
  cache_ttl_seconds INTEGER NOT NULL
);

CREATE TABLE signals (
  id UUID PRIMARY KEY,
  check_id UUID NOT NULL REFERENCES checks(id),
  source TEXT NOT NULL,
  code TEXT NOT NULL,
  severity TEXT NOT NULL,
  detail TEXT NOT NULL,
  evidence_url TEXT,
  observed_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE reports (
  id UUID PRIMARY KEY,
  url TEXT NOT NULL,
  reason TEXT NOT NULL,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE feedback (
  id UUID PRIMARY KEY,
  domain TEXT NOT NULL,
  accurate BOOLEAN NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE audit_events (
  id UUID PRIMARY KEY,
  action TEXT NOT NULL,
  subject TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL
);
