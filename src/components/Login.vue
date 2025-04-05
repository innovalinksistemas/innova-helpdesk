<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase.js'
import bcrypt from 'bcryptjs'

const role = ref('usuario') // por defecto usuario
const email = ref('')
const password = ref('')
const router = useRouter()


const canvas = ref(null)

onMounted(() => {
  const cnv = canvas.value
  const ctx = cnv.getContext("2d")
  const W = window.innerWidth
  const H = window.innerHeight

  cnv.width = W
  cnv.height = H

  ctx.fillStyle = "#112"
  ctx.fillRect(0, 0, W, H)

  ctx.shadowBlur = 10
  ctx.shadowColor = "white"

  function animate() {
    const x = W * Math.random()
    const y = H * Math.random()
    const r = 2.5 * Math.random()

    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()

    setTimeout(animate, 100)
  }

  animate()
})

const handleLogin = async () => {
  if (role.value === 'usuario') {
    // Validación manual desde la tabla EMPRESAS
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('contact_email', email.value)
      .single()

    if (error || !data) {
      alert('Correo o contraseña incorrectos')
      return
    }

    const passwordMatch = await bcrypt.compare(password.value, data.password)

    if (!passwordMatch) {
      alert('Correo o contraseña incorrectos')
      return
    }

    // Permitir usuario con rol "usuario" o "admin" si seleccionó "usuario"
    const rolesPermitidos = ['usuario', 'admin']
    if (!rolesPermitidos.includes(data.rol)) {
      alert(`Este usuario no tiene permiso para acceder como "${role.value}".`)
      return
    }

    // Guardar sesión y redirigir
    localStorage.setItem('usuario', JSON.stringify(data))
    router.push('/usuarios/home')
  }

  if (role.value === 'tech') {
  // Autenticación con supabase.auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (authError || !authData?.user) {
    alert('Correo o contraseña incorrectos')
    return
  }

  const { user } = authData

  // Buscar perfil en tabla usuarios (usando user.id)
  const { data: tecnico, error: userError } = await supabase
    .from('usuario')
    .select('*')
    .eq('id', user.id)
    .single()

  if (userError || !tecnico) {
    alert('No se encontró el perfil del técnico.')
    return
  }

  const rolesPermitidos = ['tech', 'admin']
  if (!rolesPermitidos.includes(tecnico.rol)) {
    alert('No tienes permisos para acceder como técnico.')
    return
  }

  
  localStorage.setItem('usuario', JSON.stringify(tecnico))

if (tecnico.rol === 'admin') {
  router.push('/admin/dashboard')
} else {
  router.push('/tecnicos/home')
}


}

}






</script>

<template>
  <div class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Canvas background -->
    <canvas ref="canvas" class="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"></canvas>

    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 shadow-xl text-white">
      <h2 class="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

      <!-- Rol -->
      <div class="mb-4">
        <label for="role" class="block font-medium mb-1">Tipo de acceso</label>
        <select v-model="role" id="role" class="w-full p-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 text-white">
          <option value="usuario">Usuario</option>
          <option value="tech">Técnico</option>
        </select>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Correo"
          class="w-full p-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/40"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          class="w-full p-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/40"
        />
        <button
          @click="handleLogin"
          class="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-md font-semibold transition"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
</style>
