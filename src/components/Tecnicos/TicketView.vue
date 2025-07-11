<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../../supabase.js";
import Comentarios from "../../components/Tecnicos/CometariosView.vue";
import { computed } from "vue";

const route = useRoute();
const ticketId = route.params.id;
const ticket = ref(null);
const respuesta = ref("");
const usuario = JSON.parse(localStorage.getItem("usuario"));
const nuevoEstado = ref("");
const comentariosRef = ref(null);
const mostrarModal = ref(false);
const justificacionPausa = ref("");

const fetchTicket = async () => {
  const { data, error } = await supabase
    .from("tickets")
    .select(
      `*, categorias_servicio(nombre), severidad(nombre, color), areas(nombre)`
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
    comentariosRef.value.fetchComentarios();
  }

  if (comentarioError) {
    console.error("Error al guardar respuesta:", comentarioError);
    return alert("Hubo un error al guardar la respuesta");
  }

  // 2. Cambiar estado del ticket y establecer fecha_inicio si no existe
  const updateData = { estado: "en_proceso" };
  if (!ticket.value.fecha_inicio) {
    updateData.fecha_inicio = new Date().toISOString();
  }

  const { error: estadoError } = await supabase
    .from("tickets")
    .update(updateData)
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

  const updateData = { estado: nuevoEstado.value };

  if (nuevoEstado.value === "resuelto") {
    updateData.fecha_resolucion = new Date().toISOString();
  }

  const { error } = await supabase
    .from("tickets")
    .update(updateData)
    .eq("id", ticketId);

  if (error) {
    console.error("Error al actualizar estado manual:", error);
    alert("No se pudo actualizar el estado.");
  } else {
    alert(`Estado actualizado a "${nuevoEstado.value}" correctamente.`);
    fetchTicket();
  }
};

// Computar el tiempo total trabajado
const tiempoTotal = computed(() => {
  if (!ticket.value?.fecha_inicio || !ticket.value?.fecha_resolucion)
    return "N/A";

  const inicio = new Date(ticket.value.fecha_inicio);
  const fin = new Date(ticket.value.fecha_resolucion);
  const diffMs = fin - inicio;

  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${horas}h ${minutos}m`;
});
const pausarTicket = async () => {
  if (!justificacionPausa.value.trim()) {
    alert("Debes ingresar una justificación para pausar el ticket.");
    return;
  }

  const { error } = await supabase
    .from("tickets")
    .update({
      estado: "pausado",
      justificacion_pausa: justificacionPausa.value,
    })
    .eq("id", ticketId);

  if (error) {
    console.error("Error al pausar el ticket:", error);
    alert("No se pudo pausar el ticket.");
  } else {
    alert("Ticket pausado correctamente.");
    mostrarModal.value = false;
    justificacionPausa.value = "";
    fetchTicket(); // Refrescar datos del ticket
  }
};
</script>

<template>
  <div
    v-if="ticket"
    class="p-6 space-y-4 text-white bg-gradient-to-br from-cyan-500 h-screen to-blue-500 shadow-xl"
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
      <span v-if="ticket.areas" class="text-xs px-2 py-1 rounded bg-purple-600">
        Área: {{ ticket.areas.nombre }}
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
        Tiempo total trabajado: <strong>{{ tiempoTotal }}</strong>
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
        <button
          @click="mostrarModal = true"
          class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md"
        >
          Pausar Tiempo
        </button>
      </div>
    </div>

    <Comentarios ref="comentariosRef" :ticket-id="ticket.id" />
  </div>

  <div
    v-if="mostrarModal"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white text-black p-6 rounded-lg shadow-lg w-[90%] max-w-md">
      <h2 class="text-lg font-semibold mb-2">Justificación de Pausa</h2>
      <textarea
        v-model="justificacionPausa"
        placeholder="Explica por qué pausas este ticket..."
        class="w-full p-2 border rounded"
        rows="4"
      ></textarea>

      <div class="mt-4 flex justify-end gap-2">
        <button
          @click="mostrarModal = false"
          class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          @click="pausarTicket"
          class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Confirmar Pausa
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea::placeholder {
  color: rgba(255, 255, 255, 0.7);
}
</style>
