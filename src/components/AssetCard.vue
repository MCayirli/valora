<script setup>
import { computed } from 'vue'

const props = defineProps({
  asset: {
    type: Object,
    required: true,
  },
})

defineEmits(['update:amount'])

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
})

const unitRate = computed(() => currencyFormatter.format(props.asset.activeRate))
const totalValue = computed(() => currencyFormatter.format(props.asset.totalValue))
const inputId = computed(() => `amount-${props.asset.code.toLowerCase()}`)
const rateLabel = computed(() => props.asset.activeRateLabel)
</script>

<template>
  <article class="panel-surface p-3 transition-transform duration-200 hover:-translate-y-0.5">
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0">
        <h2 class="truncate text-sm font-semibold tracking-tight text-white">
          {{ asset.code }}
        </h2>
        <p class="truncate text-[11px] uppercase tracking-[0.18em] text-slate-500">
          {{ asset.shortCode }}
        </p>
      </div>

      <div class="shrink-0 rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-[11px] font-medium text-sky-200">
        {{ rateLabel }} {{ unitRate }}
      </div>
    </div>

    <div class="mt-2.5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
      <label class="block" :for="inputId">
        <input
          :id="inputId"
          :value="asset.amount"
          class="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
          inputmode="decimal"
          placeholder="Miktar"
          type="text"
          @input="$emit('update:amount', $event.target.value)"
        />
      </label>

      <div class="min-w-[116px] rounded-xl border border-emerald-400/15 bg-emerald-400/[0.08] px-3 py-2 text-right">
        <p class="text-sm font-semibold text-emerald-100">{{ totalValue }}</p>
      </div>
    </div>
  </article>
</template>
