import { supabase } from '../config/supabase'

export interface Receipt {
  id: string
  batch_id: string
  user_id: string
  provider: string
  reference_number: string
  amount: number
  sender: string
  raw_text: string
  delivery_status: string
  payment_status: string
  created_at: string
}

export class ReceiptsService {
  /**
   * Fetch all receipts for the current user (excluding soft-deleted)
   */
  static async fetchReceipts(): Promise<Receipt[]> {
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .is('deleted_at', 'null')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching receipts:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Failed to fetch receipts:', error)
      throw error
    }
  }

  /**
   * Fetch receipts with pagination, search, and sorting
   */
  static async fetchReceiptsWithFilters(
    page: number = 1,
    limit: number = 20,
    searchQuery?: string,
    sortBy?: string
  ): Promise<{ receipts: Receipt[]; total: number }> {
    try {
      const offset = (page - 1) * limit

      let query = supabase.from('receipts').select('*', { count: 'exact' }).is('deleted_at', 'null')

      // Apply search filter
      if (searchQuery) {
        query = query.or(`provider.ilike.%${searchQuery}%,reference_number.ilike.%${searchQuery}%`)
      }

      // Apply sorting
      switch (sortBy) {
        case 'date-desc':
          query = query.order('created_at', { ascending: false })
          break
        case 'date-asc':
          query = query.order('created_at', { ascending: true })
          break
        case 'amount-desc':
          query = query.order('amount', { ascending: false })
          break
        case 'amount-asc':
          query = query.order('amount', { ascending: true })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1)

      const { data: receipts, error: receiptsError, count } = await query

      if (receiptsError) {
        console.error('Error fetching receipts with filters:', receiptsError)
        throw receiptsError
      }

      return {
        receipts: receipts || [],
        total: count || 0
      }
    } catch (error) {
      console.error('Failed to fetch receipts with filters:', error)
      throw error
    }
  }

  /**
   * Fetch receipts with pagination (legacy method for backward compatibility)
   */
  static async fetchReceiptsPaginated(
    page: number = 1,
    limit: number = 20
  ): Promise<{ receipts: Receipt[]; total: number }> {
    try {
      const offset = (page - 1) * limit

      // Fetch receipts
      const { data: receipts, error: receiptsError } = await supabase
        .from('receipts')
        .select('*')
        .is('deleted_at', 'null')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (receiptsError) {
        console.error('Error fetching receipts:', receiptsError)
        throw receiptsError
      }

      // Get total count
      const { count, error: countError } = await supabase
        .from('receipts')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', 'null')

      if (countError) {
        console.error('Error counting receipts:', countError)
        throw countError
      }

      return {
        receipts: receipts || [],
        total: count || 0
      }
    } catch (error) {
      console.error('Failed to fetch receipts paginated:', error)
      throw error
    }
  }

  /**
   * Soft delete a receipt by ID
   */
  static async deleteReceipt(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('receipts')
        .update({
          deleted_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) {
        console.error('Error soft deleting receipt:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to soft delete receipt:', error)
      throw error
    }
  }

  /**
   * Search receipts by provider or reference number
   */
  static async searchReceipts(query: string): Promise<Receipt[]> {
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .or(`provider.ilike.%${query}%,reference_number.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching receipts:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Failed to search receipts:', error)
      throw error
    }
  }

  /**
   * Get receipts by date range
   */
  static async getReceiptsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Receipt[]> {
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching receipts by date range:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Failed to fetch receipts by date range:', error)
      throw error
    }
  }

  /**
   * Create a new receipt
   */
  static async createReceipt(receipt: Omit<Receipt, 'id' | 'created_at'>): Promise<Receipt> {
    try {
      const { data, error } = await supabase
        .from('receipts')
        .insert(receipt)
        .select()
        .single()

      if (error) {
        console.error('Error creating receipt:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Failed to create receipt:', error)
      throw error
    }
  }
}
