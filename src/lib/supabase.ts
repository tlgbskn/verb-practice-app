import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type VerbType = 'stative' | 'irregular' | 'phrasal' | 'pattern' | 'participial';

export interface StativeVerb {
  id: string;
  verb: string;
  example: string | null;
  created_at: string;
}

export interface IrregularVerb {
  id: string;
  base_form: string;
  simple_past: string;
  past_participle: string;
  created_at: string;
}

export interface PhrasalVerb {
  id: string;
  verb: string;
  particle: string;
  full_verb: string;
  type: 'transitive_separable' | 'transitive_inseparable' | 'transitive_always_separated' | 'intransitive' | 'three_word';
  definition: string;
  example: string | null;
  category: string | null;
  created_at: string;
}

export interface VerbPattern {
  id: string;
  verb: string;
  pattern_type: 'gerund' | 'infinitive' | 'both_no_change' | 'both_with_change' | 'object_before_infinitive';
  notes: string | null;
  example: string | null;
  created_at: string;
}

export interface ParticipalAdjective {
  id: string;
  present_form: string;
  past_form: string;
  example_present: string | null;
  example_past: string | null;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  verb_id: string;
  verb_type: VerbType;
  status: 'new' | 'learning' | 'mastered';
  correct_count: number;
  incorrect_count: number;
  last_reviewed: string;
  next_review: string;
  created_at: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  quiz_type: string;
  score: number;
  total_questions: number;
  time_taken: number;
  created_at: string;
}
