<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../../supabase.js';

const equipos = ref([])
const loading = ref(true)

onMounted(async () => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*, company_id(name)') // incluye nombre de la empresa

  if (!error) equipos.value = data
  loading.value = false
})

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString()
}
</script>


<!-- src/pages/EquiposEmpresa.vue -->
<template>
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">📋 Equipos Registrados</h1> 

  
      <div v-if="loading" class="text-gray-600">Cargando equipos...</div>
  
      <div v-else class="overflow-x-auto">
        <div class="flex justify-end mb-4">
        <router-link to="/registrar-equipo">
            <button class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-blue-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Agregar Equipo
            </button>
        </router-link>
        </div>
        <table class="min-w-full divide-y divide-gray-200 border rounded-xl shadow-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Nombre</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Tipo</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Empresa</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Estado</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Compra</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="equipo in equipos"
              :key="equipo.id"
              class="hover:bg-gray-50 transition duration-200"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ equipo.nombre }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ equipo.tipo }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ equipo.company_id?.name ?? '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-green-100 text-green-800': equipo.estado === 'activo',
                    'bg-yellow-100 text-yellow-800': equipo.estado === 'requiere_mantenimiento',
                    'bg-red-100 text-red-800': equipo.estado === 'obsoleto',
                    'bg-gray-100 text-gray-700': equipo.estado === 'en_reparacion'
                  }"
                >
                  {{ equipo.estado.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ formatearFecha(equipo.fecha_compra) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>