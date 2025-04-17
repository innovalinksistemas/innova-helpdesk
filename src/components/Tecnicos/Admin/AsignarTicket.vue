<script setup>
import { ref, onMounted, computed } from "vue";
import { supabase } from "../../../supabase.js";
import { useRouter } from "vue-router";
import Navbar from "../Admin/NavbarAdmin.vue";

const tickets = ref([]);
const tecnicos = ref([]);
const tecnicoSeleccionado = ref("todos");
const filtro = ref("Todos");
const router = useRouter();

const estados = ["Todos", "pendiente", "en_proceso", "resuelto", "cerrado"];

const etiquetas = {
  pendiente: "Pendiente",
  en_proceso: "En Proceso",
  resuelto: "Resuelto",
  cerrado: "Cerrado",
};

const fetchTickets = async () => {
  const { data, error } = await supabase
    .from("tickets")
    .select("*, severidad(nombre, color), tecnico:tecnico_id(full_name)")

  if (!error) tickets.value = data;
  else console.error("Error al obtener tickets:", error);
};


const fetchTecnicos = async () => {
  const { data, error } = await supabase
    .from("usuario")
    .select("id, full_name")
    .eq("rol", "tech");

  if (!error) tecnicos.value = data;
  else console.error("Error al obtener técnicos:", error);
};

onMounted(() => {
  fetchTickets();
  fetchTecnicos();
});

// ✅ Filtro combinado por técnico y estado
const ticketsFiltrados = computed(() => {
  return tickets.value.filter((ticket) => {
    const porTecnico =
      tecnicoSeleccionado.value === "todos" ||
      ticket.tecnico_id === tecnicoSeleccionado.value;

    const porEstado =
      filtro.value === "Todos" || ticket.estado === filtro.value;

    return porTecnico && porEstado;
  });
});
</script>

<template>
  <div class="space-y-4">
    <Navbar/>
<div class="flex flex-row items-center">
    <!-- Filtro por estado -->
    <nav class="bg-gray-200 p-1 rounded-xl w-full max-w-md ">
      <ul class="flex flex-wrap justify-around gap-1 text-sm font-medium">
        <li
          v-for="estado in estados"
          :key="estado"
          @click="filtro = estado"
          :class="[
            'cursor-pointer px-3 py-1 rounded-xl',
            filtro === estado ? 'bg-white text-black' : 'text-gray-700',
          ]"
        >
          {{ estado === "Todos" ? "Todos" : etiquetas[estado] }}
        </li>
      </ul>
    </nav>

   <!-- Selector de Técnico -->
   <div class="flex items-center gap-3">
      <label class="text-sm font-medium text-white">Filtrar por técnico:</label>
      <select v-model="tecnicoSeleccionado" class="p-1 rounded-md text-sm">
        <option value="todos">Tecnicos</option>
        <option
          v-for="tecnico in tecnicos"
          :key="tecnico.id"
          :value="tecnico.id"
        >
          {{ tecnico.full_name }}
        </option>
      </select>
    </div>
</div>
  

    <!-- Lista de tickets -->
    <div class="bg-gray-100 p-4 rounded-xl shadow overflow-auto">
      <div class="grid gap-4 h-auto">
        <div
          v-for="ticket in ticketsFiltrados"
          :key="ticket.id"
          @click="router.push(`/admin/asignarticket/${ticket.id}`)"
          class="bg-gray-200 p-3 rounded-xl shadow cursor-pointer hover:bg-gray-300 transition"
        >
          <div class="flex justify-between items-center">
            <p class="font-semibold">{{ ticket.titulo }}</p>
            <span
              class="px-2 py-1 rounded-xl text-xs text-white"
              :class="{
                'bg-red-500': ticket.prioridad === 'alta',
                'bg-yellow-500': ticket.prioridad === 'media',
                'bg-green-500': ticket.prioridad === 'baja',
              }"
            >
              {{ ticket.prioridad }}
            </span>
          </div>
          <p class="text-sm mt-1 text-gray-800">{{ ticket.descripcion }}</p>
          <div class="flex justify-between items-center mt-2 text-sm">
            <span class="bg-white px-2 py-1 rounded-xl">
              {{ etiquetas[ticket.estado] }}
            </span>
            <span>{{ new Date(ticket.fecha_creacion).toLocaleString() }}</span>
          </div>
          <div class="text-sm mt-1 italic text-gray-700">
            Técnico:
            <span v-if="ticket.tecnico">{{ ticket.tecnico.full_name }}</span>
            <span v-else class="text-red-500">Sin asignar</span>
          </div>
          <div v-if="ticket.severidad" class="mt-2">
            <span
              class="text-xs px-2 py-1 rounded-md text-white"
              :style="{ backgroundColor: ticket.severidad.color }"
            >
              {{ ticket.severidad.nombre }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
