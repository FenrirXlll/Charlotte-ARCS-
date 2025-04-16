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
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          image: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      charlotte_cart: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "charlotte_cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "charlotte_products"
            referencedColumns: ["id"]
          },
        ]
      }
      charlotte_favorites: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "charlotte_favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "charlotte_products"
            referencedColumns: ["id"]
          },
        ]
      }
      charlotte_order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "charlotte_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "charlotte_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charlotte_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "charlotte_products"
            referencedColumns: ["id"]
          },
        ]
      }
      charlotte_orders: {
        Row: {
          created_at: string | null
          id: string
          status: string
          total: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string
          total: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string
          total?: number
          user_id?: string | null
        }
        Relationships: []
      }
      charlotte_products: {
        Row: {
          category: string
          created_at: string | null
          description: string
          featured: boolean | null
          id: string
          image_url: string
          name: string
          price: number
          stock: number
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          featured?: boolean | null
          id?: string
          image_url: string
          name: string
          price: number
          stock?: number
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          featured?: boolean | null
          id?: string
          image_url?: string
          name?: string
          price?: number
          stock?: number
        }
        Relationships: []
      }
      charlotte_user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      comment_replies: {
        Row: {
          comment_id: string
          content: string
          created_at: string
          id: string
          product_id: string | null
          user_id: string
        }
        Insert: {
          comment_id: string
          content: string
          created_at?: string
          id?: string
          product_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string
          content?: string
          created_at?: string
          id?: string
          product_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_replies_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_replies_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          product_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          product_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          product_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          payment_method: string
          shipping_address: string
          status: string
          total: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          payment_method: string
          shipping_address: string
          status: string
          total: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          payment_method?: string
          shipping_address?: string
          status?: string
          total?: number
          user_id?: string | null
        }
        Relationships: []
      }
      product_details: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          specification_key: string
          specification_value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          specification_key: string
          specification_value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          specification_key?: string
          specification_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_details_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      Productos: {
        Row: {
          created_at: string
          created_des: string
          created_num: number
          id: number
        }
        Insert: {
          created_at?: string
          created_des: string
          created_num: number
          id?: number
        }
        Update: {
          created_at?: string
          created_des?: string
          created_num?: number
          id?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string
          discount_percentage: number | null
          id: string
          image: string
          inventory_count: number | null
          is_new: boolean | null
          name: string
          original_price: number | null
          price: number
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          discount_percentage?: number | null
          id?: string
          image: string
          inventory_count?: number | null
          is_new?: boolean | null
          name: string
          original_price?: number | null
          price: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          discount_percentage?: number | null
          id?: string
          image?: string
          inventory_count?: number | null
          is_new?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      Usuarios: {
        Row: {
          "24": string[] | null
          Contraseña: string[] | null
          Contraseña_sess: string[] | null
          "Correo electrónico": string[] | null
          Fecha_de_nac: string
          id: number
          Id_pass: string[] | null
          Lux_admi: string[] | null
          Name_de_usser: string | null
          Pass_id: string[] | null
        }
        Insert: {
          "24"?: string[] | null
          Contraseña?: string[] | null
          Contraseña_sess?: string[] | null
          "Correo electrónico"?: string[] | null
          Fecha_de_nac?: string
          id?: number
          Id_pass?: string[] | null
          Lux_admi?: string[] | null
          Name_de_usser?: string | null
          Pass_id?: string[] | null
        }
        Update: {
          "24"?: string[] | null
          Contraseña?: string[] | null
          Contraseña_sess?: string[] | null
          "Correo electrónico"?: string[] | null
          Fecha_de_nac?: string
          id?: number
          Id_pass?: string[] | null
          Lux_admi?: string[] | null
          Name_de_usser?: string | null
          Pass_id?: string[] | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          added_at: string | null
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
