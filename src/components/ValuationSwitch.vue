<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

defineEmits(['update:modelValue'])

const options = [
  { label: 'Alis Kur', value: 'buy' },
  { label: 'Satis Kur', value: 'sell' },
]
</script>

<template>
  <section class="panel-surface p-3">
    <div class="flex items-center justify-between gap-3 rounded-2xl bg-slate-950/60 p-1">
      <button
        v-for="option in options"
        :key="option.value"
        :class="[
          'flex-1 rounded-xl px-4 py-3 text-sm font-medium transition',
          modelValue === option.value
            ? 'bg-sky-400 text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.3)]'
            : 'text-slate-300 hover:bg-white/6',
        ]"
        type="button"
        @click="$emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </section>
</template>
