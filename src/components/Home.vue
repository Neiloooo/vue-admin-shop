<template>
  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header height="150px">
      <div>
        <img src="../assets/KCHT.jpg" />
        <span>KCHT云智慧数据平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏,折叠栏的时候width不能写死,要根据是否折叠进行变化 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠栏,折叠展开按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 unique-opened可以同时打开不同的菜单, :collapse="true"折叠效果,参数为布尔值(绑定属性改变效果)-->
        <!-- :router="true"以二级index作为路径连接跳转,我们可以将其设置为path,以形成点击后跳转到我们想要的组件的效果 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 1级菜单,遍历查询出的的后端的一级菜单数据,:index="item.id+ ''"给出每个遍历出来的模板一个唯一的值
          以此来单独控制菜单,且要字符串-->
          <el-submenu :index="item.id+ ''" v-for="item in menulist" :key="item.id">
            <!-- 1级菜单的模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 绑定动态文本-->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单,二级菜单的for循环遍历 :index="'/'+subItem.path"以url作为二级菜单的唯一id,进行跳转 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <!-- 2级菜单的模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-s-claim"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体,放入子组件wlcome -->
      <el-main>
        <!-- 放入子组件wlcome的占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //左侧菜单树,数据库查出,不同权限不一样,定义的空数组
      menulist: [],
      //个性化图标
      iconsObj: {
        //怎样个性化图标?拿从数据库取出来的菜单名的id当key,引入图标当值
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      //是否折叠,默认值
      isCollapse: false,
      //被激活的连接地址
      activePath: ''
    };
  },

  created() {
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout() {
      //清除sessionStorage中的token,并且重定向到登陆页
      window.sessionStorage.clear();
      this.$router.push("/login");
    },

    //去后端查询,获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      // 失败就提示失败信息
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      //成功就将数据赋值给组件的私有data
      this.menulist = res.data;
    },
    //点击按钮,切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //保存连接的激活状态,也就是当前path
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath',activePath);
      //每次调用该函数的时候将属性中的activePath刷新
      this.activePath=activePath;
    }
  }
};
</script>

<style lang="less" scoped>
//为布局组件添加背景颜色
.el-header {
  background-color: rgb(44, 40, 40);
  // 左右贴边布局
  display: flex;
  justify-content: space-between;
  padding-bottom: -50;
  //右侧按钮的控制
  align-items: center;
  color: rgb(255, 255, 255);
  font-size: 20px;
  > div {
    //对div再进行flex布局
    display: flex;
    align-items: center;
    //让文字与左面的图片有距离
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: aliceblue;
}
//让这个布局充满全屏
.home-container {
  height: 100%;
}
//对图标类样式的统一控制,与右面提供10间距
.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: aliceblue;
  text-align: center;
  //竖线之间的像素间隔
  letter-spacing: 0.2em;
  //鼠标放上去变成手
  cursor: pointer;
}
</style>