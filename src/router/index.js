import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ApartmentsView from '../views/ApartmentsView.vue'
import ApartmentDetailsView from '../views/ApartmentDetailsView.vue'
import InvestmentsView from '../views/InvestmentsView.vue'

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
  },
  {
    path: '/inwestycje',
    name: 'investments',
    component: InvestmentsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

export default router
