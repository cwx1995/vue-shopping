export default {
  data() {
    return {
      list: [],
      loading: true,
      // 分页相关数据
      pagenum: 1, // 页码
      pagesize: 2, // 每页条数
      total: 0, // 总共的数据条数，从服务器获取
      // 绑定搜索文本框
      searchValue: '',
      // 控制添加用户的对话框显示或者隐藏
      addUserDialogVisible: false,
      // 绑定表单数据
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单的验证规则
      formRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      },
      // 控制编辑用户的对话框显示或者隐藏
      editUserDialogVisible: false,
      // 控制分配角色对话框的显示或者隐藏
      setRoleDialogVisible: false,
      // 分配角色数据
      currentUserName: '',
      currentRoleId: -1,
      roles: [],
      currentUserId: ''
    };
  },
  created() {
    // 发送请求获取数据
    this.loadData();
  },
  methods: {
    // 分页事件
    handleSizeChange(val) {
      // 每页条数改变的时候
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // 页码改变的时候
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },

    async loadData() {
      // 发送异步请求之前 旋转加载
      this.loading = true;
      // 发送请求之前 先获取token
      // const token = sessionStorage.getItem('token');
      // // 在请求头中设置token 查文档找
      // this.$http.defaults.headers.common['Authorization'] = token;
      // 发送异步请求，获取数据
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`);
      // 发送异步请求之后 取消旋转加载
      this.loading = false;
      // 获取响应数据
      const data = res.data;
      // 定义meta中的msg和status
      const {meta: {msg, status}} = data;
      // 成功时
      if (status === 200) {
        // 定义data中的users
        const {data: {users, total}} = data;
        this.list = users;
        // 获取总共多少条数据
        this.total = total;
      } else {
        // 错误提示框
        this.$message.error(msg);
      }
    },
    // 搜索按钮
    handleSearch() {
      this.loadData();
    },
    // 状态修改按钮
    async handleSwitchChange(user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      // 响应对象 res = { data, status }
      // 服务器返回的数据格式 res.data  = { data: {}, meta: {} }
      const data = res.data;
      const {meta: {status, msg}} = data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 包裹 await 的函数都需要加上async
        // 点击确定按钮执行
        const res = await this.$http.delete(`users/${id}`);
        // 服务器返回的数据
        const data = res.data;
        // meta内部的status和msg
        const {meta: {status, msg}} = data;
        if (status === 200) {
          // 跳回第一页
          this.pagenum = 1;
          this.loadData();
          // 删除成功 重新加载数据
          this.$message({
            type: 'success',
            message: 'msg'
          });
        } else {
          this.$message.error(msg);
        }
      }).catch(() => {
        // 点击取消按钮执行
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 添加用户的对话框中的确定按钮，要执行添加用户的操作
    async handleAdd() {
      // 表单的 DOM对象 this.$refs.myform
      this.$refs.myform.validate(async(valid) => {
        if (!valid) {
          return this.$message.error('请完整输入内容');
        }
        // 验证成功
        const res = await this.$http.post('users', this.formData);
        // 相当于回调函数中的处理
        const data = res.data;
        const {meta: {status, msg}} = data;
        if (status === 201) {
          // 添加成功
          // 隐藏对话框
          this.addUserDialogVisible = false;
          this.$message.success(msg);
          this.loadData();
          // 清空文本框的值
          // for (let key in this.formData) {
          //   this.formData[key] = '';
          // }
        } else {
          this.$message.error(msg);
        }
      });
    },
    // 点击编辑按钮，弹出编辑的对话框
    handleShowEditDialog(user) {
      // 显示对话框
      this.editUserDialogVisible = true;
      // 文本框显示用户信息
      //  this.formData = user;
      this.formData.username = user.username;
      this.formData.email = user.email;
      this.formData.mobile = user.mobile;
      this.formData.id = user.id;
    },
    // 编辑用户
    async handleEdit() {
      // 发送请求之前 先获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中设置token 查文档找
      this.$http.defaults.headers.common['Authorization'] = token;
      const res = await this.$http.put(`users/${this.formData.id}`, {
        mobile: this.formData.mobile,
        email: this.formData.email
      });
        // 解析数据
      const data = res.data;
      const {meta: {status, msg}} = data;
      if (status === 200) {
        // 提示成功
        this.$message.success(msg);
        // 关闭弹窗
        this.editUserDialogVisible = false;
        // 重载列表
        this.loadData();
        // 清空文本框
        //  for(let key in this.formData){
        //    this.formData[key]='';
        //  }
      } else {
        this.$message.error(msg);
      }
    },
    // 对话框关闭执行 清空内容
    handleClosed() {
      for (let key in this.formData) {
        this.formData[key] = '';
      }
    },
    async handleShowSetRoleDialog(user) {
      // 存储用户id
      this.currentUserId = user.id;
      this.currentUserName = user.username;
      this.setRoleDialogVisible = true;
      const res = await this.$http.get('roles');
      this.roles = res.data.data;
      // 显示对应的角色
      // 根据用户id查询用户对象 角色id
      const res1 = await this.$http.get(`users/${user.id}`);
      // console.log(res1);
      this.currentRoleId = res1.data.data.rid;
    },
    // 分配角色
    async handleSetRole() {
      const res = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRoleId
      });
      const data = res.data;
      const {meta: {status, msg}} = data;
      if (status === 200) {
        this.$message.success(msg);
        // 关闭弹出框
        this.setRoleDialogVisible = false;
        // 重置数据
        this.currentUserName = '';
        this.currentRoleId = -1;
        this.currentUserId = -1;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
