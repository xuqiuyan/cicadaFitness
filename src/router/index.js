import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: '/shoplist',
    component: Layout,
    name: 'shopList',
    meta: {
      title: '店铺管理',
      icon: 'shoplist'
    },
    children: [
      {
        path: 'index',
        name: 'shoplist',
        component: () => import('@/views/shoplist/index'),
        meta: { title: '店铺列表' }
      },
      {
        path: 'newOrEdit',
        name: 'shopNewOrEdit',
        component: () => import('@/views/shoplist/newOrEdit/index'),
        meta: { title: '新增/编辑' }
      },
      {
        path: 'detail',
        name: 'shopDetail',
        component: () => import('@/views/shoplist/detail/index'),
        meta: { title: '详情' },
        hidden: true
      }
    ]
  },
  {
    path: '/facilities',
    component: Layout,
    name: 'facilities',
    children: [
      {
        path: 'index',
        name: 'typeList',
        component: () => import('@/views/facilities/typeList/index'),
        meta: { title: '器械管理', icon: 'facilities' }
      },
      {
        path: 'typeList/newOrEdit',
        name: 'facTypeNewOrEdit',
        component: () => import('@/views/facilities/typeList/newOrEdit/index'),
        meta: { title: '新增/编辑' },
        hidden: true
      },
      {
        path: 'typeList/detail',
        name: 'facTypeDetail',
        component: () => import('@/views/facilities/typeList/detail/index'),
        meta: { title: '详情' },
        hidden: true
      },
      {
        path: 'modelList',
        name: 'facModelList',
        component: () => import('@/views/facilities/modelList/index'),
        meta: { title: '型号列表' },
        hidden: true
      },
      {
        path: 'modelList/newOrEdit',
        name: 'facModelNewOrEdit',
        component: () => import('@/views/facilities/modelList/newOrEdit/index'),
        meta: { title: '新增/编辑' },
        hidden: true
      },
      {
        path: 'modelList/detail',
        name: 'facModelDetail',
        component: () => import('@/views/facilities/modelList/detail/index'),
        meta: { title: '详情' },
        hidden: true
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

