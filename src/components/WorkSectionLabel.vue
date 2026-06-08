<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <p class="work-section-label">{{ label }}</p>
</template>
