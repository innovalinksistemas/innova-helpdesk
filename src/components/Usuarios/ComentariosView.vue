<script setup>
import { ref, onMounted, defineExpose } from 'vue'
import { supabase } from '../../supabase.js'
import { useRoute } from 'vue-router'

const route = useRoute()
const ticketId = route.params.id
const comentarios = ref([])

const fetchComentarios = async () => {
  const { data, error } = await supabase
    .from('comentarios_ticket')
    .select('*, usuario(full_name)')
    .eq('ticket_id', ticketId)
    .order('fecha_creacion', { ascending: true })

  if (!error) comentarios.value = data
  else console.error('Error al obtener comentarios:', error)
}

onMounted(fetchComentarios)
defineExpose({ fetchComentarios });
defineProps({
  ticketId: String
})

</script>

<template>
  <div>
    <h3 class="font-semibold text-white mb-2">Historial de Comentarios</h3>
    <div class="mt-6 overflow-auto h-96">

    <div
      v-for="comentario in comentarios"
      :key="comentario.id"
      class="bg-white/20 text-white p-3 mb-3 rounded-md"
    >
      <div class="flex justify-between items-center mb-1">
        <span class="font-semibold text-sm">
          {{ comentario.usuarios?.full_name || 'Usuario' }}
        </span>
        <span class="text-xs opacity-80">
          {{ new Date(comentario.fecha_creacion).toLocaleString() }}
        </span>
      </div>
      <p class="text-sm whitespace-pre-line">{{ comentario.contenido }}</p>
      <div class="mt-2">
        <span class="text-xs bg-white/10 px-2 py-1 rounded-full">
          {{ comentario.tipo }}
        </span>
      </div>
    </div>
  </div>
  </div>
 
</template>

<style scoped>
</style>
