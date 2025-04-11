<script setup>
import NavBar from './NavbarDashboard.vue'
import TicketsCreados from './TicketsCreados.vue'
import Equipo from './Equipo.vue';
</script>

<template>
  <NavBar />
  <div class="p-16 bg-blue-300 h-screen gap-4 grid grid-cols-2">
    <div class=" h-full space-y-5 flex flex-col overflow-auto">
      <TicketsCreados />
    </div>
    <div>
      <Equipo />
    </div>
  </div>
</template>
