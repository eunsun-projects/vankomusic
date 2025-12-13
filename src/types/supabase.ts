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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audios: {
        Row: {
          created_at: string
          id: string
          number: number | null
          title: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          number?: number | null
          title?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          number?: number | null
          title?: string | null
          url?: string | null
        }
        Relationships: []
      }
      stars: {
        Row: {
          color: string
          created_at: string
          id: string
          last_touched_at: string
          positions: number[]
          power: number
          sowon: string | null
          updated_at: string
          user_email: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          last_touched_at?: string
          positions: number[]
          power?: number
          sowon?: string | null
          updated_at?: string
          user_email: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          last_touched_at?: string
          positions?: number[]
          power?: number
          sowon?: string | null
          updated_at?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "Stars_user_email_fkey"
            columns: ["user_email"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["email"]
          },
        ]
      }
      timecapsules: {
        Row: {
          color: string
          created_at: string
          description: string
          id: string
          password: string
          position: number[]
          title: string
          updated_at: string
          user_email: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string
          id?: string
          password?: string
          position: number[]
          title?: string
          updated_at?: string
          user_email?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string
          id?: string
          password?: string
          position?: number[]
          title?: string
          updated_at?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "timecapsules_user_email_fkey"
            columns: ["user_email"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["email"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          id: string
          isAdmin: boolean
          isStarStart: boolean
          nickname: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          id: string
          isAdmin: boolean
          isStarStart?: boolean
          nickname?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          isAdmin?: boolean
          isStarStart?: boolean
          nickname?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          curated_number: number | null
          description: string | null
          embed: string | null
          id: string
          isPublic: boolean | null
          isSelected: boolean | null
          keywords: string[] | null
          number: number | null
          thumb: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          curated_number?: number | null
          description?: string | null
          embed?: string | null
          id?: string
          isPublic?: boolean | null
          isSelected?: boolean | null
          keywords?: string[] | null
          number?: number | null
          thumb?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          curated_number?: number | null
          description?: string | null
          embed?: string | null
          id?: string
          isPublic?: boolean | null
          isSelected?: boolean | null
          keywords?: string[] | null
          number?: number | null
          thumb?: string | null
          title?: string | null
        }
        Relationships: []
      }
      visits: {
        Row: {
          created_at: string
          id: string
          visits: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          visits?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          visits?: number | null
        }
        Relationships: []
      }
      wishs: {
        Row: {
          contents: string | null
          created_at: string
          id: string
        }
        Insert: {
          contents?: string | null
          created_at?: string
          id: string
        }
        Update: {
          contents?: string | null
          created_at?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
