<script setup>
import Panel from "./PanelControl.vue";
import TicketsCharts from "./TicketsCharts.vue";
</script>

<template>
    <div class="bg-blue-500 w-full h-screen">
        <div class="flex flex-col items-center justify-center pt-9">
            <Panel/>
        </div>
        <TicketsCharts/>
      
    </div>
</template>