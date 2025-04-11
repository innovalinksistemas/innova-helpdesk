<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../../supabase.js";
import Comentarios from "../../components/Tecnicos/CometariosView.vue";

const route = useRoute();
const ticketId = route.params.id;
const ticket = ref(null);
const respuesta = ref("");
const usuario = JSON.parse(localStorage.getItem("usuario"));
const nuevoEstado = ref("");
const comentariosRef = ref(null);

const fetchTicket = async () => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `*, categorias_servicio(nombre), subcategorias(nombre), severidad(nombre, color)`
    )
    .eq("id", ticketId)
    .single();

  if (!error) ticket.value = data;
  else console.error("Error al obtener el ticket:", error);
};

onMounted(fetchTicket);

const enviarRespuesta = async () => {
  if (!respuesta.value.trim()) return alert("Escribe una respuesta");

  // 1. Guardar comentario
  const { error: comentarioError } = await supabase
    .from("comentarios_ticket")
    .insert([
      {
        ticket_id: ticketId,
        usuario_id: usuario.id,
        contenido: respuesta.value,
        fecha_creacion: new Date().toISOString(),
        tipo: "respuesta",
      },
    ]);
    if (comentariosRef.value) {
    comentariosRef.value.fetchComentarios(); // 🔁 Recarga sin refrescar la página
  }
  if (comentarioError) {
    console.error("Error al guardar respuesta:", comentarioError);
    return alert("Hubo un error al guardar la respuesta");
  }


  // 2. Cambiar estado del ticket
  const { error: estadoError } = await supabase
    .from("tickets")
    .update({ estado: "en_proceso" })
    .eq("id", ticketId);

  if (estadoError) {
    console.error("Error al actualizar estado del ticket:", estadoError);
  }

  // 3. Obtener correo desde la tabla empresas
  const { data: empresa, error: empresaError } = await supabase
    .from("empresas")
    .select("contact_email")
    .eq("id", ticket.value.empresa_id)
    .single();

  if (empresaError || !empresa?.contact_email) {
    console.error("No se pudo obtener el correo del usuario");
    return alert("No se pudo obtener el correo del usuario");
  }

  // 4. Enviar correo
  try {
    await fetch("http://localhost:8000/api/send-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: empresa.contact_email,
        subject: `Nueva respuesta en tu ticket: ${ticket.value.titulo}`,
        message: respuesta.value,
      }),
    });
  } catch (err) {
    console.error("Error al enviar correo de respuesta:", err);
  }

  respuesta.value = "";
  alert("Respuesta registrada y correo enviado correctamente");
  fetchTicket();
};
const actualizarEstadoManual = async () => {
  if (!nuevoEstado.value) return;

  const { error } = await supabase
    .from("tickets")
    .update({ estado: nuevoEstado.value })
    .eq("id", ticketId);

  if (error) {
    console.error("Error al actualizar estado manual:", error);
    alert("No se pudo actualizar el estado.");
  } else {
    alert(`Estado actualizado a "${nuevoEstado.value}" correctamente.`);
    fetchTicket(); // Recargar datos actualizados
  }
};
</script>

<template>
  <div
    v-if="ticket"
    class="p-6 space-y-4 text-white bg-gradient-to-br from-cyan-500 h-auto to-blue-500 shadow-xl"
  >
    <router-link to="/tecnicos/home" class="text-sm text-white hover:underline">
      ← Volver
    </router-link>
    <h1 class="text-2xl font-bold">Ticket #{{ ticket.id }}</h1>

    <div class="flex items-center flex-wrap gap-2">
      <span class="text-xl font-semibold">{{ ticket.titulo }}</span>
      <span
        v-if="ticket.prioridad"
        class="text-xs px-2 py-1 rounded bg-white text-black"
      >
        Prioridad: {{ ticket.prioridad }}
      </span>
      <span
        v-if="ticket.severidad"
        class="text-xs px-2 py-1 rounded"
        :style="{ backgroundColor: ticket.severidad.color }"
      >
        Severidad: {{ ticket.severidad.nombre }}
      </span>
      <span
        v-if="ticket.categorias_servicio"
        class="text-xs px-2 py-1 rounded bg-emerald-600"
      >
        Categoria: {{ ticket.categorias_servicio.nombre }}
      </span>
      <span
        v-if="ticket.subcategorias"
        class="text-xs px-2 py-1 rounded bg-black/40"
      >
        Subcategoría: {{ ticket.subcategorias.nombre }}
      </span>
    </div>

    <div class="text-right">
      <span class="px-4 py-2 bg-white/10 rounded-xl text-white">
        {{ ticket.estado.replace("_", " ") }}
      </span>
      <!-- Cambiar Estado -->
      <div class="mt-2 text-right">
        <label for="estado" class="text-sm mr-2">Cambiar Estado:</label>
        <select
          id="estado"
          v-model="nuevoEstado"
          @change="actualizarEstadoManual"
          class="bg-white/20 text-white p-1 rounded"
        >
          <option disabled value="">Seleccionar estado</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En Proceso</option>
          <option value="resuelto">Resuelto</option>
          <option value="cerrado">Cerrado</option>
        </select>
      </div>
    </div>

    <div class="mt-4">
      <h3 class="font-semibold text-white mb-1">Descripción del problema</h3>
      <p class="bg-white/10 p-4 rounded-md">{{ ticket.descripcion }}</p>
    </div>

    <div class="mt-6">
      <p class="text-sm text-white/80">
        Tiempo en este ticket: <strong>45 minutos</strong>
      </p>
    </div>

    <div class="mt-4 space-y-4">
      <h3 class="font-semibold">Respuesta al Cliente</h3>
      <textarea
        v-model="respuesta"
        placeholder="Escribe tu respuesta al cliente..."
        class="w-full p-2 rounded-md bg-white/20 text-white"
      ></textarea>

      <div class="flex gap-2">
        <button class="bg-white/20 px-3 py-1 rounded-md">Adjuntar</button>
        <button class="bg-white/20 px-3 py-1 rounded-md">
          Insertar Enlace
        </button>
      </div>

      <div class="flex justify-between items-center mt-2">
        <button
          @click="enviarRespuesta"
          class="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md"
        >
          Enviar Respuesta
        </button>

        <button class="bg-blue-600 text-white px-3 py-1 rounded-md">
          Escalar
        </button>
      </div>
    </div>

    <Comentarios ref="comentariosRef" :ticket-id="ticket.id" />
  </div>
</template>

<style scoped>
textarea::placeholder {
  color: rgba(255, 255, 255, 0.7);
}
</style>
