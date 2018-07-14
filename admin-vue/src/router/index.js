import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/login';
import Home from '@/views/Home';
import Users from '@/views/users/Users';
import Rights from '@/views/roles/Rights';
import Roles from '@/views/roles/Roles';
import { Message } from 'element-ui';
import Category from '@/views/goods/Categories';
import GoodsList from '@/views/goods/List';
import GoodsAdd from '@/views/goods/Add';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      // 子路由使用之前，home组件已经创建完毕
      children: [
        // 用户管理列表
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'category',
          path: '/categories',
          component: Category
        },
        {
          name: 'goods-list',
          path: '/goods',
          component: GoodsList
        },
        {
          name: 'goods-add',
          path: 'goods/add',
          component: GoodsAdd
        }
      ]
    }

  ]
});
// 路由的前置守卫
router.beforeEach((to, from, next) => {
  // 判断是不是login 不需要判断
  if (to.name === 'login') {
    next();
  } else {
    // 判断token
    const token = sessionStorage.getItem('token');
    if (!token) {
      // 跳转到登录
      router.push({name: 'login'});
      // 提示
      // MessageBox.alert('请先登录');
      Message.warning('请先登录');
      return;
    }
    next();
  }
});
export default router;
