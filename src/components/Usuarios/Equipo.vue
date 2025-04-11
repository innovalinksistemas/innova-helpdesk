<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../supabase.js';

const equipos = ref([]);
const usuario = JSON.parse(localStorage.getItem("usuario"));

const fetchEquipos = async () => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .eq('company_id', usuario.id); // Filtrar por la empresa logueada

  if (error) {
    console.error('Error al obtener equipos:', error);
  } else {
    equipos.value = data;
  }
};

onMounted(fetchEquipos);
</script>

<template>
  <div class="p-6 bg-white/10 text-white rounded-xl shadow-xl overflow-auto">
    <h2 class="text-2xl font-semibold mb-4">Equipos Registrados</h2>

    <div v-if="equipos.length === 0" class="text-white/70">
      No hay equipos registrados para tu empresa.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="equipo in equipos"
        :key="equipo.id"
        class="bg-white/20 p-4 rounded-lg shadow"
      >
        <h3 class="text-lg font-bold">{{ equipo.nombre }}</h3>
        <p><strong>Tipo:</strong> {{ equipo.tipo }}</p>
        <p><strong>Marca:</strong> {{ equipo.marca }}</p>
        <p><strong>Modelo:</strong> {{ equipo.modelo }}</p>
        <p><strong>Serie:</strong> {{ equipo.numero_serie }}</p>
        <p><strong>Ubicación:</strong> {{ equipo.ubicacion_actual }}</p>
        <p><strong>Sistema:</strong> {{ equipo.sistema }} v{{ equipo.version }}</p>
        <p><strong>Estado:</strong> {{ equipo.estado }}</p>
        <p class="text-sm text-white/60">Registrado el {{ new Date(equipo.created_at).toLocaleDateString() }}</p>
        <p v-if="equipo.notas" class="text-sm mt-1 italic">Notas: {{ equipo.notas }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
