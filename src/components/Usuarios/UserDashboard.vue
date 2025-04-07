<script setup>
import NavBar from './NavbarDashboard.vue'
import TicketsCreados from './TicketsCreados.vue'
</script>

<template>
  <NavBar />
  <div class="p-16 bg-blue-300 h-screen">
    <div class="w-[34%] h-full space-y-5 flex flex-col">
      <TicketsCreados />
    </div>
  </div>
</template>
