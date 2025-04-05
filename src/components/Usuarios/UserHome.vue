<script setup>
import NavBar from "../../components/Usuarios/Navbar.vue";
import TicketForm from "../../components/Usuarios/TicketForm.vue";
import QA from "../../components/Usuarios/QA.vue";
import StarBackground from "../../components/StarBackground.vue";
</script>

<template>
  <div class="relative overflow-hidden min-h-screen">
    <!-- Fondo animado -->
    <StarBackground />

    <!-- Contenido encima del fondo -->
    <div class="relative z-10">
      <NavBar />

      <div class="pt-8">
        <div class="flex flex-col lg:flex-row justify-center gap-8 px-4 mb-3">
          <TicketForm />
          <QA />
        </div>
      </div>
    </div>
  </div>
</template>
