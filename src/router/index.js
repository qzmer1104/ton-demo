import { createRouter, createWebHistory } from 'vue-router'

const routesMobile = [{
  path: '/',
  name: 'index',
  redirect: '/home',
  component: ()=> import("../pages/layout.vue"),
  children:[
    {
      path: '/home',
      name: 'home',
      component: () => import('../pages/home.vue')
    }
  ]
}]
const routes = routesMobile

const router = createRouter({
  history: createWebHistory("/"),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  }
})
router.beforeEach((to, from, next) => {
  next();
});

router.afterEach(() => {
});
export default router
