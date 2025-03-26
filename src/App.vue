<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Navbar from '@/components/navbar.vue';
</script>

<template>
  <div>
    <Navbar />
    <RouterView class="container" />
  </div>
</template>

<style scoped>
.container {
  max-width: 1280px;
  margin: 0 auto;
}
</style>