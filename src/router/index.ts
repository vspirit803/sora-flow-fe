import { nextTick } from '@vue/composition-api';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import { ApplicationRecordCollectionTasksService } from '@/service';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
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
  //组织用户
  {
    path: '/organization/accounts',
    name: 'OrganizationAccounts',
    component: () => import(/* webpackChunkName: "organization" */ '@/views/Organization/Accounts.vue'),
  },
  //组织部门
  {
    path: '/organization/departments',
    name: 'OrganizationDepartments',
    component: () => import(/* webpackChunkName: "organization" */ '@/views/Organization/Departments.vue'),
    props: true,
  },
  //应用列表
  {
    path: '/applications',
    name: 'Applications',
    component: () => import(/* webpackChunkName: "application" */ '@/views/Application/Applications.vue'),
    children: [
      //应用详情
      {
        path: ':id',
        name: 'Application',
        component: () => import(/* webpackChunkName: "application" */ '@/views/Application/Application.vue'),
        props: true,
      },
      {
        path: '',
        name: 'NoApplication',
        component: () => import(/* webpackChunkName: "application" */ '@/views/Application/NoApplication.vue'),
      },
    ],
  },
  //表单设计
  {
    path: '/form-design/:id',
    name: 'FormDesigner',
    component: () => import(/* webpackChunkName: "form" */ '@/views/Form/FormDesigner.vue'),
    props: true,
  },
  //表单填写
  {
    path: '/form-fill/:id',
    name: 'FormFiller',
    component: () => import(/* webpackChunkName: "form" */ '@/views/Form/FormFiller.vue'),
    props: true,
  },
  //待办任务
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import(/* webpackChunkName: "task" */ '@/views/Tasks.vue'),
  },
  //待办任务
  {
    path: '/application-record-report/:task',
    name: 'ApplicationRecordReport',
    component: () => import(/* webpackChunkName: "task" */ '@/views/ApplicationRecordReport.vue'),
    props: true,
  },
  //应用数据收集任务
  {
    path: '/application-record-collection/:id',
    name: 'ApplicationRecordCollectionTask',
    props: true,
    beforeEnter: (to, _, next) => {
      nextTick(() => {
        ApplicationRecordCollectionTasksService.getApplicationRecordCollectionTaskInfo(to.params.id).then(
          ({ data }) => {
            next({ name: 'ApplicationRecordReport', params: { task: data.task.id } });
          },
        );
      });
    },
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export default router;
