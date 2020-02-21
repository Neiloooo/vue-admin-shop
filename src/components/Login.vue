<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>

      <!-- 登陆表单区域 饿了么UI是按需导入,必须导入后才能使用,label-width调节输入框与左面的的距离-->
      <!-- 通过loginForm属性绑定表单 -->
      <!-- ref="loginFormRef"添加表单对象引用名称,获取表单实例对象用 -->
      <el-form
        ref="loginFormRef111"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名,prop="username"加入校验规则,校验规则应该加载item -->
        <el-form-item prop="username">
          <!-- 带图标的输入框,导入第三方图标库 -->
          <!-- 通过loginForm对象属性绑定输入框 -->
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <!-- 带图标的输入框,导入第三方的图标库 -->
          <!-- 通过loginForm对象属性绑定输入框 -->
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //这是登陆表单的数据绑定对象
      loginForm: {
        username: "zx",
        password: "12312"
      },
      //表单验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          //校验规则
          { required: true, message: "请输入登陆名称", trigger: "blur" },
          // 长度校验
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        //验证密码是否合法
        password: [
          //校验规则
          { required: true, message: "请输入登陆密码", trigger: "blur" },
          // 长度校验
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //点击重置按钮,重置登陆表单
    resetLoginForm() {
      console.log(this);
      //调用饿了么UI组件的重置方法,进行表单重置
      this.$refs.loginFormRef111.resetFields();
    },
    login() {
      //预校验,调用validate回调函数预验证,校验传入的参数valid是一个布尔值
      //async 异步调用
      this.$refs.loginFormRef111.validate(async valid => {
        //先判断valid是否为ture,也就是验证是否通过
        //为true应该发起请求,否则应该直接返回跳出
        if (!valid) return;
        //axios发起http请求,url是login,请求携带的请求参数对象为loginForm
        //await配合异步调用使用的关键字,且只能在asyc的配合下使用
        //重命名data为res,打印
        const {data: res} = await this.$http.post("login", this.loginForm);
        if(res.meta.status !=200)
        return this.$message.error("登陆失败!");
        this.$message.success("登陆成功!")
        //1将登陆成功之后的token,保存到客户端的sessionStorage中
        //1.1项目中除了登陆之外的其他API接口,必须在登陆之后才能访问
        //1.2token只应该在当前网站打开期间生效,所以将token保存到sessionStorage中
        window.sessionStorage.setItem("token",res.data.token);
        //2.通过编程式导航跳转到后台主页,路由地址是/home
        this.$router.push("/home");





      });
    }
  }
};
</script>

// 组件样式应该只美化自己的组件,scoped的作用
<style lang="less" scoped>
.login_container {
  background-color: rgb(3, 43, 53);
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: rgb(255, 255, 255);
  border-radius: 3px;
  // 绝对定位,把盒子放在绝对中间的位置
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

// 图片盒子
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid rgb(124, 125, 128);
  // 盒子圆角
  border-radius: 50%;
  //盒子间距
  padding: 10px;
  // 盒子阴影
  box-shadow: 0 0 10px #362f2f;
  position: absolute;
  left: 50%;
  //左右与上下的移动
  transform: translate(-50%, -50%);
  //盒子的背景,也就是上半圆背景
  background-color: aliceblue;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgb(143, 143, 143);
  }
}

//饿了么UI套件表单样式控制
.login_form {
  //距离底部对齐
  position: absolute;
  bottom: 0%;
  //宽度对齐100
  width: 100%;
  //偏移20px,且必须在box的border内
  padding: 0% 20px;
  box-sizing: border-box;
}

//按钮样式控制
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>