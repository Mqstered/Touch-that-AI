export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type SkillType =
  | 'prompting'
  | 'safety'
  | 'reasoning'
  | 'creativity'
  | 'evaluation'
  | 'context';

export type LessonLevel = 'beginner' | 'intermediate' | 'advanced';

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          module_slug: string;
          title: string;
          level: LessonLevel;
          goal: string;
          skill: SkillType;
          tags: string[];
          lesson_text: string;
          bad_prompt: string | null;
          good_prompt: string | null;
          practice_task: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_slug: string;
          title: string;
          level?: LessonLevel;
          goal: string;
          skill: SkillType;
          tags?: string[];
          lesson_text: string;
          bad_prompt?: string | null;
          good_prompt?: string | null;
          practice_task: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          level?: LessonLevel;
          goal?: string;
          skill?: SkillType;
          tags?: string[];
          lesson_text?: string;
          bad_prompt?: string | null;
          good_prompt?: string | null;
          practice_task?: string;
          sort_order?: number;
          updated_at?: string;
        };
      };
      practice_attempts: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          user_response: string;
          score: number | null;
          feedback: string | null;
          time_spent_s: number | null;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          user_response: string;
          score?: number | null;
          feedback?: string | null;
          time_spent_s?: number | null;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          user_response?: string;
          score?: number | null;
          feedback?: string | null;
          time_spent_s?: number | null;
          completed_at?: string | null;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          module_slug: string;
          mastery: number;
          completed_lessons: number;
          latest_score: number | null;
          last_practiced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_slug: string;
          mastery?: number;
          completed_lessons?: number;
          latest_score?: number | null;
          last_practiced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          mastery?: number;
          completed_lessons?: number;
          latest_score?: number | null;
          last_practiced_at?: string | null;
          updated_at?: string;
        };
      };
      lesson_recommendations: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          reason: string | null;
          priority: number;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          reason?: string | null;
          priority?: number;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          reason?: string | null;
          priority?: number;
          expires_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      skill_type: SkillType;
      lesson_level: LessonLevel;
    };
  };
};
