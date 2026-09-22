export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          logo_url: string | null;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          logo_url?: string | null;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          logo_url?: string | null;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          is_active: boolean;
          name: string;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name: string;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name?: string;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          alt_text: string | null;
          created_at: string;
          id: string;
          image_url: string;
          product_id: string;
          sort_order: number;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          id?: string;
          image_url: string;
          product_id: string;
          sort_order?: number;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string;
          product_id?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_internal: {
        Row: {
          created_at: string;
          distributor_unit_price: number | null;
          product_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          distributor_unit_price?: number | null;
          product_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          distributor_unit_price?: number | null;
          product_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_internal_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: true;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          box_price: number | null;
          brand_id: string;
          category_id: string;
          color: string | null;
          consumer_price: number | null;
          cost: number | null;
          created_at: string;
          description: string | null;
          detail_points: string[];
          featured: boolean;
          id: string;
          is_active: boolean;
          is_available: boolean;
          is_new: boolean;
          main_image_url: string | null;
          model: string | null;
          name: string;
          price: number | null;
          price_3_plus: number | null;
          price_6_plus: number | null;
          sale_price: number | null;
          short_description: string | null;
          sku: string | null;
          slug: string;
          specifications: Json;
          stock: number | null;
          updated_at: string;
        };
        Insert: {
          box_price?: number | null;
          brand_id: string;
          category_id: string;
          color?: string | null;
          consumer_price?: number | null;
          cost?: number | null;
          created_at?: string;
          description?: string | null;
          detail_points?: string[];
          featured?: boolean;
          id?: string;
          is_active?: boolean;
          is_available?: boolean;
          is_new?: boolean;
          main_image_url?: string | null;
          model?: string | null;
          name: string;
          price?: number | null;
          price_3_plus?: number | null;
          price_6_plus?: number | null;
          sale_price?: number | null;
          short_description?: string | null;
          sku?: string | null;
          slug: string;
          specifications?: Json;
          stock?: number | null;
          updated_at?: string;
        };
        Update: {
          box_price?: number | null;
          brand_id?: string;
          category_id?: string;
          color?: string | null;
          consumer_price?: number | null;
          cost?: number | null;
          created_at?: string;
          description?: string | null;
          detail_points?: string[];
          featured?: boolean;
          id?: string;
          is_active?: boolean;
          is_available?: boolean;
          is_new?: boolean;
          main_image_url?: string | null;
          model?: string | null;
          name?: string;
          price?: number | null;
          price_3_plus?: number | null;
          price_6_plus?: number | null;
          sale_price?: number | null;
          short_description?: string | null;
          sku?: string | null;
          slug?: string;
          specifications?: Json;
          stock?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      site_settings: {
        Row: {
          id: number;
          updated_at: string;
          whatsapp_number: string | null;
          whatsapp_product_message: string;
        };
        Insert: {
          id?: number;
          updated_at?: string;
          whatsapp_number?: string | null;
          whatsapp_product_message?: string;
        };
        Update: {
          id?: number;
          updated_at?: string;
          whatsapp_number?: string | null;
          whatsapp_product_message?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
