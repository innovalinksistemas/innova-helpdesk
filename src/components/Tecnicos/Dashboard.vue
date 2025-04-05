<script setup>
import NavBar from './Navbar.vue'
import TicketsAsignados from './TicketsAsignados.vue'
import Rendimiento from './Rendimiento.vue'
</script>

<template>
    <NavBar/>
    <div class="p-16 bg-blue-300 h-screen ">
      <div class="w-[34%] h-full space-y-5 flex flex-col">
        <TicketsAsignados/> 
        <Rendimiento/>
      </div>
      
     
    </div>
</template>