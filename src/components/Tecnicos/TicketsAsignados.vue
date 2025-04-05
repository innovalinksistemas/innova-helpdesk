<script setup>
import { ref, onMounted, computed } from "vue";
import { supabase } from "../../supabase.js";
import { useRouter } from "vue-router";

const usuario = JSON.parse(localStorage.getItem("usuario"));
const tickets = ref([]);
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
    .select("*, severidad(nombre, color)")
    .eq("tecnico_id", usuario.id);

  if (!error) tickets.value = data;
  else console.error("Error al obtener tickets:", error);
};

onMounted(fetchTickets);

const ticketsFiltrados = computed(() => {
  if (filtro.value === "Todos") return tickets.value;
  return tickets.value.filter((ticket) => ticket.estado === filtro.value);
});
</script>

<template>
  <nav class="bg-gray-200 p-1 rounded-xl w-full max-w-md mb-4">
    <ul class="flex flex-wrap justify-around gap-2 text-sm font-medium">
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

  <div class="grid gap-4">
    <div
      v-for="ticket in ticketsFiltrados"
      :key="ticket.id"
      @click="router.push(`/tecnicos/tickets/${ticket.id}`)"
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
</template>
