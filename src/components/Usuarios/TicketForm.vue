<script setup>
</script>

<template>
    <div class="w-96 p-8 rounded-2xl shadow-xl backdrop-blur-xl bg-white/10 border border-white/30 text-white">
      <p class="pb-4 text-xl font-semibold">Crear Nuevo Ticket</p>
      <form class="flex flex-col space-y-3" action="submit">
        <div class="flex flex-col">
          <label for="asunto" class="mb-1">Asunto</label>
          <input class="bg-white/20 rounded-md p-2 outline-none focus:ring-2 focus:ring-white/50" type="text" id="asunto" />
        </div>
  
        <div class="flex flex-col pt-1.5">
          <label for="servicio" class="mb-1">Servicio</label>
          <select class="bg-white/20 rounded-md p-2 outline-none focus:ring-2 focus:ring-white/50" name="servicio" id="servicio">
            <option value="1">Soporte Técnico</option>
            <option value="2">Soporte de Cuenta</option>
            <option value="3">Soporte de Facturación</option>
          </select>
        </div>
  
        <div class="flex flex-col pt-1.5">
          <label for="prioridad" class="mb-1">Prioridad</label>
          <select class="bg-white/20 rounded-md p-2 outline-none focus:ring-2 focus:ring-white/50" name="prioridad" id="prioridad">
            <option value="1">Alta</option>
            <option value="2">Media</option>
            <option value="3">Baja</option>
          </select>
        </div>
  
        <div class="flex flex-col pt-1.5">
          <label for="descripcion" class="mb-1">Descripción</label>
          <textarea class="h-32 bg-white/20 rounded-md p-2 outline-none resize-none focus:ring-2 focus:ring-white/50" id="descripcion"></textarea>
        </div>
  
        <div class="pt-8 text-center">
          <button class="bg-white/20 hover:bg-white/30 text-white p-2 px-6 rounded-lg font-semibold backdrop-blur-lg transition">
            Crear Ticket
          </button>
        </div>
      </form>
    </div>
  </template>
  