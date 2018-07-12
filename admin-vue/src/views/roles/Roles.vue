<template>
    <el-card class="box-card">
        <!-- //面包屑组件引用 -->
       <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
        <!-- //添加按钮 -->
    <el-row class="row-add">
        <el-col>
            <el-button>添加角色</el-button>
        </el-col>
    </el-row>
        <!-- 表格 -->
    <el-table
        v-loading="loading"
        class="tb"
        border
        stripe
        :data="list"
        style="width: 100%">
        <!-- 展开列表 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <!-- 一级权限  item1-->
               <el-row  v-for="item1 in scope.row.children"
               :key="item1.id" class="level1">
            <el-col :span="4">
                <el-tag @close="handleClose(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
            </el-col>
            <!-- 二级和三级权限 -->
            <el-col :span="20">
            <el-row v-for="item2 in item1.children"
            :key="item2.id">
                <el-col :span="4"> <el-tag @close="handleClose(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20"><el-tag @close="handleClose(scope.row,item3.id)" class="level3" closable type="warning"
                v-for="item3 in item2.children"
                :key="item3.id">
                {{item3.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
                </el-col>
                </el-row>
            </el-col>
        </el-row>
               <!-- 没有权限的时候 -->
        <el-row v-if="scope.row.children.length===0">
            <el-col :span="24">未分配权限</el-col>
        </el-row>
            </template>
        </el-table-column>
         <el-table-column
            type="index"
            width="50">
        </el-table-column>
        <el-table-column
            prop="roleName"
            label="角色名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="path"
            label="角色描述"
            width="180">
        </el-table-column>
        <el-table-column
            prop="level"
            label="操作">
            <template slot-scope="scope">
                <el-button size="mini"  plain type="primary" icon="el-icon-edit" ></el-button>
                <el-button size="mini"  plain type="danger" icon="el-icon-delete" ></el-button>
                <el-button @click="handleShowRightsDialog(scope.row)" size="mini" plain type="success" icon="el-icon-check" ></el-button>
            </template>
        </el-table-column>
    </el-table>
        <!-- //分配权限对话框 -->
        <el-dialog
            v-loading="loadingTree"
            @open="handleOpenDialog"
            title="分配权限"
            :visible.sync="dialogVisible"
            width="30%">
            <!-- 树形结构
                data: 提供树形数据
                props: 设置数据中显示的属性

                node-key - 给每一个节点一个表示 ，一般绑定id
                当要使用default-expanded-keys和default-checked-keys必须先设置node-key
                default-checked-keys 设置默认选中的节点
            -->
            <el-tree 
            ref="tree"
            :data="treeData" 
            :props="defaultProps"
            show-checkbox
            node-key="id"
            :default-checked-keys="checkedList"
            default-expand-all
             >
             </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSetRights">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
  data(){
      return {
          list:[],
          loading:true,
          //权限对话框显示或者隐藏
          loadingTree: true,
          dialogVisible:false,
          //shuju
          treeData:[],
          //配置展示数据中的属性
          defaultProps:{
              children:'children',
              label:'authName'
          },
          //获取要选的的节点的id
          checkedList:[],
               // 记录当前修改的角色id
         currentRoleId: -1
      };
  },
  created(){
     this.loadData();
  },
  methods:{
      async loadData(){
          this.loading=true;
            // 发送请求之前 先获取token
        //   const token = sessionStorage.getItem('token');
        //   // 在请求头中设置token 查文档找
        //   this.$http.defaults.headers.common['Authorization'] = token;
            //   const res = await this.$http.get('roles');
            const {data:resData}= await this.$http.get('roles');
            this.loading=false;
            const{data,meta:{status,msg}}=resData;
            if(status===200){
                this.list = data;
                //   this.loadData();
            }else{
                this.$message.error(msg);
            }
      },
      //标签关闭
     async handleClose(role,rightId){
        //roleId 角色id、
        //rightid 权限id
       this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        })
        .then(async() => {  
        const{data:resData}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
        const{meta:{status,msg},data} = resData;
        if(status===200){
            // this.loadData();
            //重新绑定当前角色的children 这样用户体验不好
            role.children=data;
            this.$message({
                type: 'success',
                message: '删除成功'
            });
        }else{
            this.$message.error(msg);
        }
        })
        .catch(() => {
            // 点击取消按钮执行
            this.$message({
            type: 'info',
            message: '已取消删除'
            });
        }); 
    },
    async handleOpenDialog(){
        this.loadingTree = true;
        const {data:resData} = await this.$http.get('rights/tree');
        this.loadingTree = false;
        const{data,meta:{status,msg}} = resData;
        this.treeData = data;
        if(status===200){}else{
            this.$message.error(msg);
        }
    },
    handleShowRightsDialog(role){
        // 记录角色id， 分配权限的时候使用
      this.currentRoleId = role.id;
        //点击按钮 显示分配权限的对话框
        this.dialogVisible = true;
        //获取当前角色权限的id
        //便利一级权限
        const arr=[];
         role.children.forEach((item1) => {
        // arr.push(item1.id);
        // 遍历二级权限
        item1.children.forEach((item2) => {
          // arr.push(item2.id);
          // 遍历三级权限
          item2.children.forEach((item3) => {
            arr.push(item3.id);
          });
        });
      });
        this.checkedList = arr;
    },
    //点击确顶按钮 分配权限
    async handleSetRights(){
        //获取全选节点id 
        const checkedKeys = this.$refs.tree.getCheckedKeys();
        //获取半选id
        const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
        //合并数组
        const newArray = [...checkedKeys,...halfCheckedKeys];
        // console.log(newArray);
        const {data:resData} = await this.$http.post(`roles/${this.currentRoleId}/rights`,{
            rids:newArray.join(',')
        });
        const {meta:{status,msg}} = resData;
        if(status===200){
            //关闭对话框
            this.dialogVisible=false;
            //提示
            this.$message.success(msg);
            //重载数据
            this.loadData();
        }else{
            this.$message.error(msg);
        }
    }
  }
};
</script>

<style>
.row-add{
    margin-top: 12px;
    margin-bottom: 8px;
}
.level3{
    margin-right: 5px;
    margin-bottom: 5px;
}
.level1{
    margin-bottom: 10px;
}
</style>
