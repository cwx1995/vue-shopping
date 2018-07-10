<template>
    <el-card class="box-card">
        <!-- //面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
<!-- //表格 -->
    <el-table
        border
        stripe
        :data="list"
        style="width: 100%">
        <el-table-column
            prop="date"
            label="日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="address"
            label="地址">
        </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {

};
</script>

<style>
.box-card{
    height: 100%;
}
</style>
