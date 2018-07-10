<template>
   <el-container class="container">
    <!-- <el-header class="header">Header</el-header> -->
     <el-header class="header">
      <!-- 栅格系统 -->
      <el-row>
        <el-col :span="2">
          <img class="span-img" src="../assets/logo.png" alt="">
        </el-col>
        <el-col class="middle" :span="20">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="2">
          <a @click.prevent="handleLogout" class="logout" href="#">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
            <el-menu
            :router="true"
            :unique-opened="true"
        class="menu">
        <el-submenu index="1">
            <template slot="title">
            <i class="el-icon-location"></i>
            <span>用户管理</span>
            </template>
            <el-menu-item index="/users">
                <i class="el-icon-menu"></i>
                用户列表
                </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
            <template slot="title">
            <i class="el-icon-location"></i>
            <span>权限管理</span>
            </template>
            <el-menu-item index="/roles">
                <i class="el-icon-menu"></i>
                角色列表
                </el-menu-item>
                <el-menu-item index="/rights">
                <i class="el-icon-menu"></i>
                权限列表
                </el-menu-item>
        </el-submenu>
        <el-submenu index="3">
            <template slot="title">
            <i class="el-icon-location"></i>
            <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
                <i class="el-icon-menu"></i>
                商品列表
                </el-menu-item>
                <el-menu-item index="3-2">
                <i class="el-icon-menu"></i>
                分类参数
                </el-menu-item>
                 <el-menu-item index="3-3">
                <i class="el-icon-menu"></i>
                商品分类
                </el-menu-item>
        </el-submenu>
       <el-submenu index="4">
            <template slot="title">
            <i class="el-icon-location"></i>
            <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
                <i class="el-icon-menu"></i>
                订单列表
                </el-menu-item>
        </el-submenu>
          <el-submenu index="5">
            <template slot="title">
            <i class="el-icon-location"></i>
            <span>数据统计</span>
            </template>
            <el-menu-item index="4-1">
                <i class="el-icon-menu"></i>
                数据报表
                </el-menu-item>
        </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <!-- 匹配的路由组件占位 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 判断登录
  beforeCreate() {
    // 从sessionStorage中获取token,看是否存在
    const token = sessionStorage.getItem('token');
    if (!token) {
      // 失败跳转回登录页
      this.$router.push({ name: 'login' });
      // 提示
      this.$message.warning('请先登录');
    }
  },
  methods: {
    // 退出登录
    handleLogout() {
      // 删除sessionStorage中的token
      sessionStorage.clear();
      // 跳转
      this.$router.push({ name: 'login' });
      // 提示
      this.$message.success('退出成功');
    }
  }
};
</script>

<style>
.container {
  height: 100%;
}
.header .span-img {
  height: 50px;
  margin-left: 50px;
  margin-top: 5px;
}
.header {
  background-color: #b3c0d1;
  padding: 0;
}
.header .middle {
  line-height: 60px;
  color: #fff;
  text-align: center;
}

.header .logout {
  line-height: 60px;
  text-decoration: none;
  color: orange;
}

.aside {
  background-color: #d3dce6;
}

.main {
  background-color: #e9eef3;
}
</style>
