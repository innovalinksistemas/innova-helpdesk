<script setup>

</script>

<template>
    <div class="">
        <h1 class="text-white pb-4 font-semibold text-4xl">Panel de Control</h1>
        <div class="flex flex-row space-x-4 text-center">
            <div class="w-48 h-24 p-3 rounded-2xl shadow-xl backdrop-blur-xl bg-white/10 border border-white/30 text-white flex items-center justify-between">
                <img src="/src/assets/ticket.png" alt="ticket" class="w-10 h-10 mx-auto">
                <div>
                    <p>Tickets Activos</p>
                    <p>124</p>
                </div> 
            </div>
            <div class="w-48 h-24 p-3 rounded-2xl shadow-xl backdrop-blur-xl bg-white/10 border border-white/30 text-white flex items-center justify-between">
                <img src="/src/assets/check.png" alt="ticket" class="w-7 h-7 mx-auto">
                <div>
                    <p>Tickets Resueltos</p>
                    <p>85</p>
                </div>
            </div>
            <div class="w-48 h-24 p-3 rounded-2xl shadow-xl backdrop-blur-xl bg-white/10 border border-white/30 text-white flex items-center justify-between">
                <img src="/src/assets/clock.png" alt="ticket" class="w-8 h-8 mx-auto">
                <div>
                    <p>Tiempo Promedio</p>
                    <p>1.4h</p>
                </div>
            </div>
            <div class="w-48 h-24 p-3 rounded-2xl shadow-xl backdrop-blur-xl bg-white/10 border border-white/30 text-white flex items-center justify-between"> 
                <img src="/src/assets/review.png" alt="ticket" class="w-10 h-10 mx-auto">
                <div>
                    <p>Satisfacción</p>
                    <p>80%</p>
                </div>
               
            </div>
            <div class="w-48 h-24 p-3 rounded-2xl shadow-xl backdrop-blur-xl bg-white/10 border border-white/30 text-white flex items-center justify-between">
                <img src="/src/assets/alarm.png" alt="ticket" class="w-9 h-8 mx-auto">
               <div>
                <p>Tickets Criticos</p>
                <p>4</p>
               </div>
            </div>
        </div>
    </div>
</template>