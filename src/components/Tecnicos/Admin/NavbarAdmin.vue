<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";
import Notificaciones from "../CampanaNotificaciones.vue";

const router = useRouter();
const usuario = JSON.parse(localStorage.getItem("usuario"));

const handleLogout = () => {
  localStorage.removeItem("usuario"); // Eliminar sesión
  router.push("/"); // Redirigir al login
};

const isUsuario = computed(() => usuario?.rol === 'usuario');
</script>

<template>
  <div>
    <nav class="bg-blue-500 text-white p-2 relative">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-0.5">
          <p class="font-bold">Soporte Innovalink</p>
          <img class="w-5 h-5" src="../../../assets/logo.png" alt="logo" />
        </div>

        <ul class="flex space-x-5">
          <li v-if="isUsuario">
            <router-link to="/usuarios/dashboard" class="hover:underline">Dashboard</router-link>

          </li>
          <li>
            <Notificaciones/>
          </li>
          <li>
            <router-link to="/admin/dashboard">Dashboard</router-link>
          </li>
          <li>
            <button @click="handleLogout" class="hover:underline">
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
