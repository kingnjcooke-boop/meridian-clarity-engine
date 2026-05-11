export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      actions: {
        Row: {
          artifact_text: string | null
          artifact_url: string | null
          completed_at: string | null
          created_at: string
          feedback: string | null
          gap: string | null
          id: string
          pts: number | null
          pts_awarded: number | null
          score_id: string | null
          signal: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          artifact_text?: string | null
          artifact_url?: string | null
          completed_at?: string | null
          created_at?: string
          feedback?: string | null
          gap?: string | null
          id?: string
          pts?: number | null
          pts_awarded?: number | null
          score_id?: string | null
          signal?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          artifact_text?: string | null
          artifact_url?: string | null
          completed_at?: string | null
          created_at?: string
          feedback?: string | null
          gap?: string | null
          id?: string
          pts?: number | null
          pts_awarded?: number | null
          score_id?: string | null
          signal?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_score_id_fkey"
            columns: ["score_id"]
            isOneToOne: false
            referencedRelation: "scores"
            referencedColumns: ["id"]
          },
        ]
      }
      cohort_profiles: {
        Row: {
          created_at: string
          id: string
          industry: string
          niche: string | null
          score: number
          target: string
          tier: string
          top_gap: string | null
          top_signals: Json
          year_placed: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          industry: string
          niche?: string | null
          score: number
          target: string
          tier: string
          top_gap?: string | null
          top_signals?: Json
          year_placed?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          industry?: string
          niche?: string | null
          score?: number
          target?: string
          tier?: string
          top_gap?: string | null
          top_signals?: Json
          year_placed?: number | null
        }
        Relationships: []
      }
      cohort_stats: {
        Row: {
          histogram: Json
          id: string
          industry: string
          median: number | null
          niche: string | null
          p25: number | null
          p75: number | null
          p90: number | null
          sample_size: number
          target: string
          updated_at: string
        }
        Insert: {
          histogram?: Json
          id?: string
          industry: string
          median?: number | null
          niche?: string | null
          p25?: number | null
          p75?: number | null
          p90?: number | null
          sample_size?: number
          target: string
          updated_at?: string
        }
        Update: {
          histogram?: Json
          id?: string
          industry?: string
          median?: number | null
          niche?: string | null
          p25?: number | null
          p75?: number | null
          p90?: number | null
          sample_size?: number
          target?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          id: string
          payload: Json | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload?: Json | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cohort_visible: boolean
          created_at: string
          current_stage: string | null
          email: string | null
          employers: string[] | null
          id: string
          industry: string | null
          name: string | null
          niche: string | null
          onboarded: boolean
          resume_name: string | null
          resume_text: string | null
          target: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cohort_visible?: boolean
          created_at?: string
          current_stage?: string | null
          email?: string | null
          employers?: string[] | null
          id?: string
          industry?: string | null
          name?: string | null
          niche?: string | null
          onboarded?: boolean
          resume_name?: string | null
          resume_text?: string | null
          target?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cohort_visible?: boolean
          created_at?: string
          current_stage?: string | null
          email?: string | null
          employers?: string[] | null
          id?: string
          industry?: string | null
          name?: string | null
          niche?: string | null
          onboarded?: boolean
          resume_name?: string | null
          resume_text?: string | null
          target?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scores: {
        Row: {
          created_at: string
          gaps: Json | null
          gaps_count: number | null
          gaps_priority: string | null
          id: string
          input_hash: string | null
          percentile: string | null
          roadmap: Json | null
          score: number
          strengths: Json | null
          summary: string | null
          tier: string | null
          trend: number | null
          trend_label: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          gaps?: Json | null
          gaps_count?: number | null
          gaps_priority?: string | null
          id?: string
          input_hash?: string | null
          percentile?: string | null
          roadmap?: Json | null
          score: number
          strengths?: Json | null
          summary?: string | null
          tier?: string | null
          trend?: number | null
          trend_label?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          gaps?: Json | null
          gaps_count?: number | null
          gaps_priority?: string | null
          id?: string
          input_hash?: string | null
          percentile?: string | null
          roadmap?: Json | null
          score?: number
          strengths?: Json | null
          summary?: string | null
          tier?: string | null
          trend?: number | null
          trend_label?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stories_dismissed: {
        Row: {
          created_at: string
          id: string
          story_key: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          story_key: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          story_key?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      refresh_cohort_stats: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "coach" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "coach", "user"],
    },
  },
} as const
