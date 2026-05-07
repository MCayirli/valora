<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    default: 'info',
  },
})

const toneClasses = computed(() => {
  if (props.tone === 'error') {
    return 'border-rose-400/25 bg-rose-400/10 text-rose-100'
  }

  if (props.tone === 'warning') {
    return 'border-amber-400/25 bg-amber-400/10 text-amber-100'
  }

  return 'border-sky-400/25 bg-sky-400/10 text-sky-100'
})
</script>

<template>
  <div :class="['rounded-2xl border p-4', toneClasses]">
    <p class="text-sm font-semibold">{{ title }}</p>
    <p class="mt-1 text-sm leading-6 opacity-90">{{ message }}</p>
  </div>
</template>
