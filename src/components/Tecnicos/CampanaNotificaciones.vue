<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../../supabase";

const notificaciones = ref([]);
const cantidadNoLeidas = ref(0);
const mostrarDropdown = ref(false);
const usuario = JSON.parse(localStorage.getItem("usuario"));
const dropdownRef = ref(null);
const router = useRouter();

const fetchNotificaciones = async () => {
  if (!usuario?.id) return;

  const { data, error } = await supabase
    .from("notificaciones")
    .select("*")
    .eq("usuario_id", usuario.id)
    .order("fecha_creacion", { ascending: false });

  if (!error) {
    notificaciones.value = data;
    cantidadNoLeidas.value = data.filter((n) => !n.leido).length;
  }
};

const marcarComoLeidas = async () => {
  const idsNoLeidas = notificaciones.value
    .filter((n) => !n.leido)
    .map((n) => n.id);

  if (idsNoLeidas.length === 0) return;

  const { error } = await supabase
    .from("notificaciones")
    .update({ leido: true })
    .in("id", idsNoLeidas);

  if (!error) {
    cantidadNoLeidas.value = 0;
    notificaciones.value = [];
  }
};

const toggleDropdown = () => {
  mostrarDropdown.value = !mostrarDropdown.value;
};

const cerrarSiClickFuera = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    mostrarDropdown.value = false;
  }
};

onMounted(() => {
  fetchNotificaciones();
  document.addEventListener("click", cerrarSiClickFuera);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", cerrarSiClickFuera);
});

watch(mostrarDropdown, (nuevoValor) => {
  if (!nuevoValor) marcarComoLeidas();
});
const irATicket = async (notificacion) => {
  if (!notificacion.ticket_id) return;

  // 1. Eliminar la notificación de la base de datos
  const { error } = await supabase
    .from("notificaciones")
    .delete()
    .eq("id", notificacion.id);

  if (error) {
    console.error("❌ Error al eliminar la notificación:", error);
    return;
  }

  // 2. Redirigir al ticket
  router.push(`/tecnicos/tickets/${notificacion.ticket_id}`);
  await fetchNotificaciones(); // para que actualice la lista y el contador

};
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <!-- Ícono de campana -->
    <div class="cursor-pointer" @click.stop="toggleDropdown">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2"
        viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 17h5l-1.405-1.405C18.21 14.79 18 13.918 18 13V9a6 6 0 00-5-5.917V3a1 1 0 10-2 0v.083A6 6 0 006 9v4c0 .918-.21 1.79-.595 2.595L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
        />
      </svg>
      <!-- Número de notificaciones -->
      <span
        v-if="cantidadNoLeidas > 0"
        class="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full"
      >
        {{ cantidadNoLeidas }}
      </span>
    </div>

    <!-- Dropdown de notificaciones -->
    <div
      v-if="mostrarDropdown"
      class="absolute right-0 mt-2 w-72 bg-blue-500 shadow-lg rounded-md z-50 border"
    >
      <div class="p-2 font-semibold border-b">Notificaciones</div>
      <ul class="max-h-60 overflow-y-auto">
        <li
  v-for="n in notificaciones"
  :key="n.id"
  class="px-4 py-2 text-sm hover:bg-gray-100 border-b cursor-pointer"
  :class="{ 'bg-blue-400': !n.leido }"
  @click="irATicket(n)"
>
  <p class="font-medium">{{ n.titulo || 'Notificación' }}</p>
  <p class="text-white">{{ n.mensaje }}</p>
  <p class="text-xs text-white">{{ new Date(n.fecha_creacion).toLocaleString() }}</p>
</li>

      </ul>
      <div v-if="notificaciones.length === 0" class="text-center py-4 text-gray-200 text-sm">
        Sin notificaciones
      </div>
    </div>
  </div>
</template>