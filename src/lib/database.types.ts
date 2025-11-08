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
      categories: {
        Row: {
          id: string
          name: string
          color: string
          icon: string | null
          budget_limit: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          icon?: string | null
          budget_limit?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          icon?: string | null
          budget_limit?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
      salary: {
        Row: {
          id: string
          user_id: string | null
          month: number
          year: number
          amount: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          month: number
          year: number
          amount: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          month?: number
          year?: number
          amount?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string | null
          date: string
          category_id: string
          amount: number
          description: string
          payment_method: string
          is_recurring: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          date?: string
          category_id: string
          amount: number
          description?: string
          payment_method?: string
          is_recurring?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          date?: string
          category_id?: string
          amount?: number
          description?: string
          payment_method?: string
          is_recurring?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type Salary = Database['public']['Tables']['salary']['Row'];
export type Expense = Database['public']['Tables']['expenses']['Row'];

export type ExpenseWithCategory = Expense & {
  category: Category;
};
