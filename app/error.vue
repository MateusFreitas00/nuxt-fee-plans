<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <h1 class="text-9xl font-bold text-gray-400 mb-4">404</h1>
      <p class="text-3xl font-semibold text-gray-900 mb-2">Página não encontrada</p>
      <p class="text-lg text-gray-600">Desculpe, a página que você está procurando não existe.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Página não encontrada',
})
</script>