import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ApartmentsView from '../views/ApartmentsView.vue'
import ApartmentDetailsView from '../views/ApartmentDetailsView.vue'
import InvestmentsView from '../views/InvestmentsView.vue'
import InvestmentDetailsView from '../views/InvestmentDetailsView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Strona główna'
    }
  },
  {
    path: '/mieszkania',
    name: 'apartments',
    component: ApartmentsView,
    meta: {
      title: 'Mieszkania'
    }
  },
  {
    path: '/mieszkania/:slug',
    name: 'apartment-details',
    component: ApartmentDetailsView,
    meta: {
      title: 'Szczegóły mieszkania'
    }
  },
  {
    path: '/inwestycje',
    name: 'investments',
    component: InvestmentsView,
    meta: {
      title: 'Inwestycje'
    }
  },
  {
    path: '/inwestycje/:id',
    name: 'investment-details',
    component: InvestmentDetailsView,
    meta: {
      title: 'Szczegóły inwestycji'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: {
      title: 'Nie znaleziono strony'
    }
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

router.afterEach((to) => {
  const pageTitle = to.meta.title

  document.title = pageTitle ? `${pageTitle} - Real Estate` : 'Real Estate'
})

export default router
