-- ============================================================================
-- 72 Hours — player data schema (portable)
-- ============================================================================
-- Plain PostgreSQL (13+). No Supabase-only features: no auth schema, no
-- auth.uid(), no RLS policies. Those live in supabase/migrations (step 10).
-- Runs as-is on a university Postgres server.
--
-- Shape: every table carries `player_id` → deleting a player row removes all
-- their data (ON DELETE CASCADE). One `sessions` row per playthrough; household,
-- events and result hang off the session.
--
-- Allowed values mirror src/lib/data/config.js — change both together.
-- Never stored here: emails, names, IPs, user-agent strings, free text.
-- ============================================================================

BEGIN;

-- ── players ─────────────────────────────────────────────────────────────────
-- One row per player. `id` = random guest ID (on Supabase: the auth user id).
-- No personal data here; email (accounts only) lives in the login system.
CREATE TABLE players (
  id          uuid        PRIMARY KEY,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── consents ────────────────────────────────────────────────────────────────
-- Every answer on the consent screen, kept as proof. New consent text version
-- → new row; older rows stay valid for data collected under them.
CREATE TABLE consents (
  id            bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  player_id     uuid        NOT NULL REFERENCES players (id) ON DELETE CASCADE,
  version       text        NOT NULL CHECK (length(version) <= 32),
  given         boolean     NOT NULL,
  given_at      timestamptz NOT NULL DEFAULT now(),
  withdrawn_at  timestamptz
);

-- ── profiles ────────────────────────────────────────────────────────────────
-- Start survey. One per player (asked once). All answers optional-by-skip.
CREATE TABLE profiles (
  player_id             uuid        PRIMARY KEY REFERENCES players (id) ON DELETE CASCADE,
  age                   text        CHECK (age IN ('under_18', '18_24', '25_34', '35_44', '45_54', '55_64', '65_plus')),
  gender                text        CHECK (gender IN ('male', 'female', 'non_binary', 'prefer_not_say')),
  prep_before           text        CHECK (prep_before IN ('fully', 'somewhat', 'never')),          -- past behaviour
  feel_prepared_before  text        CHECK (feel_prepared_before IN ('fully', 'somewhat', 'not_at_all')), -- pairs with results.feel_prepared_after
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- ── sessions ────────────────────────────────────────────────────────────────
-- One per playthrough. ended_at NULL = quit before the ending (drop-out).
CREATE TABLE sessions (
  id            uuid        PRIMARY KEY,
  player_id     uuid        NOT NULL REFERENCES players (id) ON DELETE CASCADE,
  playthrough   integer     NOT NULL CHECK (playthrough >= 1),
  language      text        CHECK (language IN ('en', 'et')),
  device_class  text        CHECK (device_class IN ('phone', 'tablet', 'desktop')),
  game_version  text        CHECK (length(game_version) <= 32),
  started_at    timestamptz NOT NULL DEFAULT now(),
  ended_at      timestamptz,
  completed     boolean     NOT NULL DEFAULT false,
  CHECK (ended_at IS NULL OR ended_at >= started_at)
);

-- ── households ──────────────────────────────────────────────────────────────
-- One per playthrough (players may try different households). Categories only;
-- the relative's typed name is never sent. Home fields NULL = home check skipped.
CREATE TABLE households (
  session_id      uuid        PRIMARY KEY REFERENCES sessions (id) ON DELETE CASCADE,
  player_id       uuid        NOT NULL REFERENCES players (id) ON DELETE CASCADE,
  family_size     smallint    CHECK (family_size BETWEEN 1 AND 20),
  has_elderly     boolean,
  has_children    boolean,
  children_count  smallint    CHECK (children_count BETWEEN 0 AND 20),
  home_building   text        CHECK (home_building IN ('apartment', 'detached', 'terraced', 'rural')),
  home_heating    text        CHECK (home_heating IN ('district', 'electric', 'wood_gas')),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ── events ──────────────────────────────────────────────────────────────────
-- Screen views, choices, resumes. `screen` = overlay name or Ink knot id (never
-- display text). t_ms = ms since playthrough start; time per screen = gap
-- between consecutive screen_view rows; a `resume` row marks time away.
CREATE TABLE events (
  id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id  uuid        NOT NULL REFERENCES sessions (id) ON DELETE CASCADE,
  player_id   uuid        NOT NULL REFERENCES players (id) ON DELETE CASCADE,
  type        text        NOT NULL CHECK (type IN ('screen_view', 'choice', 'resume')),
  screen      text        NOT NULL CHECK (length(screen) <= 32),
  payload     jsonb       NOT NULL DEFAULT '{}'::jsonb
                          CHECK (jsonb_typeof(payload) = 'object' AND octet_length(payload::text) <= 512),
  t_ms        bigint      CHECK (t_ms >= 0),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ── results ─────────────────────────────────────────────────────────────────
-- End of a playthrough: scores + post-game rating (asked before scores shown).
CREATE TABLE results (
  session_id           uuid        PRIMARY KEY REFERENCES sessions (id) ON DELETE CASCADE,
  player_id            uuid        NOT NULL REFERENCES players (id) ON DELETE CASCADE,
  prep_water           smallint    CHECK (prep_water      BETWEEN 0 AND 2),
  prep_food            smallint    CHECK (prep_food       BETWEEN 0 AND 2),
  prep_heat            smallint    CHECK (prep_heat       BETWEEN 0 AND 2),
  prep_light           smallint    CHECK (prep_light      BETWEEN 0 AND 2),
  prep_info            smallint    CHECK (prep_info       BETWEEN 0 AND 2),
  prep_medication      smallint    CHECK (prep_medication BETWEEN 0 AND 2),
  total_prep           smallint    CHECK (total_prep      BETWEEN 0 AND 12),
  call_score           smallint    CHECK (call_score      BETWEEN 0 AND 3),
  dialed_number        text        CHECK (dialed_number ~ '^[0-9]{0,15}$'),
  call_outcome         text        CHECK (call_outcome IN ('help_success', 'help_partial', 'help_delayed', 'wrong_number', 'no_help', '')),
  ending_type          text        CHECK (ending_type IN ('good', 'partial', 'delayed', 'bad')),
  feel_prepared_after  text        CHECK (feel_prepared_after IN ('fully', 'somewhat', 'not_at_all')), -- NULL = skipped
  created_at           timestamptz NOT NULL DEFAULT now()
);

-- ── indexes ─────────────────────────────────────────────────────────────────
-- Lookups by player (delete, "see my data") and by date (retention job).
CREATE INDEX consents_player_idx   ON consents   (player_id);
CREATE INDEX sessions_player_idx   ON sessions   (player_id);
CREATE INDEX sessions_started_idx  ON sessions   (started_at);
CREATE INDEX households_player_idx ON households (player_id);
CREATE INDEX events_session_idx    ON events     (session_id, t_ms);
CREATE INDEX events_player_idx     ON events     (player_id);
CREATE INDEX results_player_idx    ON results    (player_id);
CREATE INDEX players_created_idx   ON players    (created_at);

COMMIT;
