import { ref, computed, onMounted } from 'vue'
import { CreditsService } from '../services/credits.service'
import { useAuth } from './useAuth'

export function useCredits() {
  const { user } = useAuth()
  const credits = ref<number>(0)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchCredits = async () => {
    if (!user.value) return

    loading.value = true
    error.value = null

    try {
      const userCredits = await CreditsService.getUserCredits(user.value.id)
      credits.value = userCredits
    } catch (err) {
      error.value = 'Failed to fetch credits'
      console.error('Error in useCredits fetchCredits:', err)
    } finally {
      loading.value = false
    }
  }

  const deductCredits = async (amount: number): Promise<boolean> => {
    if (!user.value) return false

    loading.value = true
    error.value = null

    try {
      const success = await CreditsService.deductCredits(user.value.id, amount)
      
      if (success) {
        // Update local credits
        credits.value -= amount
      } else {
        error.value = 'Failed to deduct credits'
      }

      return success
    } catch (err) {
      error.value = 'Failed to deduct credits'
      console.error('Error in useCredits deductCredits:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const addCredits = async (amount: number): Promise<boolean> => {
    if (!user.value) return false

    loading.value = true
    error.value = null

    try {
      const success = await CreditsService.addCredits(user.value.id, amount)
      
      if (success) {
        // Update local credits
        credits.value += amount
      } else {
        error.value = 'Failed to add credits'
      }

      return success
    } catch (err) {
      error.value = 'Failed to add credits'
      console.error('Error in useCredits addCredits:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const hasEnoughCredits = (amount: number): boolean => {
    return credits.value >= amount
  }

  // Auto-fetch credits when user changes
  onMounted(() => {
    fetchCredits()
  })

  return {
    credits: computed(() => credits.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchCredits,
    deductCredits,
    addCredits,
    hasEnoughCredits
  }
}
