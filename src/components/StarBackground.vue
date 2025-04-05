<!-- src/components/StarBackground.vue -->
<template>
    <canvas ref="canvas" class="absolute top-0 left-0 w-screen h-full z-0"></canvas>
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  
  const canvas = ref(null);
  
  onMounted(() => {
    const cnv = canvas.value;
    const ctx = cnv.getContext("2d");
  
    const W = window.innerWidth;
    const H = window.innerHeight;
    cnv.width = W;
    cnv.height = H;
  
    ctx.fillStyle = "#112";
    ctx.fillRect(0, 0, W, H);
    ctx.shadowBlur = 10;
    ctx.shadowColor = "white";
  
    function animate() {
      const x = W * Math.random();
      const y = H * Math.random();
      const r = 2.5 * Math.random();
  
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
  
      setTimeout(animate, 100);
    }
  
    animate();
  });
  </script>
  
  <style scoped>
  canvas {
    pointer-events: none;
  }
  </style>
  