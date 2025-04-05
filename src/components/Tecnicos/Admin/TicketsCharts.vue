<script setup>
import { ref } from "vue";
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
} from "chart.js";
import { Line, Pie } from "vue-chartjs";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  ChartDataLabels
);

const lineData = ref({
  labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  datasets: [
    {
      label: "nuevos",
      data: [12, 18, 14, 20, 27, 10, 8],
      borderColor: "#3b82f6",
      backgroundColor: "#3b82f6",
      tension: 0.4,
      fill: false,
      pointBackgroundColor: "white",
    },
    {
      label: "resueltos",
      data: [7, 14, 15, 17, 22, 9, 7],
      borderColor: "#10b981",
      backgroundColor: "#10b981",
      tension: 0.4,
      fill: false,
      pointBackgroundColor: "white",
    },
  ],
});

const pieData = ref({
  labels: ["Técnico", "Facturación", "Cuenta", "Aplicación", "Otros"],
  datasets: [
    {
      data: [35, 25, 20, 15, 5],
      backgroundColor: ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b"],
      borderWidth: 1,
    },
  ],
});

const chartMode = ref("Circular");
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
