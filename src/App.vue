<script setup>
import { RouterView } from 'vue-router';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
</script>

<template>
  <Toast />
  <ConfirmDialog />
  <RouterView />
</template>

<style>
* {
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

body {
  background-color: var(--p-surface-50);
  margin: 0;
}

html.p-dark body {
  background-color: var(--p-surface-950);
}
</style>