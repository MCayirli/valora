<script setup>
import { computed } from 'vue'

const props = defineProps({
  assetCount: {
    type: Number,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isOffline: {
    type: Boolean,
    default: false,
  },
  lastUpdated: {
    type: String,
    default: '',
  },
  source: {
    type: String,
    default: 'idle',
  },
  totalValue: {
    type: Number,
    required: true,
  },
})

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

const compactCurrencyFormatter = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const formattedTotal = computed(() => currencyFormatter.format(props.totalValue))

const formattedLastUpdated = computed(() => {
  if (!props.lastUpdated) {
    return 'Henuz senkronize edilmedi'
  }

  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(props.lastUpdated))
})

const syncStatusLabel = computed(() => {
  if (props.isLoading) {
    return 'Kur verileri yenileniyor'
  }

  if (props.source === 'cache') {
    return 'Kayitli kurlar kullaniliyor'
  }

  if (props.isOffline) {
    return 'Cevrimdisi mod aktif'
  }

  return 'Canli kur akisi hazir'
})
</script>

<template>
  <section class="panel-surface panel-glow p-5 sm:p-6">
    <div class="relative flex flex-col gap-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-medium uppercase tracking-[0.32em] text-sky-200/70">
            Toplam Portfoy
          </p>
          <h1 class="mt-3 max-w-[12ch] text-4xl font-semibold tracking-tight text-white sm:text-[2.8rem]">
            {{ formattedTotal }}
          </h1>
        </div>
        <div
          class="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium tracking-wide text-emerald-200"
        >
          {{ assetCount }} varlik
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm text-slate-300">
        <div class="rounded-2xl border border-white/8 bg-slate-950/40 p-3">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Toplam TL</p>
          <p class="mt-2 text-base font-medium text-slate-100">
            {{ compactCurrencyFormatter.format(totalValue) }} TL
          </p>
        </div>

        <div class="rounded-2xl border border-white/8 bg-slate-950/40 p-3">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Veri Durumu</p>
          <p class="mt-2 text-base font-medium text-slate-100">{{ syncStatusLabel }}</p>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 text-xs text-slate-400">
        <span>Son guncelleme: {{ formattedLastUpdated }}</span>
        <span v-if="source === 'network'" class="text-emerald-300">Canli</span>
        <span v-else-if="source === 'cache'" class="text-amber-300">Cache</span>
      </div>
    </div>
  </section>
</template>
