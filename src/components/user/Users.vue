<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 使用栅格布局对其进行盒子化布局 ,:gutter="20"两个格子之间的间距 -->
      <el-row :gutter="20">
        <!-- 这样搜索框就有了7个格子的固定宽度 -->
        <el-col :span="7">
          <!-- 搜索与添加区 v-model="queryInfo.query绑定属性
          按钮绑定单击事件调用接口去数据库查询
          单击清空按钮会立即调用clear方法-->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible= true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 :data="userlist"绑定数据源,
       label="姓名"绑定表头
       prop="username" 绑定列表中的具体属性键值
       label="index" 添加索引列
      -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="type">
          <!-- 作用域插槽,可以获取当前行的数据,再讲数据传递给el开关即可
          当改变时会调用change回调方法,我们只需要自定义回调方法,向数据库修改数据即可-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <!-- 作用域插槽,可以获取当前行的数据 -->
          <template slot-scope="scope">
            <!-- 嵌入按钮和悬停提示 -->
            <el-button type="primary" round size="mini" @click="showEditDialog(scope.row.id)">修改</el-button>

            <el-tooltip
              class="item"
              effect="dark"
              :enterable="false"
              content="删除用户,要小心啊"
              placement="top"
            >
              <el-button type="danger" round size="mini" @click="removeUserById(scope.row.id)">删除</el-button>
            </el-tooltip>

            <el-button type="warning" round size="mini">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加用户的对话框
      :visible.sync用来控制对话框的显示与隐藏 布尔值
      -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="adddialogClosed">
        <!-- 对话框内容主体区,带校验功能的表单
        ref="addUserFormRef"为表单的引用-->
        <el-form
          :model="addUserForm"
          :rules="addUserFormRules"
          ref="addUserFormRef"
          label-width="70px"
        >
          <!-- prop="name"为验证规则属性,单个校验表单输入框 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>

          <!-- prop="password"为验证规则属性,单个校验表单输入框 -->
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>

          <!-- prop="email"为验证规则属性,单个校验表单输入框 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>

          <!-- prop="mobile"为验证规则属性,单个校验表单输入框 -->
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 对话框底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>

          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框  -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <!-- 对话框内容主体区,带校验功能的表单
        ref="addUserFormRef"为表单的引用-->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <!--disabled表示禁用  -->
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>

          <!-- prop="email"为验证规则属性,单个校验表单输入框 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>

          <!-- prop="mobile"为验证规则属性,单个校验表单输入框 -->
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog- footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱的规则 rule规则,value传入的参数,cb为回调函数
    var CheckEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmial = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (regEmial.test(value)) {
        //合法的邮箱直接返回
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };

    //验证手机号规则
    var checkMobile = (rule, value, cb) => {
      //验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        //合法的直接返回
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };

    return {
      //获取用户列表的参数,参数要与接口名能对应上
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2
      },
      //定义接受的查询出来的用户信息数组
      userlist: [],
      //定义总数
      total: 0,
      //定义增加用户对话框的是否显示
      addDialogVisible: false,
      //添加用户的表单数据
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //修改用户使用的表单对象,默认定义空对象即可
      editForm: {},
      //添加表单的验证规则对象
      addUserFormRules: {
        //required 是否必须, message为提示信息 trigger验证时机
        username: [
          //内容校验规则
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          //长度校验规则
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3-10个字符之间",
            trigger: "blur"
          }
        ],
        //required 是否必须, message为提示信息 trigger验证时机
        password: [
          //内容校验规则
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          //长度校验规则
          {
            min: 6,
            max: 15,
            message: "用户密码的长度在6-15个字符之间",
            trigger: "blur"
          }
        ],
        //required 是否必须, message为提示信息 trigger验证时机
        email: [
          //内容校验规则
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          //合法性验证需要给validator制定验证回调函数
          {
            validator: CheckEmail,
            trigger: "blur"
          }
        ],
        //required 是否必须, message为提示信息 trigger验证时机
        mobile: [
          //内容校验规则
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          //长度校验规则
          {
            min: 11,
            max: 11,
            message: "用户手机号必须是11位",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },
      //控制修改对话框的显示与隐藏
      editDialogVisible: false,
      editFormRules: {
        //required 是否必须, message为提示信息 trigger验证时机
        email: [
          //内容校验规则
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          //合法性验证需要给validator制定验证回调函数
          {
            validator: CheckEmail,
            trigger: "blur"
          }
        ],
        //required 是否必须, message为提示信息 trigger验证时机
        mobile: [
          //内容校验规则
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          //长度校验规则
          {
            min: 11,
            max: 11,
            message: "用户手机号必须是11位",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      }
    };
  },

  created() {
    this.getUserList();
  },

  methods: {
    //调用接口分页查询用户,参数为data中定义的
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取用户列表失败");
      }
      //将后端返回的数据保存到vue实例的data中
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      //当前每页显示发生改变的时候,需要将改变后的值传给data属性的每页显示
      //再次发起请求,去后台获取数据
      //这样才能实现,切换每页显示的时候,数据同样发生改变的效果
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    //监听修改状态,向后端发送请求修改数据
    //拼接动态参数使用模板字符串,从作用域插槽对象中获取当前行的数据,传递给后端
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status != 200) {
        // 将用户修改的按钮状态再修改回去
        userinfo.mg_state != userinfo.mg_state;
        return this.$message.error("更新用户状态失败!");
      }
      this.$message.success("更新用户状态成功");
    },
    //监听添加用户对话框的关闭事件,关闭后重置表单
    //拿到引用调用resetFields即可
    adddialogClosed() {
      this.$refs.addUserFormRef.resetFields();
    },

    //点击按钮添加新用户
    addUser() {
      //预校验,回调函数会有一个传入的参数
      this.$refs.addUserFormRef.validate(async valid => {
        //如果校验成功vaild返回trure,如果校验失败,vaild返回false1
        //这里如果vaild失败直接返回,不再继续往下走
        if (!valid) return;
        //校验成功,可以发起添加用户的网络请求
        const { data: res } = await this.$http.post("users", this.addUserForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        //隐藏添加用户的对话框
        this.addDialogVisible = false;
        //重新获取用户列表数据
        this.getUserList();
      });
    },

    //展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.editForm = res.data;
      //展示修改用户对话框
      this.editDialogVisible = true;
    },

    //监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息预验证并提交 当校验通过,valid为true
    //当校验失败,valid为false
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        //发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败!");
        }
        //关闭对话框
        this.editDialogVisible = false;
        //刷新数据列表
        this.getUserList();
        //提示修改成功
        this.$message.success("更新用户信息成功");
      });
    },
    async removeUserById(id) {
      //根据id删除对应的用户信息
      //1.弹框询问是否删除数据
      const confrimResult = await this.$confirm(
        "此操作将永久删除该用户给, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
        //如果用户点击取消则报出异常,这里抓住异常并且直接了异常
      ).catch(err => err);
      //如果用户确认删除,则返回值为字符串confirm
      //如果用户取消了删除,则返回值为字符串cancle
      console.log(confrimResult);
      if (confrimResult !== "confirm") {
        return this.$message.info("已经取消了删除");
      }
       const{data:res}=await this.$http.delete('users/'+id)
        if(res.meta.status !==200){
          return this.$message.error('删除用户失败!')
        }
      this.$message.success("删除用户成功");
      this.getUserList();
    }
  }
};
</script> 

<style lang="less" scoped>
</style>