import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import UserHome from '../components/Usuarios/UserHome.vue'
import TecnicoHome from '../components/Tecnicos/Dashboard.vue'
import TicketDetalleView from '../components/Tecnicos/TicketView.vue'
import AdminDashboard from '../components/Tecnicos/Admin/AdminDashboard.vue' // ✅ NUEVO
import UserDashboard from '../components/Usuarios/UserDashboard.vue'
import UserTicketDetalle from '../components/Usuarios/TicketUserView.vue'
import EquipmentDashboard from '../components/Tecnicos/Equipment/EquipmentDashboard.vue'
import AdminClientes from '../components/Tecnicos/Admin/AdminClientes.vue'
import AsignarTickets from '../components/Tecnicos/Admin/AsignarTicket.vue'
import AsignarTicketView from '../components/Tecnicos/Admin/AsignarTicketView.vue'
const routes = [
  { path: '/', name: 'Login', component: Login },
  { 
    path: '/usuarios/home', 
    name: 'UserHome', 
    component: UserHome,
    meta: { requiresAuth: true, role: 'usuario' }
  },
  { 
    path: '/tecnicos/home', 
    name: 'TecnicoHome', 
    component: TecnicoHome,
    meta: { requiresAuth: true, role: 'tech' }
  },
  {
    path: '/tecnicos/tickets/:id',
    name: 'TicketDetalle',
    component: TicketDetalleView
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' } // ✅ Protección de ruta
  },
  {
    path: '/usuarios/dashboard',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true, role: 'usuario' }
  },
  {
    path: '/usuarios/tickets/:id',
    name: 'UserTicketDetalle',
    component: UserTicketDetalle,
    meta: { requiresAuth: true, role: 'usuario' }
  },
  {
    path: '/admin/EquipmentDashboard',
    name: 'EquipmentDashboard',
    component: EquipmentDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/clientes',
    name: 'AdminClientes',
    component: AdminClientes,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/asignar',
    name: 'AsignarTickets',
    component: AsignarTickets,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/asignarticket/:id',
    name: 'AsignarTicketView',
    component: AsignarTicketView,
    meta: { requiresAuth: true, role: 'admin' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔐 Protección global de rutas
router.beforeEach((to, from, next) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  if (to.meta.requiresAuth) {
    if (!usuario) {
      // No hay sesión
      return next({ path: '/' })
    }

    // Validar rol
    if (to.meta.role && usuario.rol !== to.meta.role) {
      alert('No tienes permisos para acceder a esta sección.')
      return next({ path: '/' })
    }
  }

  next()
})

export default router
