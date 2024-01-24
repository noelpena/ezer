export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      balances: {
        Row: {
          balance: number
          created_at: string
          current_year: string | null
          department_id: number
          id: string
          last_modified: string
          previous_balance: number | null
          previous_year: string | null
        }
        Insert: {
          balance: number
          created_at?: string
          current_year?: string | null
          department_id: number
          id: string
          last_modified?: string
          previous_balance?: number | null
          previous_year?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          current_year?: string | null
          department_id?: number
          id?: string
          last_modified?: string
          previous_balance?: number | null
          previous_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "balances_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: number
          is_active: boolean | null
          last_modified: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          last_modified?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          last_modified?: string
          name?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          account_type: string | null
          created_at: string
          id: number
          is_active: boolean | null
          last_modified: string
          name: string | null
        }
        Insert: {
          account_type?: string | null
          created_at?: string
          id?: number
          is_active?: boolean | null
          last_modified?: string
          name?: string | null
        }
        Update: {
          account_type?: string | null
          created_at?: string
          id?: number
          is_active?: boolean | null
          last_modified?: string
          name?: string | null
        }
        Relationships: []
      }
      deposits: {
        Row: {
          amount: number
          created_at: string
          deposit_date: string
          deposit_type: Database["public"]["Enums"]["DepositType"]
          id: string
          last_modified: string
          notes: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          deposit_date: string
          deposit_type?: Database["public"]["Enums"]["DepositType"]
          id: string
          last_modified?: string
          notes?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          deposit_date?: string
          deposit_type?: Database["public"]["Enums"]["DepositType"]
          id?: string
          last_modified?: string
          notes?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          average_tithe: number | null
          created_at: string
          full_name: string | null
          highest_tithe: number | null
          id: string
          is_active: boolean | null
          last_modified: string
          lowest_tithe: number | null
          total_tithe: number | null
          total_yearly_tithe: number | null
        }
        Insert: {
          average_tithe?: number | null
          created_at?: string
          full_name?: string | null
          highest_tithe?: number | null
          id?: string
          is_active?: boolean | null
          last_modified?: string
          lowest_tithe?: number | null
          total_tithe?: number | null
          total_yearly_tithe?: number | null
        }
        Update: {
          average_tithe?: number | null
          created_at?: string
          full_name?: string | null
          highest_tithe?: number | null
          id?: string
          is_active?: boolean | null
          last_modified?: string
          lowest_tithe?: number | null
          total_tithe?: number | null
          total_yearly_tithe?: number | null
        }
        Relationships: []
      }
      preferences: {
        Row: {
          created_at: string
          id: number
          language: Database["public"]["Enums"]["Language"]
          last_modified: string
          quick_links: Json | null
          theme: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          language?: Database["public"]["Enums"]["Language"]
          last_modified?: string
          quick_links?: Json | null
          theme?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          language?: Database["public"]["Enums"]["Language"]
          last_modified?: string
          quick_links?: Json | null
          theme?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      records: {
        Row: {
          amount: number
          category_id: number | null
          created_at: string
          date: string
          department_id: number | null
          deposit_date: string | null
          deposit_id: string | null
          description_notes: string | null
          id: string
          income_expense: Database["public"]["Enums"]["IncomeExpense"]
          last_modified: string
          member_id: string | null
          payment_type: Database["public"]["Enums"]["PaymentType"]
          status: Database["public"]["Enums"]["Status"] | null
        }
        Insert: {
          amount: number
          category_id?: number | null
          created_at?: string
          date: string
          department_id?: number | null
          deposit_date?: string | null
          deposit_id?: string | null
          description_notes?: string | null
          id: string
          income_expense?: Database["public"]["Enums"]["IncomeExpense"]
          last_modified?: string
          member_id?: string | null
          payment_type?: Database["public"]["Enums"]["PaymentType"]
          status?: Database["public"]["Enums"]["Status"] | null
        }
        Update: {
          amount?: number
          category_id?: number | null
          created_at?: string
          date?: string
          department_id?: number | null
          deposit_date?: string | null
          deposit_id?: string | null
          description_notes?: string | null
          id?: string
          income_expense?: Database["public"]["Enums"]["IncomeExpense"]
          last_modified?: string
          member_id?: string | null
          payment_type?: Database["public"]["Enums"]["PaymentType"]
          status?: Database["public"]["Enums"]["Status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "records_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_deposit_id_fkey"
            columns: ["deposit_id"]
            isOneToOne: false
            referencedRelation: "deposits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          last_modified: string
          name: string
          profile_image: string | null
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          last_modified?: string
          name: string
          profile_image?: string | null
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_modified?: string
          name?: string
          profile_image?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      googlesheetview: {
        Row: {
          amount: number | null
          category_name: string | null
          date: string | null
          department_name: string | null
          description_notes: string | null
          entrada_salida: string | null
          id: string | null
          member_name: string | null
          payment_type: string | null
          status: Database["public"]["Enums"]["Status"] | null
          timestamp: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      DepositType: "bank" | "venmo"
      IncomeExpense: "income" | "expense"
      Language: "english" | "spanish"
      PaymentType: "cash" | "check" | "debitCard" | "venmo"
      Status: "deposited" | "recorded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
