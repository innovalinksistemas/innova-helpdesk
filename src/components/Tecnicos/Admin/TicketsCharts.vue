<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../../../supabase.js";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Line, Pie } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
  ChartDataLabels
);

const lineData = ref({ labels: [], datasets: [] });
const pieData = ref({ labels: [], datasets: [] });
const chartMode = ref("Circular");

const fetchAndProcessTickets = async () => {
  const { data: tickets, error } = await supabase
  .from("tickets")
.select("id, estado, fecha_creacion, fecha_resolucion, categorias_servicio(nombre)")


  if (error) {
    console.error("Error al cargar tickets:", error);
    return;
  }

  // Agrupar por día de la semana
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const nuevosPorDia = Array(7).fill(0);
  const resueltosPorDia = Array(7).fill(0);

  const categoriasCount = {};

  tickets.forEach((t) => {
    const creacion = new Date(t.fecha_creacion);
    const dia = creacion.getDay();
    nuevosPorDia[dia]++;

    if (t.estado === "resuelto" && t.fecha_resolucion) {
      const resueltoDia = new Date(t.fecha_resolucion).getDay();
      resueltosPorDia[resueltoDia]++;
    }

    // Agrupar por categoría
    if (t.categorias_servicio?.nombre) {
  const nombre = t.categorias_servicio.nombre;
  categoriasCount[nombre] = (categoriasCount[nombre] || 0) + 1;
}

  });

  // Line chart
  lineData.value = {
    labels: dias,
    datasets: [
      {
        label: "Nuevos",
        data: nuevosPorDia,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "white",
      },
      {
        label: "Resueltos",
        data: resueltosPorDia,
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "white",
      },
    ],
  };

  // Pie chart
  pieData.value = {
    labels: Object.keys(categoriasCount),
    datasets: [
      {
        data: Object.values(categoriasCount),
        backgroundColor: ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b"],
        borderWidth: 1,
      },
    ],
  };
};

onMounted(fetchAndProcessTickets);
</script>


<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
    <!-- Line Chart -->
    <div
      class="shadow-xl backdrop-blur-xl bg-white/10 border border-white/30 text-white rounded-2xl p-4"
    >
      <h2 class="text-xl font-bold mb-4">Tendencia de Tickets</h2>
      <Line
        :data="lineData"
        :options="{
          responsive: true,
          plugins: {
            legend: {
              labels: { color: 'white' },
            },
            datalabels: {
              color: 'white', // Cambia el color de los números que aparecen sobre los puntos
              anchor: 'end',
              align: 'top',
              font: {
                weight: 'bold',
              },
            },
          },
          scales: {
            x: {
              ticks: { color: 'white' }, // Números del eje X
            },
            y: {
              ticks: { color: 'white' }, // Números del eje Y
            },
          },
        }"
      />
    </div>

    <!-- Pie Chart -->
    <div
      class="shadow-xl backdrop-blur-xl bg-white/10 border border-white/30 text-white rounded-2xl p-4"
    >
      <h2 class="text-xl font-bold mb-4">Distribución por Categorías</h2>

      <!-- Selector de modo de gráfico -->
      <div
        class="flex bg-white/20 rounded-full p-1 w-max space-x-1 text-sm font-medium mb-4"
      >
        <button
          v-for="option in ['Circular', 'Barras']"
          :key="option"
          @click="chartMode = option"
          :class="[
            'px-4 py-1 rounded-full transition-all duration-200',
            chartMode === option ? 'bg-white text-purple-700' : 'text-white',
          ]"
        >
          {{ option }}
        </button>
      </div>

      <!-- Condicional gráfico -->
      <Pie
        v-if="chartMode === 'Circular'"
        :data="pieData"
        :options="{
          responsive: true,
          plugins: { legend: { labels: { color: 'white' } } },
        }"
      />
      <p v-else class="text-white text-sm italic">
        Modo de barras en construcción
      </p>
    </div>
  </div>
</template>

<style scoped>
canvas {
  max-height: 300px;
}
</style>
