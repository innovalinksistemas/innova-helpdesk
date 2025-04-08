<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../../supabase.js';

const equipos = ref([])
const empresas = ref([])
const loading = ref(true)
const mostrarModal = ref(false)
const user = ref(null)

const nuevoEquipo = ref({
  nombre: '',
  tipo: '',
  marca: '',
  modelo: '',
  numero_serie: '',
  fecha_compra: '',
  ubicacion_actual: '',
  notas: '',
  company_id: '',
})



const cargarEmpresas = async () => {
  const { data, error } = await supabase.from('empresas').select('*')
  if (!error) empresas.value = data
}

const cargarEquipos = async () => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*, company_id(name)')
    .order('fecha_compra', { ascending: false })

  if (!error) equipos.value = data
}

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data.user

  cargarEmpresas()
  cargarEquipos()
})



const registrarEquipo = async () => {
  if (!user.value) return // seguridad: que no se registre si no hay usuario

  const { error } = await supabase.from('equipment').insert([
    {
      ...nuevoEquipo.value,
      created_by: user.value.id,
      estado: 'activo',
    },
  ])

  if (!error) {
    mostrarModal.value = false
    nuevoEquipo.value = {
      nombre: '',
      tipo: '',
      marca: '',
      modelo: '',
      numero_serie: '',
      fecha_compra: '',
      ubicacion_actual: '',
      notas: '',
      company_id: '',
    }
    await cargarEquipos()
  }
}


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
        <button
            @click="mostrarModal = true"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-blue-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Agregar Equipo
        </button>
        </div>

<!-- Modal -->
        <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
            <h2 class="text-xl font-bold mb-4">Nuevo Equipo</h2>

            <form @submit.prevent="registrarEquipo" class="grid gap-3">
            <input v-model="nuevoEquipo.nombre" placeholder="Nombre" class="input" />
            <input v-model="nuevoEquipo.tipo" placeholder="Tipo" class="input" />
            <input v-model="nuevoEquipo.marca" placeholder="Marca" class="input" />
            <input v-model="nuevoEquipo.modelo" placeholder="Modelo" class="input" />
            <input v-model="nuevoEquipo.numero_serie" placeholder="Número de serie" class="input" />
            <input type="date" v-model="nuevoEquipo.fecha_compra" class="input" />
            <input v-model="nuevoEquipo.ubicacion_actual" placeholder="Ubicación" class="input" />
            <select v-model="nuevoEquipo.company_id" class="input">
            <option disabled value="">Seleccione una empresa</option>
            <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
                {{ empresa.name }}
            </option>
            </select>
            <textarea v-model="nuevoEquipo.notas" placeholder="Notas" class="input" />

            <div class="flex justify-end gap-2 mt-2">
                <button @click="mostrarModal = false" type="button" class="px-3 py-1 rounded-lg text-gray-600 hover:underline">Cancelar</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Guardar
                </button>
            </div>
            </form>

            <button @click="mostrarModal = false" class="absolute top-2 right-2 text-gray-500 hover:text-black">
            ✕
            </button>
        </div>
        </div>



        <table class="min-w-full divide-y divide-gray-200 border rounded-xl shadow-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Nombre</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Tipo</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Empresa</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Estado</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Compra</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase">Acciones</th>
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
              <td class="px-6 py-4 whitespace-nowrap flex gap-2">
                <!-- Botón editar -->
                <button
                    @click="abrirModalEditar(equipo)"
                    class="text-blue-600 hover:underline text-sm"
                >
                    Editar
                </button>

                <!-- Botón eliminar -->
                <button
                    @click="eliminarEquipo(equipo.id)"
                    class="text-red-600 hover:underline text-sm"
                >
                    Eliminar
                </button>
                </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>

  