<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../../supabase.js";

const asunto = ref("");
const servicio = ref("");
const prioridad = ref("");
const descripcion = ref("");
const area = ref("");

const categorias = ref([]);
const areas = ref([]);

onMounted(async () => {
  const [{ data: cats }, { data: ares }] = await Promise.all([
    supabase.from("categorias_servicio").select("*"),
    supabase.from("areas").select("*"),
  ]);

  categorias.value = cats || [];
  areas.value = ares || [];
});

const handleSubmit = async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return alert("Sesión no encontrada.");

  // Validación
  if (
    !asunto.value ||
    !servicio.value ||
    !prioridad.value ||
    !descripcion.value ||
    !area.value
  ) {
    alert("Por favor completa todos los campos antes de enviar.");
    return;
  }

  const { data, error } = await supabase.from("tickets").insert([
    {
      titulo: asunto.value,
      descripcion: descripcion.value,
      categoria: servicio.value,
      area: area.value,
      prioridad: prioridad.value,
      severidad: null, // 👈 valor por defecto
      fecha_creacion: new Date().toISOString(),
      empresa_id: usuario.id,
      estado: "pendiente"
    },
  ]);

  if (error) {
    console.error(error);
    alert("Hubo un error al crear el ticket.");
    return;
  }

  try {
    await fetch("http://localhost:8000/api/notificar-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: usuario.contact_email,
        subject: `Ticket recibido: ${asunto.value}`,
        ticketInfo: {
          titulo: asunto.value,
          prioridad: prioridad.value,
          estado: "pendiente",
          descripcion: descripcion.value,
        },
      }),
    });
  } catch (e) {
    console.warn("No se pudo enviar el correo:", e);
  }

  alert("¡Ticket creado correctamente!");

  // Limpiar campos
  asunto.value = "";
  servicio.value = "";
  prioridad.value = "";
  area.value = "";
  descripcion.value = "";
};
</script>

<template>
  <div
    class="w-96 p-8 rounded-2xl shadow-xl backdrop-blur-xl bg-white/10 border border-white/30 text-white"
  >
    <p class="pb-4 text-xl font-semibold">Crear Nuevo Ticket</p>

    <form class="flex flex-col space-y-3" @submit.prevent="handleSubmit">
      <div class="flex flex-col">
        <label for="asunto" class="mb-1">Asunto</label>
        <input
          v-model="asunto"
          class="bg-white/20 rounded-md p-2 outline-none focus:ring-2 focus:ring-white/50"
          type="text"
          id="asunto"
        />
      </div>

      <div class="flex flex-col pt-1.5">
        <label for="servicio" class="mb-1">Categoría</label>
        <select
          v-model="servicio"
          class="bg-white/20 rounded-md p-2 outline-none focus:ring-2 focus:ring-white/50"
          id="servicio"
        >
          <option disabled value="">Seleccione una categoría</option>
          <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
        </select>
      </div>

      <div class="flex flex-col pt-1.5">
        <label for="area" class="mb-1">Área</label>
        <select
          v-model="area"
          class="bg-white/20 rounded-md p-2 outline-none focus:ring-2 focus:ring-white/50"
          id="area"
        >
          <option disabled value="">Seleccione un área</option>
          <option v-for="a in areas" :key="a.id" :value="a.id">{{ a.nombre }}</option>
        </select>
      </div>

      <div class="flex flex-col pt-1.5">
        <label for="prioridad" class="mb-1">Prioridad</label>
        <select
          v-model="prioridad"
          class="bg-white/20 rounded-md p-2 outline-none focus:ring-2 focus:ring-white/50"
          id="prioridad"
        >
          <option disabled value="">Seleccione una prioridad</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      <div class="flex flex-col pt-1.5">
        <label for="descripcion" class="mb-1">Descripción</label>
        <textarea
          v-model="descripcion"
          class="h-32 bg-white/20 rounded-md p-2 outline-none resize-none focus:ring-2 focus:ring-white/50"
          id="descripcion"
        ></textarea>
      </div>

      <div class="pt-8 text-center">
        <button
          type="submit"
          class="bg-white/20 hover:bg-white/30 text-white p-2 px-6 rounded-lg font-semibold backdrop-blur-lg transition"
        >
          Crear Ticket
        </button>
      </div>
    </form>
  </div>
</template>
