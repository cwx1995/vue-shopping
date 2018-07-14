<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>

    <el-row class="row-add">
      <el-col :span="24">
        <el-button
          type="success"
          plain
          @click="handleShowAdd">添加分类</el-button>
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
        treeKey 绑定到id，给每一个节点设置一个唯一值
        parentKey 绑定到父id属性，区分父子节点
        levelKey 绑定到层级的属性
        childKey 绑定到存储子元素的属性
       -->
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        :indentSize="30">
      </el-tree-grid>
      <!-- <el-table-column
        prop="cat_name"
        label="分类名称"
        width="180">
      </el-table-column> -->
      <el-table-column
        label="级别"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有效">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '无效' : '有效' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" @click="handleShowEdit(scope.row)"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
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

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addFormDialog">
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
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /添加分类对话框 -->

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editFormDialog">
      <el-form :model="editForm" ref="addForm">
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="editForm.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
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
      loading: true,
      // 分页数据
      pagenum: 1,
      pagesize: 5,
      total: 0,
      addFormDialog: false,
      addForm: {
        cat_name: ''
      },
      selectedOptions2: [],
      options: [],
      editFormDialog: false,
      editForm: {
        cat_name: ''
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载列表数据
    async loadData() {
      this.loading = true;
      const { data: resData } = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;
      const { data: { result, total } } = resData;
      this.list = result;
      // 获取总条数
      this.total = total;
    },
    // 分页方法
    handleSizeChange(val) {
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    /**
     * 处理弹出添加分类对话框
     */
    async handleShowAdd () {
      this.addFormDialog = true;
      // 获取商品分类数据绑定到级联选择器中
      const res = await this.$http.get('/categories', {
        params: {
          type: 2
        }
      });
      this.options = res.data.data;
    },
    /**
     * 处理添加分类
     */
    async handleAdd () {
      const formData = {
        ...this.addForm,
        cat_pid: this.selectedOptions2[this.selectedOptions2.length - 1],
        cat_level: this.selectedOptions2.length
      };
      const res = await this.$http({
        url: '/categories', // 请求路径
        method: 'post', // method 指定请求方法
        params: {}, // 查询字符串 ?xxx=xxx
        data: formData // data 指定 post 请求体
      });
      if (res.data.meta.status === 201) {
        // 隐藏添加分类对话框
        this.addFormDialog = false;
        // 清空表单数据
        this.$refs['addForm'].resetFields();
        this.selectedOptions2 = []; // 手动清空级联选择器组件选择的状态
        // 重新加载列表数据
        this.loadData();
        this.$message({
          message: '添加成功',
          type: 'success'
        });
      } else {
        this.$message({
          message: '添加失败',
          type: 'warning'
        });
      }
    },
    /**
     * 处理删除分类
     */
    handleDelete (cat) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http({
          url: `/categories/${cat.cat_id}`,
          method: 'delete'
        });
        const { data, meta } = res.data;
        if (meta.status === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          // 重新加载数据
          this.loadData();
        } else {
          this.$message({
            message: '删除失败',
            type: 'warning'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /**
     * 处理显示编辑分类弹框
     */
    handleShowEdit (cat) {
      this.editForm = cat;
      this.editFormDialog = true;
    },
    /**
     * 处理编辑
     */
    async handleEdit () {
      const { cat_id, cat_name } = this.editForm;
      const res = await this.$http({
        url: `/categories/${cat_id}`,
        data: {
          cat_name
        },
        method: 'put'
      });
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.$message({
          type: 'success',
          message: '更新成功'
        });
        // 重新加载数据
        this.loadData();
        this.editFormDialog = false;
      } else {
        this.$message({
          type: 'warning',
          message: '更新失败'
        });
      }
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
