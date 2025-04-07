<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../../supabase.js";

const asunto = ref("");
const servicio = ref("");
const prioridad = ref("");
const severidad = ref("");
const subcategoria = ref("");
const descripcion = ref("");

const categorias = ref([]);
const subcategorias = ref([]);
const severidades = ref([]);

onMounted(async () => {
  const [{ data: cats }, { data: subs }, { data: sevs }] = await Promise.all([
    supabase.from("categorias_servicio").select("*"),
    supabase.from("subcategorias").select("*"),
    supabase.from("severidades").select("*")
  ])

  categorias.value = cats || []
  subcategorias.value = subs || []
  severidades.value = sevs || []
})

const handleSubmit = async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return alert("Sesión no encontrada.");

  const { data, error } = await supabase.from("tickets").insert([
    {
      titulo: asunto.value,
      descripcion: descripcion.value,
      categoria: servicio.value,
      subcategoria: subcategoria.value,
      prioridad: prioridad.value,
      severidad: severidad.value,
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

  // ✅ Enviar correo después de crear el ticket
  try {
    
    await fetch("http://localhost:8000/api/notificar-ticket", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: usuario.contact_email, // asegúrate que esto existe
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
  severidad.value = "";
  subcategoria.value = "";
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
        <label for="severidad" class="mb-1">Severidad</label>
        <select
          v-model="severidad"
          class="bg-white/20 rounded-md p-2 outline-none focus:ring-2 focus:ring-white/50"
          id="severidad"
        >
          <option v-for="s in severidades" :key="s.id" :value="s.id">{{ s.nombre }}</option>
        </select>
      </div>

      <div class="flex flex-col pt-1.5">
        <label for="servicio" class="mb-1">Categoría</label>
        <select
          v-model="servicio"
          class="bg-white/20 rounded-md p-2 outline-none focus:ring-2 focus:ring-white/50"
          id="servicio"
        >
          <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
        </select>
      </div>

      <div class="flex flex-col pt-1.5">
        <label for="subcategoria" class="mb-1">Subcategoría</label>
        <select
          v-model="subcategoria"
          class="bg-white/20 rounded-md p-2 outline-none focus:ring-2 focus:ring-white/50"
          id="subcategoria"
        >
          <option
            v-for="s in subcategorias.filter(sc => sc.categoria_id === servicio)"
            :key="s.id"
            :value="s.id"
          >
            {{ s.nombre }}
          </option>
        </select>
      </div>

      <div class="flex flex-col pt-1.5">
        <label for="prioridad" class="mb-1">Prioridad</label>
        <select
          v-model="prioridad"
          class="bg-white/20 rounded-md p-2 outline-none focus:ring-2 focus:ring-white/50"
          id="prioridad"
        >
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
