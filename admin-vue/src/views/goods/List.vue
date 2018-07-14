<template>
    <el-card class="box-card">
        <my-breadcrumb level1="商品管理" level2="商品列表"> </my-breadcrumb>
        <el-row class="row-add">
            <el-col :span="24">
                <el-button  @click="$router.push({name: 'goods-add'})" type="success" plain>添加商品</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-table
        v-loading="loading"
        stripe
        border
        :data="list"
        style="width: 100%">
        <!-- tree grid
+        treeKey 绑定到id，给每一个节点设置一个唯一值
+        parentKey 绑定到父id属性，区分父子节点
+        levelKey 绑定到层级的属性
+        childKey 绑定到存储子元素的属性
+       -->
         <el-table-column
        type="index"
        width="50">
        </el-table-column>
        <el-table-column
            prop="goods_name"
            label="商品名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="goods_price"
            label="商品价格"
            width="180">
        </el-table-column>
        <el-table-column
            prop="goods_weight"
            label="商品重量"
            width="180">
        </el-table-column>
        <el-table-column
            prop="add_time"
            label="创建时间"
            width="180">
        <template slot-scope="scope">
          {{ scope.row.add_time | fmtDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
        </el-table>
           <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
       <!-- 添加分类 -->
    <!-- <el-dialog title="添加分类" :visible.sync="addFormDialog">
      <el-form :model="addForm" ref="addForm">
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="addForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="100px">
          <el-cascader
            expand-trigger="hover"
            :options="options"
            change-on-select
            :props="{
              label: 'cat_name',
              value: 'cat_id',
              children: 'children'
            }"
            v-model="selectedOptions2">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormDialog = false">取 消</el-button>
        <el-button  type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
     <! //添加分类  -->
    <!-- 编辑分类对话框 -->
    <!-- <el-dialog title="编辑分类" :visible.sync="editFormDialog">
      <el-form :model="editForm" ref="addForm">
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="editForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog> -->
    <!-- /编辑分类对话框 -->

    </el-card>
</template>

<script>
// 1. npm install element-tree-grid
// 2. 引入组件
// 3. 局部注册组件
import ElTreeGrid from 'element-tree-grid';
export default {
  data() {
    return {
      list: [],
      // 分页数据
      pagenum: 1,
      pagesize: 5,
      total: 0,
      // 读条
      loading: true

    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      const { data: resData } = await this.$http({
        url: '/goods',
        method: 'get',
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      this.loading = false;
      const { data } = resData;
      this.list = data.goods;
      // 获取总条数
      this.total = data.total;
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    }
  },
  components: {
    ElTreeGrid
  }
};
</script>

<style>
.row-add {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
