<script setup>

</script>

<template>
    <div class="bg-gray-100 w-96 p-8 rounded-2xl min-h-[75%] ">
        <p class="pb-4">Tickets Asignados</p>
        <nav class="bg-gray-200 p-0.5 rounded-xl">
            <ul class="flex flex-row space-x-4">
                <li>Todos</li>
                <li>Nuevos</li>
                <li>En Progreso</li>
                <li>Esperando</li>
            </ul>
        </nav>
        <div class="grid pt-4 overflow-y-auto">
            <div class="bg-gray-200 w-full p-2 rounded-xl">
                <div class="flex space-x-4 p-1">
                    <p>No puedo acceder a mi cuenta</p>
                    <p class="bg-red-500 text-white pl-2 pr-2 rounded-xl">Alta</p>
                </div>
                <p class="p-1">Nombre Apellido</p>
                <div class="flex space-x-4 p-1">
                    <p class="bg-white text-black pl-2 pr-2 rounded-xl">Nuevo</p>
                    <p>15 min</p>
                </div>
            </div>
            
            

        </div>
    </div>
</template>