import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { apartments } from '../data/apartments'
import { investments } from '../data/investments'

const ApartmentsView = () => import('../views/ApartmentsView.vue')

const ApartmentDetailsView = () => import('../views/ApartmentDetailsView.vue')

const InvestmentsView = () => import('../views/InvestmentsView.vue')

const InvestmentDetailsView = () => import('../views/InvestmentDetailsView.vue')

const PurchaseCalculatorView = () =>
  import('../views/PurchaseCalculatorView.vue')

const NotFoundView = () => import('../views/NotFoundView.vue')

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
      title: (to) => {
        const apartment = apartments.find((item) => {
          return item.slug === to.params.slug
        })

        return apartment
          ? `Mieszkanie ${apartment.number}`
          : 'Szczegóły mieszkania'
      }
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
      title: (to) => {
        const investment = investments.find((item) => {
          return item.id === to.params.id
        })

        return investment?.name ?? 'Szczegóły inwestycji'
      }
    }
  },
  {
    path: '/kalkulator-kosztow-zakupu',
    name: 'purchase-calculator',
    component: PurchaseCalculatorView,
    meta: {
      title: 'Kalkulator kosztów zakupu'
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

    if (to.hash) {
      return {
        el: to.hash,
        top: 88,
        behavior: 'smooth'
      }
    }

    const onlyQueryChanged = to.path === from.path && to.hash === from.hash

    if (onlyQueryChanged) {
      return false
    }

    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

router.afterEach((to) => {
  const pageTitle =
    typeof to.meta.title === 'function' ? to.meta.title(to) : to.meta.title

  document.title = pageTitle ? `${pageTitle} - Real Estate` : 'Real Estate'
})

export default router
