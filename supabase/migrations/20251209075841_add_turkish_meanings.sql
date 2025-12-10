/*
  # Add Turkish Meanings to Verb Tables

  ## Description
  This migration adds Turkish meaning columns to all verb tables to support bilingual search functionality.

  ## Changes
  1. Add `turkish` column to `stative_verbs` table
  2. Add `turkish` column to `irregular_verbs` table  
  3. Add `turkish` column to `phrasal_verbs` table
  4. Add `turkish` column to `verb_patterns` table
  5. Add `turkish` column to `participial_adjectives` table

  ## Notes
  - All columns are nullable to preserve existing data
  - Columns can be populated with Turkish meanings gradually
  - Text search will work across both English and Turkish columns
*/

-- Add turkish column to stative_verbs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stative_verbs' AND column_name = 'turkish'
  ) THEN
    ALTER TABLE stative_verbs ADD COLUMN turkish text;
  END IF;
END $$;

-- Add turkish column to irregular_verbs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'irregular_verbs' AND column_name = 'turkish'
  ) THEN
    ALTER TABLE irregular_verbs ADD COLUMN turkish text;
  END IF;
END $$;

-- Add turkish column to phrasal_verbs (already has definition, but adding turkish for consistency)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'phrasal_verbs' AND column_name = 'turkish'
  ) THEN
    ALTER TABLE phrasal_verbs ADD COLUMN turkish text;
  END IF;
END $$;

-- Add turkish column to verb_patterns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'verb_patterns' AND column_name = 'turkish'
  ) THEN
    ALTER TABLE verb_patterns ADD COLUMN turkish text;
  END IF;
END $$;

-- Add turkish column to participial_adjectives
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participial_adjectives' AND column_name = 'turkish'
  ) THEN
    ALTER TABLE participial_adjectives ADD COLUMN turkish text;
  END IF;
END $$;

-- Create text search indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_stative_verbs_search ON stative_verbs USING gin(to_tsvector('english', verb || ' ' || COALESCE(turkish, '')));
CREATE INDEX IF NOT EXISTS idx_irregular_verbs_search ON irregular_verbs USING gin(to_tsvector('english', base_form || ' ' || simple_past || ' ' || past_participle || ' ' || COALESCE(turkish, '')));
CREATE INDEX IF NOT EXISTS idx_phrasal_verbs_search ON phrasal_verbs USING gin(to_tsvector('english', full_verb || ' ' || definition || ' ' || COALESCE(turkish, '')));
CREATE INDEX IF NOT EXISTS idx_verb_patterns_search ON verb_patterns USING gin(to_tsvector('english', verb || ' ' || COALESCE(turkish, '') || ' ' || COALESCE(notes, '')));
