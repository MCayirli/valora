<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import AssetCard from '../components/AssetCard.vue'
import AssetSelector from '../components/AssetSelector.vue'
import PortfolioSummary from '../components/PortfolioSummary.vue'
import StatusBanner from '../components/StatusBanner.vue'
import ValuationSwitch from '../components/ValuationSwitch.vue'
import { usePortfolioStore } from '../stores/portfolio'

const portfolioStore = usePortfolioStore()

const showOfflineNotice = computed(
  () => portfolioStore.isOffline && !portfolioStore.errorMessage && portfolioStore.hasCachedRates,
)

const emptyStateMessage = computed(() => {
  if (portfolioStore.isLoading) {
    return 'Kur verileri yükleniyor...'
  }

  if (portfolioStore.errorMessage) {
    return 'Veri alınamadığı için liste gösterilemiyor.'
  }

  return 'Portföyünü oluşturmak için yukarıdan varlık seç.'
})

function handleOnlineStatus() {
  portfolioStore.setOfflineStatus(!navigator.onLine)
}

async function refreshRates() {
  await portfolioStore.fetchRates()
}

onMounted(async () => {
  handleOnlineStatus()
  window.addEventListener('online', handleOnlineStatus)
  window.addEventListener('offline', handleOnlineStatus)

  await refreshRates()
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnlineStatus)
  window.removeEventListener('offline', handleOnlineStatus)
})
</script>

<template>
  <main class="relative min-h-screen overflow-hidden">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -top-12 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-sky-400/[0.12] blur-3xl"></div>
      <div class="absolute right-[-40px] top-40 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl"></div>
    </div>

    <section class="relative mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-4 py-5 sm:px-6 sm:py-6">
      <header class="flex items-center justify-between gap-3 px-1">
        <div>
          <p class="text-xs font-medium uppercase tracking-[0.36em] text-sky-200/70">Döviz PWA</p>
          <p class="mt-2 text-sm text-slate-400">Döviz ve altın varlıklarınızın TL karşılığını takip edin.</p>
        </div>

        <button
          class="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-400/40 hover:bg-sky-400/10 disabled:cursor-wait disabled:opacity-70"
          :disabled="portfolioStore.isLoading"
          type="button"
          @click="refreshRates"
        >
          {{ portfolioStore.isLoading ? 'Yenileniyor' : 'Yenile' }}
        </button>
      </header>

      <PortfolioSummary
        :asset-count="portfolioStore.assets.length"
        :is-loading="portfolioStore.isLoading"
        :is-offline="portfolioStore.isOffline"
        :last-updated="portfolioStore.lastUpdated"
        :source="portfolioStore.source"
        :total-value="portfolioStore.totalValue"
        :valuation-mode="portfolioStore.valuationMode"
      />

      <ValuationSwitch
        :model-value="portfolioStore.valuationMode"
        @update:model-value="portfolioStore.setValuationMode($event)"
      />

      <AssetSelector
        :assets="portfolioStore.allAssets"
        :selected-codes="portfolioStore.selectedCodes"
        @toggle="portfolioStore.toggleAssetSelection($event)"
      />

      <StatusBanner
        v-if="portfolioStore.errorMessage"
        message="Ağ veya servis kaynaklı bir sorun olabilir. Uygulama varsa son kaydedilen verileri kullanmaya devam eder."
        :title="portfolioStore.errorMessage"
        tone="error"
      />

      <StatusBanner
        v-else-if="showOfflineNotice"
        message="PWA kabuğu ve en son kaydedilen verilerle çalışmaya devam edebilirsiniz."
        title="Çevrimdışı mod aktif"
        tone="warning"
      />

      <section class="flex flex-col gap-3">
        <div
          class="flex items-center justify-between px-1 text-xs font-medium uppercase tracking-[0.24em] text-slate-500"
        >
          <span>Varlıklar</span>
          <span>{{ portfolioStore.assets.length }}</span>
        </div>

        <div v-if="portfolioStore.isLoading && !portfolioStore.assets.length" class="grid gap-3">
          <div
            v-for="skeleton in 4"
            :key="skeleton"
            class="panel-surface animate-pulse p-4"
          >
            <div class="h-4 w-16 rounded bg-white/10"></div>
            <div class="mt-4 h-7 w-24 rounded bg-white/10"></div>
            <div class="mt-6 h-12 rounded-2xl bg-white/10"></div>
          </div>
        </div>

        <div v-else-if="portfolioStore.assets.length" class="grid gap-3">
          <AssetCard
            v-for="asset in portfolioStore.assets"
            :key="asset.code"
            :asset="asset"
            @update:amount="portfolioStore.setAmount(asset.code, $event)"
          />
        </div>

        <div
          v-else
          class="panel-surface rounded-[28px] px-5 py-8 text-center text-sm leading-6 text-slate-400"
        >
          {{ emptyStateMessage }}
        </div>
      </section>
    </section>
  </main>
</template>
