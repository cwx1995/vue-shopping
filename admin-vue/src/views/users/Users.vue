<template>
<!-- 卡片 -->
    <el-card class="box-card" >
<!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <el-row class="searchArea">
        <el-col :span="24" >
            <el-input class="searchInput" clearable placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button mini type="success" plain >添加用户</el-button>
        </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
        v-loading="loading"
        stripe
        border
      :data="list"
      style="width: 100%">
      <el-table-column
      mini type="index"
      :index="indexMethod">
    </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        
        label="创建日期">
        <template slot-scope="scope"> 
         {{scope.row.create_time | fmtDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
         width="100"
        label="用户状态">
        <template slot-scope="scope">
            <!-- scope.row  当前行绑定的数据对象-->
            <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
            </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
        <el-button size="mini" plain type="primary" icon="el-icon-edit" ></el-button>
        <el-button size="mini" plain type="danger" icon="el-icon-delete" ></el-button>
        <el-button size="mini" plain type="success" icon="el-icon-check" ></el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
</template>

<script>
export default {
          data() {
        return {
          list:[],
          loading:true
        };
      },
      created(){
          //发送请求获取数据
          this.loadData();
      },
      methods:{
          async loadData(){
              //发送异步请求之前 旋转加载
              this.loading = true;
              //发送请求之前 先获取token
              const token = sessionStorage.getItem('token');
              //在请求头中设置token 查文档找
              this.$http.defaults.headers.common['Authorization'] = token;
              //发送异步请求，获取数据
              const res = await this.$http.get('users?pagenum=1&pagesize=10');
              //发送异步请求之后 取消旋转加载
                  this.loading = false;
              //获取响应数据
              const data = res.data;
              //定义meta中的msg和status
              const{meta:{msg,status}}=data;
              //成功时
              if(status===200){
                  //定义data中的users
                  const {data:{users}}=data;
                  this.list = users;
              }else{
                  //错误提示框
                  this.$message.error(msg);
              }

          }
      }
};
</script>

<style>
.box-card{
    height: 100%;
}
.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}
.searchArea .searchInput {
  width: 350px;
}
</style>
