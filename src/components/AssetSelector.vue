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

const isOpen = ref(false)
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

const toggleLabel = computed(() => (isOpen.value ? 'Kapat' : 'Seç'))
</script>

<template>
  <section class="panel-surface p-3">
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0">
        <p class="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
          Varlık Seçimi
        </p>
        <p class="mt-1 text-xs text-slate-400">
          {{ selectedCodes.length }} seçili
        </p>
      </div>

      <button
        class="shrink-0 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-sky-400/40 hover:bg-sky-400/10"
        type="button"
        @click="isOpen = !isOpen"
      >
        {{ toggleLabel }}
      </button>
    </div>

    <div v-if="selectedAssets.length" class="mt-3 flex flex-wrap gap-1.5">
      <button
        v-for="asset in selectedAssets"
        :key="asset.code"
        class="rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-1 text-[11px] font-medium text-sky-100 transition hover:border-sky-300/50"
        type="button"
        @click="$emit('toggle', asset.code)"
      >
        {{ asset.shortCode }}
      </button>
    </div>

    <div v-if="isOpen" class="mt-3 space-y-2.5">
      <input
        v-model="query"
        class="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
        placeholder="USD, altın, EUR..."
        type="text"
      />

      <div class="grid max-h-56 gap-1.5 overflow-y-auto pr-1">
        <button
          v-for="asset in filteredAssets"
          :key="asset.code"
          :class="[
            'flex items-center justify-between rounded-xl border px-3 py-2 text-left transition',
            selectedCodeSet.has(asset.code)
              ? 'border-sky-400/35 bg-sky-400/10 text-white'
              : 'border-white/10 bg-slate-950/45 text-slate-300 hover:border-white/20',
          ]"
          type="button"
          @click="$emit('toggle', asset.code)"
        >
          <div class="min-w-0">
            <p class="truncate text-sm font-medium">{{ asset.code }}</p>
            <p class="truncate text-[11px] uppercase tracking-[0.18em] text-slate-500">
              {{ asset.shortCode }}
            </p>
          </div>

          <span
            :class="[
              'ml-3 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em]',
              selectedCodeSet.has(asset.code)
                ? 'bg-sky-200 text-slate-950'
                : 'bg-white/8 text-slate-400',
            ]"
          >
            {{ selectedCodeSet.has(asset.code) ? 'Seçili' : 'Ekle' }}
          </span>
        </button>
      </div>
    </div>
  </section>
</template>
