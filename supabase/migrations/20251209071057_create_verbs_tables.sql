/*
  # English Verbs Learning Platform - Database Schema

  1. New Tables
    - `stative_verbs`
      - `id` (uuid, primary key)
      - `verb` (text, unique) - The stative verb
      - `example` (text) - Example usage
      - `created_at` (timestamp)
    
    - `irregular_verbs`
      - `id` (uuid, primary key)
      - `base_form` (text, unique) - Base form of the verb
      - `simple_past` (text) - Simple past form
      - `past_participle` (text) - Past participle form
      - `created_at` (timestamp)
    
    - `phrasal_verbs`
      - `id` (uuid, primary key)
      - `verb` (text) - Main verb
      - `particle` (text) - Particle (up, down, out, etc.)
      - `full_verb` (text) - Complete phrasal verb
      - `type` (text) - Type: transitive_separable, transitive_inseparable, transitive_always_separated, intransitive, three_word
      - `definition` (text) - Meaning/definition
      - `example` (text) - Example sentence
      - `category` (text) - Additional categorization
      - `created_at` (timestamp)
    
    - `verb_patterns`
      - `id` (uuid, primary key)
      - `verb` (text) - The verb
      - `pattern_type` (text) - gerund, infinitive, both_no_change, both_with_change, object_before_infinitive
      - `notes` (text) - Additional usage notes
      - `example` (text) - Example sentence
      - `created_at` (timestamp)
    
    - `participial_adjectives`
      - `id` (uuid, primary key)
      - `present_form` (text) - Present participle (e.g., "amazing")
      - `past_form` (text) - Past participle (e.g., "amazed")
      - `example_present` (text) - Example with present form
      - `example_past` (text) - Example with past form
      - `created_at` (timestamp)

  2. User Progress Tables
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `verb_id` (uuid) - Reference to any verb table
      - `verb_type` (text) - Which table: stative, irregular, phrasal, etc.
      - `status` (text) - new, learning, mastered
      - `correct_count` (integer) - Number of correct answers
      - `incorrect_count` (integer) - Number of incorrect answers
      - `last_reviewed` (timestamp)
      - `next_review` (timestamp) - For spaced repetition
      - `created_at` (timestamp)
    
    - `quiz_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `quiz_type` (text) - Type of quiz
      - `score` (integer) - Score achieved
      - `total_questions` (integer) - Total questions
      - `time_taken` (integer) - Time in seconds
      - `created_at` (timestamp)
    
    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `verb_id` (uuid) - Reference to verb
      - `verb_type` (text) - Which table
      - `notes` (text) - Personal notes
      - `created_at` (timestamp)

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read verb data
    - Add policies for users to manage their own progress and favorites
*/

-- Create stative_verbs table
CREATE TABLE IF NOT EXISTS stative_verbs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verb text UNIQUE NOT NULL,
  example text,
  created_at timestamptz DEFAULT now()
);

-- Create irregular_verbs table
CREATE TABLE IF NOT EXISTS irregular_verbs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_form text UNIQUE NOT NULL,
  simple_past text NOT NULL,
  past_participle text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create phrasal_verbs table
CREATE TABLE IF NOT EXISTS phrasal_verbs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verb text NOT NULL,
  particle text NOT NULL,
  full_verb text NOT NULL,
  type text NOT NULL CHECK (type IN ('transitive_separable', 'transitive_inseparable', 'transitive_always_separated', 'intransitive', 'three_word')),
  definition text NOT NULL,
  example text,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Create verb_patterns table
CREATE TABLE IF NOT EXISTS verb_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verb text NOT NULL,
  pattern_type text NOT NULL CHECK (pattern_type IN ('gerund', 'infinitive', 'both_no_change', 'both_with_change', 'object_before_infinitive')),
  notes text,
  example text,
  created_at timestamptz DEFAULT now()
);

-- Create participial_adjectives table
CREATE TABLE IF NOT EXISTS participial_adjectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  present_form text NOT NULL,
  past_form text NOT NULL,
  example_present text,
  example_past text,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  verb_id uuid NOT NULL,
  verb_type text NOT NULL CHECK (verb_type IN ('stative', 'irregular', 'phrasal', 'pattern', 'participial')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'learning', 'mastered')),
  correct_count integer DEFAULT 0,
  incorrect_count integer DEFAULT 0,
  last_reviewed timestamptz DEFAULT now(),
  next_review timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, verb_id, verb_type)
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_type text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL,
  time_taken integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  verb_id uuid NOT NULL,
  verb_type text NOT NULL CHECK (verb_type IN ('stative', 'irregular', 'phrasal', 'pattern', 'participial')),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, verb_id, verb_type)
);

-- Enable Row Level Security
ALTER TABLE stative_verbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE irregular_verbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE phrasal_verbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE verb_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE participial_adjectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Policies for verb tables (public read access)
CREATE POLICY "Anyone can read stative verbs"
  ON stative_verbs FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can read irregular verbs"
  ON irregular_verbs FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can read phrasal verbs"
  ON phrasal_verbs FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can read verb patterns"
  ON verb_patterns FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can read participial adjectives"
  ON participial_adjectives FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policies for user_progress (users can only access their own data)
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for quiz_results
CREATE POLICY "Users can view own quiz results"
  ON quiz_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_favorites
CREATE POLICY "Users can view own favorites"
  ON user_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON user_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites"
  ON user_favorites FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON user_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_phrasal_verbs_verb ON phrasal_verbs(verb);
CREATE INDEX IF NOT EXISTS idx_phrasal_verbs_type ON phrasal_verbs(type);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);