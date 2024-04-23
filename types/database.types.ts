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
      balances: {
        Row: {
          balance: number
          created_at: string
          current_year: string | null
          department_id: number | null
          id: string
          last_modified: string
          previous_balance: number | null
          previous_year: string | null
        }
        Insert: {
          balance: number
          created_at?: string
          current_year?: string | null
          department_id?: number | null
          id?: string
          last_modified?: string
          previous_balance?: number | null
          previous_year?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          current_year?: string | null
          department_id?: number | null
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
          },
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
          id: number
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
          balance: number | null
          created_at: string
          id: number
          is_active: boolean | null
          last_modified: string
          name: string | null
        }
        Insert: {
          account_type?: string | null
          balance?: number | null
          created_at?: string
          id: number
          is_active?: boolean | null
          last_modified?: string
          name?: string | null
        }
        Update: {
          account_type?: string | null
          balance?: number | null
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
          is_closed: boolean
          last_modified: string
          notes: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          deposit_date: string
          deposit_type?: Database["public"]["Enums"]["DepositType"]
          id?: string
          is_closed?: boolean
          last_modified?: string
          notes?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          deposit_date?: string
          deposit_type?: Database["public"]["Enums"]["DepositType"]
          id?: string
          is_closed?: boolean
          last_modified?: string
          notes?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          average_tithe: number | null
          created_at: string
          display_name: string | null
          full_name: string | null
          highest_tithe: number | null
          id: string
          is_active: boolean
          last_modified: string
          lowest_tithe: number | null
          total_tithe: number | null
          total_yearly_tithe: number | null
          user_id: string | null
        }
        Insert: {
          average_tithe?: number | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          highest_tithe?: number | null
          id?: string
          is_active?: boolean
          last_modified?: string
          lowest_tithe?: number | null
          total_tithe?: number | null
          total_yearly_tithe?: number | null
          user_id?: string | null
        }
        Update: {
          average_tithe?: number | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          highest_tithe?: number | null
          id?: string
          is_active?: boolean
          last_modified?: string
          lowest_tithe?: number | null
          total_tithe?: number | null
          total_yearly_tithe?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          id: number
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
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email_address: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["Role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          email_address?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["Role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          email_address?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["Role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
          user_id: string | null
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
          id?: string
          income_expense?: Database["public"]["Enums"]["IncomeExpense"]
          last_modified?: string
          member_id?: string | null
          payment_type?: Database["public"]["Enums"]["PaymentType"]
          status?: Database["public"]["Enums"]["Status"] | null
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
            referencedRelation: "deposit_amount_view"
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
          },
        ]
      }
    }
    Views: {
      deposit_amount_view: {
        Row: {
          deposit_amount: number | null
          deposit_date: string | null
          deposit_type: Database["public"]["Enums"]["DepositType"] | null
          id: string | null
          is_equal: string | null
          records_amount: number | null
        }
        Insert: {
          deposit_amount?: never
          deposit_date?: string | null
          deposit_type?: Database["public"]["Enums"]["DepositType"] | null
          id?: string | null
          is_equal?: never
          records_amount?: never
        }
        Update: {
          deposit_amount?: never
          deposit_date?: string | null
          deposit_type?: Database["public"]["Enums"]["DepositType"] | null
          id?: string | null
          is_equal?: never
          records_amount?: never
        }
        Relationships: []
      }
      googlesheetview: {
        Row: {
          amount: number | null
          category_name: string | null
          date: string | null
          department_name: string | null
          deposit_date: string | null
          deposit_id: string | null
          description_notes: string | null
          entrada_salida: string | null
          id: string | null
          member_name: string | null
          payment_type: string | null
          status: Database["public"]["Enums"]["Status"] | null
          timestamp: string | null
        }
        Relationships: [
          {
            foreignKeyName: "records_deposit_id_fkey"
            columns: ["deposit_id"]
            isOneToOne: false
            referencedRelation: "deposits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_deposit_id_fkey"
            columns: ["deposit_id"]
            isOneToOne: false
            referencedRelation: "deposit_amount_view"
            referencedColumns: ["id"]
          },
        ]
      }
      records_view: {
        Row: {
          amount: number | null
          category_id: number | null
          category_name: string | null
          created_at: string | null
          date: string | null
          department_id: number | null
          department_name: string | null
          deposit_amount: number | null
          deposit_date: string | null
          deposit_id: string | null
          description_notes: string | null
          id: string | null
          income_expense: Database["public"]["Enums"]["IncomeExpense"] | null
          last_modified: string | null
          member_id: string | null
          member_name: string | null
          payment_type: Database["public"]["Enums"]["PaymentType"] | null
          recorded_by: string | null
          status: Database["public"]["Enums"]["Status"] | null
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
            foreignKeyName: "records_deposit_id_fkey"
            columns: ["deposit_id"]
            isOneToOne: false
            referencedRelation: "deposit_amount_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "records_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_dept_records: {
        Args: {
          dept_id: number
        }
        Returns: {
          id: string
          created_at: string
          last_modified: string
          amount: number
          member_id: string
          date: string
          department_id: number
          category_id: number
          income_expense: Database["public"]["Enums"]["IncomeExpense"]
          payment_type: Database["public"]["Enums"]["PaymentType"]
          description_notes: string
          status: Database["public"]["Enums"]["Status"]
          deposit_date: string
          deposit_id: string
          department_name: string
          member_name: string
          category_name: string
          deposit_amount: number
          recorded_by: string
        }[]
      }
      get_member_diezmos: {
        Args: {
          member_id: string
        }
        Returns: {
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
          user_id: string | null
        }[]
      }
      get_stats_amount: {
        Args: {
          member_id: string
        }
        Returns: {
          max_amount: number
          min_amount: number
          avg_amount: number
        }[]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_member_stats: {
        Args: {
          member_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      DepositType: "bank" | "venmo"
      IncomeExpense: "income" | "expense"
      Language: "english" | "spanish"
      PaymentType: "cash" | "check" | "debitCard" | "venmo"
      Role: "admin" | "read_only" | "editor"
      Status: "deposited" | "recorded"
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
