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
        Relationships: [];
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
          goal_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_slug: string;
          title: string;
          level?: LessonLevel;
          goal: string;
          goal_key?: string | null;
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
        Relationships: [];
      };
      practice_attempts: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          user_response: string;
          score: number | null;
          score_breakdown: Json | null;
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
          score_breakdown?: Json | null;
          feedback?: string | null;
          time_spent_s?: number | null;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          user_response?: string;
          score?: number | null;
          score_breakdown?: Json | null;
          feedback?: string | null;
          time_spent_s?: number | null;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      lesson_embeddings: {
        Row: {
          id: string;
          lesson_id: string;
          content: string;
          embedding: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          content: string;
          embedding: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          embedding?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      learning_profiles: {
        Row: {
          id: string;
          profile_key: string;
          goal: string;
          level: LessonLevel;
          skill: SkillType;
          query_text: string;
          embedding: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_key: string;
          goal: string;
          level?: LessonLevel;
          skill: SkillType;
          query_text: string;
          embedding: string;
          created_at?: string;
        };
        Update: {
          goal?: string;
          level?: LessonLevel;
          skill?: SkillType;
          query_text?: string;
          embedding?: string;
        };
        Relationships: [];
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
          review_due_at: string | null;
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
          review_due_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          mastery?: number;
          completed_lessons?: number;
          latest_score?: number | null;
          last_practiced_at?: string | null;
          review_due_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
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
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_lessons: {
        Args: {
          p_goal: string;
          p_level?: LessonLevel;
          p_skill?: SkillType | null;
          p_limit?: number;
        };
        Returns: {
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
          similarity: number;
        }[];
      };
      match_lessons_metadata: {
        Args: {
          p_goal: string;
          p_level?: LessonLevel;
          p_skill?: SkillType | null;
          p_limit?: number;
        };
        Returns: Database['public']['Tables']['lessons']['Row'][];
      };
      recompute_recommendations: {
        Args: { p_user_id: string };
        Returns: void;
      };
    };
    Enums: {
      skill_type: SkillType;
      lesson_level: LessonLevel;
    };
  };
};
