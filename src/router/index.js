import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ApartmentsView from '../views/ApartmentsView.vue'
import ApartmentDetailsView from '../views/ApartmentDetailsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/mieszkania',
    name: 'apartments',
    component: ApartmentsView
  },
  {
    path: '/mieszkania/:slug',
    name: 'apartment-details',
    component: ApartmentDetailsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
