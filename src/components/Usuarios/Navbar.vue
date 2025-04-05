<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem("usuario"); // Eliminar sesión
  router.push("/"); // Redirigir al login
};
</script>

<template>
  <div>
    <nav class="bg-transparent text-white p-2 relative">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-0.5">
          <p class="font-bold">Soporte Innovalink</p>
          <img class="w-5 h-5" src="../../assets/logo.png" alt="logo" />
        </div>

        <ul class="flex space-x-5">
          <li>
            <button @click="handleLogout" class="hover:underline">
              Cerrar sesión
            </button>
          </li>
          <li>
            <router-link to="/usuarios">Centro de Ayuda</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
