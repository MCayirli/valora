<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  assets: {
    type: Array,
    required: true,
  },
  selectedCodes: {
    type: Array,
    required: true,
  },
})

defineEmits(['toggle'])

const query = ref('')

const normalizedQuery = computed(() => query.value.trim().toLowerCase())
const selectedCodeSet = computed(() => new Set(props.selectedCodes))

const selectedAssets = computed(() =>
  props.assets.filter((asset) => selectedCodeSet.value.has(asset.code)),
)

const filteredAssets = computed(() => {
  if (!normalizedQuery.value) {
    return props.assets
  }

  return props.assets.filter((asset) => {
    return (
      asset.code.toLowerCase().includes(normalizedQuery.value) ||
      asset.shortCode.toLowerCase().includes(normalizedQuery.value)
    )
  })
})
</script>

<template>
  <section class="panel-surface p-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
          Varlık Seçimi
        </p>
        <p class="mt-2 text-sm text-slate-300">
          Yalnızca seçtiğin varlıklar portföy listesinde gösterilir.
        </p>
      </div>
      <div class="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-xs text-slate-300">
        {{ selectedCodes.length }} seçili
      </div>
    </div>

    <div v-if="selectedAssets.length" class="mt-4 flex flex-wrap gap-2">
      <button
        v-for="asset in selectedAssets"
        :key="asset.code"
        class="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs font-medium text-sky-100 transition hover:border-sky-300/50"
        type="button"
        @click="$emit('toggle', asset.code)"
      >
        {{ asset.shortCode }}
      </button>
    </div>

    <label class="mt-4 block">
      <span class="text-xs uppercase tracking-[0.2em] text-slate-500">Ara</span>
      <input
        v-model="query"
        class="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base text-white outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
        placeholder="USD, altın, EUR..."
        type="text"
      />
    </label>

    <div class="mt-4 grid max-h-72 gap-2 overflow-y-auto pr-1">
      <button
        v-for="asset in filteredAssets"
        :key="asset.code"
        :class="[
          'flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition',
          selectedCodeSet.has(asset.code)
            ? 'border-sky-400/35 bg-sky-400/10 text-white'
            : 'border-white/10 bg-slate-950/45 text-slate-300 hover:border-white/20',
        ]"
        type="button"
        @click="$emit('toggle', asset.code)"
      >
        <div>
          <p class="text-sm font-medium">{{ asset.code }}</p>
          <p class="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
            {{ asset.shortCode }}
          </p>
        </div>
        <span
          :class="[
            'rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em]',
            selectedCodeSet.has(asset.code)
              ? 'bg-sky-200 text-slate-950'
              : 'bg-white/8 text-slate-400',
          ]"
        >
          {{ selectedCodeSet.has(asset.code) ? 'Seçili' : 'Ekle' }}
        </span>
      </button>
    </div>
  </section>
</template>
