import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getExchangeRates } from '../api/rates'

function normalizeAmountInput(value) {
  const cleaned = String(value ?? '')
    .replace(/,/g, '.')
    .replace(/[^\d.]/g, '')

  const firstDotIndex = cleaned.indexOf('.')

  if (firstDotIndex === -1) {
    return cleaned.replace(/^0+(?=\d)/, '0')
  }

  const integerPart = cleaned.slice(0, firstDotIndex).replace(/^0+(?=\d)/, '0')
  const decimalPart = cleaned.slice(firstDotIndex + 1).replace(/\./g, '')

  return `${integerPart || '0'}.${decimalPart}`
}

function parseAmount(value) {
  const parsed = Number.parseFloat(String(value ?? '').replace(/,/g, '.'))
  return Number.isFinite(parsed) ? parsed : 0
}

export const usePortfolioStore = defineStore(
  'portfolio',
  () => {
    const rates = ref([])
    const amounts = ref({})
    const isLoading = ref(false)
    const errorMessage = ref('')
    const lastUpdated = ref('')
    const source = ref('idle')
    const isOffline = ref(typeof navigator !== 'undefined' ? !navigator.onLine : false)

    const assets = computed(() =>
      rates.value.map((rate) => {
        const amount = amounts.value[rate.code] ?? ''
        const numericAmount = parseAmount(amount)

        return {
          ...rate,
          amount,
          numericAmount,
          totalValue: numericAmount * rate.rate,
        }
      }),
    )

    const totalValue = computed(() =>
      assets.value.reduce((sum, asset) => sum + asset.totalValue, 0),
    )

    const hasCachedRates = computed(() => rates.value.length > 0)

    function syncKnownAssets(nextRates) {
      const validCodes = new Set(nextRates.map((item) => item.code))

      amounts.value = Object.fromEntries(
        Object.entries(amounts.value).filter(([code, value]) => {
          return validCodes.has(code) || parseAmount(value) > 0
        }),
      )
    }

    function setAmount(code, value) {
      amounts.value = {
        ...amounts.value,
        [code]: normalizeAmountInput(value),
      }
    }

    function setOfflineStatus(status) {
      isOffline.value = status
    }

    function clearError() {
      errorMessage.value = ''
    }

    async function fetchRates() {
      isLoading.value = true
      errorMessage.value = ''

      try {
        const nextRates = await getExchangeRates()
        rates.value = nextRates
        syncKnownAssets(nextRates)
        lastUpdated.value = new Date().toISOString()
        source.value = 'network'
      } catch (error) {
        source.value = hasCachedRates.value ? 'cache' : 'idle'

        if (hasCachedRates.value) {
          errorMessage.value =
            'Canli kur verisi su an alinamadi. Son kaydedilen kurlar gosteriliyor.'
        } else {
          errorMessage.value =
            error instanceof Error ? error.message : 'Kur verisi alinirken bir hata olustu.'
        }
      } finally {
        isLoading.value = false
      }
    }

    return {
      assets,
      amounts,
      clearError,
      errorMessage,
      fetchRates,
      hasCachedRates,
      isLoading,
      isOffline,
      lastUpdated,
      rates,
      setAmount,
      setOfflineStatus,
      source,
      totalValue,
    }
  },
  {
    persist: {
      key: 'doviz-pwa-store',
      pick: ['amounts', 'lastUpdated', 'rates', 'source'],
    },
  },
)
