import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getExchangeRates } from '../api/rates'

const DEFAULT_SELECTED_CODES = ['USD', 'EURO', 'HAS ALTIN', '24 AYAR 1 GRAM']

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

function getRateByMode(asset, valuationMode) {
  return valuationMode === 'buy' ? asset.buyRate : asset.sellRate
}

export const usePortfolioStore = defineStore(
  'portfolio',
  () => {
    const rates = ref([])
    const amounts = ref({})
    const selectedCodes = ref([])
    const valuationMode = ref('sell')
    const hasInitializedSelection = ref(false)
    const isLoading = ref(false)
    const errorMessage = ref('')
    const lastUpdated = ref('')
    const source = ref('idle')
    const isOffline = ref(typeof navigator !== 'undefined' ? !navigator.onLine : false)

    const allAssets = computed(() =>
      rates.value.map((rate) => {
        const amount = amounts.value[rate.code] ?? ''
        const numericAmount = parseAmount(amount)
        const activeRate = getRateByMode(rate, valuationMode.value)

        return {
          ...rate,
          activeRate,
          activeRateLabel: valuationMode.value === 'buy' ? 'Alış' : 'Satış',
          amount,
          numericAmount,
          totalValue: numericAmount * activeRate,
        }
      }),
    )

    const selectedAssetSet = computed(() => new Set(selectedCodes.value))

    const assets = computed(() =>
      allAssets.value.filter((asset) => selectedAssetSet.value.has(asset.code)),
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

      selectedCodes.value = selectedCodes.value.filter((code) => validCodes.has(code))
    }

    function initializeDefaultSelection(nextRates) {
      if (hasInitializedSelection.value || selectedCodes.value.length > 0) {
        return
      }

      const availableCodes = new Set(nextRates.map((item) => item.code))
      const nextSelectedCodes = DEFAULT_SELECTED_CODES.filter((code) => availableCodes.has(code))

      selectedCodes.value = nextSelectedCodes.length
        ? nextSelectedCodes
        : nextRates.slice(0, 4).map((item) => item.code)
      hasInitializedSelection.value = true
    }

    function setAmount(code, value) {
      amounts.value = {
        ...amounts.value,
        [code]: normalizeAmountInput(value),
      }
    }

    function toggleAssetSelection(code) {
      if (selectedCodes.value.includes(code)) {
        selectedCodes.value = selectedCodes.value.filter((item) => item !== code)
        hasInitializedSelection.value = true
        return
      }

      selectedCodes.value = [...selectedCodes.value, code]
      hasInitializedSelection.value = true
    }

    function setValuationMode(mode) {
      valuationMode.value = mode === 'buy' ? 'buy' : 'sell'
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
        initializeDefaultSelection(nextRates)
        lastUpdated.value = new Date().toISOString()
        source.value = 'network'
      } catch (error) {
        source.value = hasCachedRates.value ? 'cache' : 'idle'

        if (hasCachedRates.value) {
          errorMessage.value =
            'Canlı kur verisi şu an alınamadı. Son kaydedilen kurlar gösteriliyor.'
        } else {
          errorMessage.value =
            error instanceof Error ? error.message : 'Kur verisi alınırken bir hata oluştu.'
        }
      } finally {
        isLoading.value = false
      }
    }

    return {
      allAssets,
      assets,
      amounts,
      clearError,
      errorMessage,
      fetchRates,
      hasCachedRates,
      hasInitializedSelection,
      isLoading,
      isOffline,
      lastUpdated,
      rates,
      setAmount,
      setOfflineStatus,
      setValuationMode,
      source,
      selectedCodes,
      selectedAssetSet,
      totalValue,
      toggleAssetSelection,
      valuationMode,
    }
  },
  {
    persist: {
      key: 'doviz-pwa-store',
      pick: [
        'amounts',
        'hasInitializedSelection',
        'lastUpdated',
        'rates',
        'selectedCodes',
        'source',
        'valuationMode',
      ],
    },
  },
)
