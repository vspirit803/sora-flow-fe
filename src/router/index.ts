import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Login.vue'),
  },
  {
    path: '/system/menus',
    name: 'SystemMenus',
    component: () => import(/* webpackChunkName: "system" */ '@/views/System/Menu.vue'),
  },
  {
    path: '/system/roles',
    name: 'SystemRoles',
    component: () => import(/* webpackChunkName: "system" */ '@/views/System/Roles.vue'),
  },
  {
    path: '/system/accounts',
    name: 'SystemAccounts',
    component: () => import(/* webpackChunkName: "system" */ '@/views/System/Accounts.vue'),
  },
  {
    path: '/system/versions',
    name: 'SystemVersions',
    component: () => import(/* webpackChunkName: "system" */ '@/views/System/Versions.vue'),
  },
  {
    path: '/system/organizations',
    name: 'SystemOrganizations',
    component: () => import(/* webpackChunkName: "system" */ '@/views/System/Organizations.vue'),
  },
  //组织相关
  {
    path: '/organization/home',
    name: 'Organization',
    component: () => import(/* webpackChunkName: "organization" */ '@/views/Organization.vue'),
  },
  {
    path: '/organization/accounts',
    name: 'OrganizationAccounts',
    component: () => import(/* webpackChunkName: "organization" */ '@/views/Organization/Accounts.vue'),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
