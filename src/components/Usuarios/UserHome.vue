<script setup>
import NavBar from "../../components/Usuarios/Navbar.vue";
import TicketForm from "../../components/Usuarios/TicketForm.vue";
import QA from "../../components/Usuarios/QA.vue";
</script>

<template>
  <div>
    <div>
      <NavBar />
    </div>
  
    <div class="pt-8">
      <div class="flex justify-center space-x-32">
        <div>
          <TicketForm />
        </div>
        <div>
          <QA />
        </div>
      </div>
    </div>
  </div>
</template>
