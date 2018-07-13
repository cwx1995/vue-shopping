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
      <!-- 侧边栏 -->
      <el-aside class="aside" width="200px">
            <el-menu
            :router="true"
            :unique-opened="true"
        class="menu">
        <!-- 一及菜单 -->
        <el-submenu
        v-for="item in menus"
        :key="item.id"
        index="item.id">
            <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
            v-for="item1 in item.children"
            :key="item1.id"
            :index="'/'+item1.path">
                <i class="el-icon-menu"></i>
               {{item1.authName}}
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
  data() {
    return {
      menus: []
    };
  },
  // 判断登录
  // beforeCreate() {
  //   // 从sessionStorage中获取token,看是否存在
  //   const token = sessionStorage.getItem('token');
  //   if (!token) {
  //     // 失败跳转回登录页
  //     this.$router.push({ name: 'login' });
  //     // 提示
  //     this.$message.warning('请先登录');
  //   }
  // },
  created() {
    // 加载当前用户的权限列表
    this.loadData();
  },
  methods: {
    async loadData() {
      const {data: resData} = await this.$http.get('menus');
      const {data, meta: {status, msg}} = resData;
      if (status === 200) {
        this.menus = data;
      }
    },
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
