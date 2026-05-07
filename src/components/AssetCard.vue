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

const unitRate = computed(() => currencyFormatter.format(props.asset.rate))
const totalValue = computed(() => currencyFormatter.format(props.asset.totalValue))
const inputId = computed(() => `amount-${props.asset.code.toLowerCase()}`)
</script>

<template>
  <article class="panel-surface p-4 transition-transform duration-200 hover:-translate-y-0.5">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">Varlik</p>
        <h2 class="mt-2 text-xl font-semibold tracking-tight text-white">{{ asset.code }}</h2>
      </div>

      <div class="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-200">
        {{ unitRate }}
      </div>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <label class="block" :for="inputId">
        <span class="text-xs uppercase tracking-[0.2em] text-slate-500">Miktar</span>
        <input
          :id="inputId"
          :value="asset.amount"
          class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
          inputmode="decimal"
          placeholder="0.00"
          type="text"
          @input="$emit('update:amount', $event.target.value)"
        />
      </label>

      <div class="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.08] px-4 py-3 sm:min-w-[138px]">
        <p class="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Toplam</p>
        <p class="mt-2 text-lg font-semibold text-emerald-100">{{ totalValue }}</p>
      </div>
    </div>
  </article>
</template>
