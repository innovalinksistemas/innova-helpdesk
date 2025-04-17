<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../../supabase';
import ListEquipment from '../Equipment/ListEquipment.vue';
import NavBar from '../Admin/NavbarAdmin.vue'
const empresas = ref([]);
const empresaSeleccionada = ref(null);
const mostrarEquipos = ref(false);
const modoEdicion = ref(false);
const empresaForm = ref({
  id: '',
  name: '',
  contact_email: '',
  phone: '',
  address: '',
});

const fetchEmpresas = async () => {
  const { data, error } = await supabase.from('empresas').select('*');
  if (error) {
    console.error('❌ Error al cargar empresas:', error);
  } else {
    console.log('✅ Empresas cargadas:', data);
    empresas.value = data;
  }
};

const seleccionarEmpresa = (empresa) => {
  empresaSeleccionada.value = empresa;
  empresaForm.value = { ...empresa };
  modoEdicion.value = false;
  mostrarEquipos.value = false;
};

const guardarCambios = async () => {
  const { error } = await supabase
    .from('empresas')
    .update({
      name: empresaForm.value.name,
      contact_email: empresaForm.value.contact_email,
      phone: empresaForm.value.phone,
      address: empresaForm.value.address,
    })
    .eq('id', empresaForm.value.id);

  if (!error) {
    alert('✅ Cambios guardados correctamente.');
    fetchEmpresas();
    modoEdicion.value = false;
  }
};

onMounted(fetchEmpresas);
</script>

<template>
    <NavBar />
  <div class="p-6 space-y-6 bg-gray-100 min-h-screen">
    <h2 class="text-2xl font-bold text-gray-800">Administrar Clientes</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-gray-700 font-semibold mb-2">Clientes</h3>
        <ul class="space-y-2">
          <li
            v-for="empresa in empresas"
            :key="empresa.id"
            @click="seleccionarEmpresa(empresa)"
            class="cursor-pointer bg-white border border-gray-200 p-3 rounded-md hover:bg-gray-50 text-gray-800 shadow"
          >
            {{ empresa.name }}
          </li>
        </ul>
      </div>

      <div v-if="empresaSeleccionada" class="space-y-4">
        <h3 class="text-gray-700 font-semibold">Detalles de Cliente</h3>
        <div class="bg-white p-4 rounded-md space-y-3 border border-gray-200 shadow text-gray-800">
          <div>
            <label class="block text-sm font-medium">Nombre</label>
            <input v-model="empresaForm.name" :readonly="!modoEdicion" class="w-full border rounded-md px-2 py-1 bg-gray-100" />
          </div>
          <div>
            <label class="block text-sm font-medium">Correo</label>
            <input v-model="empresaForm.contact_email" :readonly="!modoEdicion" class="w-full border rounded-md px-2 py-1 bg-gray-100" />
          </div>
          <div>
            <label class="block text-sm font-medium">Teléfono</label>
            <input v-model="empresaForm.phone" :readonly="!modoEdicion" class="w-full border rounded-md px-2 py-1 bg-gray-100" />
          </div>
          <div>
            <label class="block text-sm font-medium">Dirección</label>
            <textarea v-model="empresaForm.address" :readonly="!modoEdicion" class="w-full border rounded-md px-2 py-1 bg-gray-100"></textarea>
          </div>

          <div class="flex gap-3 pt-2">
            <button v-if="!modoEdicion" @click="modoEdicion = true" class="bg-blue-600 text-white px-3 py-1 rounded">Editar</button>
            <button v-else @click="guardarCambios" class="bg-green-600 text-white px-3 py-1 rounded">Guardar</button>
            <button @click="mostrarEquipos = !mostrarEquipos" class="bg-purple-600 text-white px-3 py-1 rounded">
              {{ mostrarEquipos ? 'Ocultar Equipos' : 'Ver Equipos' }}
            </button>
          </div>
        </div>

        <ListEquipment v-if="mostrarEquipos" :company-id="empresaSeleccionada.id" class="mt-4" />
      </div>
    </div>
  </div>
</template>

<style scoped>
input, textarea {
  outline: none;
}
</style>
