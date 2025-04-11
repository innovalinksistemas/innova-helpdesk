<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../supabase';

const usuario = JSON.parse(localStorage.getItem('usuario'));
const totalTickets = ref(0);
const ticketsResueltos = ref(0);
const rendimientoPorCategoria = ref([]);

const fetchRendimiento = async () => {
  // 1. Total tickets asignados
  const { data: todos, error: errorTodos } = await supabase
    .from('tickets')
    .select('*')
    .eq('tecnico_id', usuario.id);

  if (!errorTodos) {
    totalTickets.value = todos.length;
    ticketsResueltos.value = todos.filter(t => t.estado === 'resuelto' || t.estado === 'cerrado').length;
  }

  // 2. Tickets por categoría
  const { data: porCategoria, error: errorCat } = await supabase
    .from('tickets')
    .select('categoria, categorias_servicio(nombre)')
    .eq('tecnico_id', usuario.id);

  if (!errorCat && porCategoria) {
    const agrupado = {};
    porCategoria.forEach(ticket => {
      const nombre = ticket.categorias_servicio?.nombre || 'Sin categoría';
      agrupado[nombre] = (agrupado[nombre] || 0) + 1;
    });

    rendimientoPorCategoria.value = Object.entries(agrupado).map(([categoria, cantidad]) => ({
      categoria,
      cantidad,
    }));
  }
};

onMounted(fetchRendimiento);
</script>

<template>
  <div class="text-white space-y-6">
    <h2 class="text-2xl font-semibold">Mi Rendimiento</h2>

    <div>
      <div class="flex space-x-2 items-center mb-2">
        <p>Tickets Resueltos:</p>
        <p>{{ ticketsResueltos }}/{{ totalTickets }}</p>
      </div>

      <div class="w-full max-w-md">
        <div class="bg-gray-300 rounded-full h-4 overflow-hidden">
          <div
            class="bg-green-500 h-full transition-all duration-300"
            :style="{ width: (ticketsResueltos / totalTickets * 100 || 0) + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <div v-if="rendimientoPorCategoria.length">
      <h3 class="text-lg font-semibold mt-6">Por Categoría</h3>
      <ul class="mt-2 space-y-1">
        <li
          v-for="item in rendimientoPorCategoria"
          :key="item.categoria"
          class="bg-white/10 p-2 rounded-lg flex justify-between"
        >
          <span>{{ item.categoria }}</span>
          <span>{{ item.cantidad }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
