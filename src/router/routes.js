const routes = [
  {
    path: '/',
    component: () => import('pages/Test_vue.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
