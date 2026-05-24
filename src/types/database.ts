export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
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
      module_progress: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          mastery: number;
          completed_lessons: number;
          last_activity: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          mastery?: number;
          completed_lessons?: number;
          last_activity?: string;
          created_at?: string;
        };
        Update: {
          mastery?: number;
          completed_lessons?: number;
          last_activity?: string;
        };
      };
      practice_sessions: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          score: number | null;
          started_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          score?: number | null;
          started_at?: string;
          completed_at?: string | null;
        };
        Update: {
          score?: number | null;
          completed_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
