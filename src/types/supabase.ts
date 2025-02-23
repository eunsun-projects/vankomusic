export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          isAdmin: boolean | null
          nickname: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          id: string
          isAdmin?: boolean | null
          nickname?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          isAdmin?: boolean | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
