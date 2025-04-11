<script setup>
import Panel from "./PanelControl.vue";
import Navbar from "./NavbarAdmin.vue";
import TicketsCharts from "./TicketsCharts.vue";
</script>

<template>
    <Navbar/>
    <div class="bg-blue-500 w-full h-screen">
        <div class="flex flex-col items-center justify-center pt-9">
            <Panel/>
        </div>
        <TicketsCharts/>
      
    </div>
</template>