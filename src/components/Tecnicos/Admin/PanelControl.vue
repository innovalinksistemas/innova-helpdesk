<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../../supabase.js';

const tickets = ref([]);
const activos = ref(0);
const resueltos = ref(0);
const criticos = ref(0);
const promedioHoras = ref(0);

const calcularPromedioHoras = (tickets) => {
  const tiempos = tickets
    .filter(t => t.fecha_resolucion)
    .map(t => {
      const inicio = new Date(t.fecha_creacion);
      const fin = new Date(t.fecha_resolucion);
      return (fin - inicio) / 1000 / 60 / 60; // horas
    });

  const total = tiempos.reduce((acc, curr) => acc + curr, 0);
  return tiempos.length ? (total / tiempos.length).toFixed(1) : 0;
};

onMounted(async () => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*');

  if (!error && data) {
    tickets.value = data;
    activos.value = data.filter(t => t.estado !== 'resuelto' && t.estado !== 'cerrado').length;
    resueltos.value = data.filter(t => t.estado === 'resuelto').length;
    criticos.value = data.filter(t => t.prioridad === 'alta').length;
    promedioHoras.value = calcularPromedioHoras(data);
  } else {
    console.error('Error al cargar tickets:', error);
  }
});
</script>

<template>
  <div class="">
    <h1 class="text-white pb-4 font-semibold text-4xl">Panel de Control</h1>
    <div class="flex flex-row space-x-4 text-center">
      <div class="w-48 h-24 p-3 rounded-2xl shadow-xl backdrop-blur-xl bg-white/10 border border-white/30 text-white flex items-center justify-between">
        <img src="/src/assets/ticket.png" alt="ticket" class="w-10 h-10 mx-auto">
        <div>
          <p>Tickets Activos</p>
          <p>{{ activos }}</p>
        </div> 
      </div>
      <div class="w-48 h-24 p-3 rounded-2xl shadow-xl backdrop-blur-xl bg-white/10 border border-white/30 text-white flex items-center justify-between">
        <img src="/src/assets/check.png" alt="ticket" class="w-7 h-7 mx-auto">
        <div>
          <p>Tickets Resueltos</p>
          <p>{{ resueltos }}</p>
        </div>
      </div>
      <div class="w-48 h-24 p-3 rounded-2xl shadow-xl backdrop-blur-xl bg-white/10 border border-white/30 text-white flex items-center justify-between">
        <img src="/src/assets/clock.png" alt="ticket" class="w-8 h-8 mx-auto">
        <div>
          <p>Tiempo Promedio</p>
          <p>{{ promedioHoras }}h</p>
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
          <p>Tickets Críticos</p>
          <p>{{ criticos }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
