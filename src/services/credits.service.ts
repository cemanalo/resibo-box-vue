import { supabase } from '../config/supabase'

export interface UserProfile {
  id: string
  email: string
  current_credit_balance: number
  created_at: string
}

export class CreditsService {
  static async getUserCredits(userId: string): Promise<number> {
    console.log('getting user credits', userId)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('current_credit_balance')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user credits:', error)
        return 0
      }

      return data?.current_credit_balance || 0
    } catch (error) {
      console.error('Unexpected error fetching user credits:', error)
      return 0
    }
  }

  static async updateUserCredits(userId: string, newBalance: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ current_credit_balance: newBalance })
        .eq('id', userId)

      if (error) {
        console.error('Error updating user credits:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Unexpected error updating user credits:', error)
      return false
    }
  }

  static async deductCredits(userId: string, amount: number): Promise<boolean> {
    try {
      // First get current balance
      const currentBalance = await this.getUserCredits(userId)
      
      if (currentBalance < amount) {
        console.error('Insufficient credits')
        return false
      }

      // Update with new balance
      const newBalance = currentBalance - amount
      return await this.updateUserCredits(userId, newBalance)
    } catch (error) {
      console.error('Error deducting credits:', error)
      return false
    }
  }

  static async addCredits(userId: string, amount: number): Promise<boolean> {
    try {
      // First get current balance
      const currentBalance = await this.getUserCredits(userId)
      
      // Update with new balance
      const newBalance = currentBalance + amount
      return await this.updateUserCredits(userId, newBalance)
    } catch (error) {
      console.error('Error adding credits:', error)
      return false
    }
  }
}
