<template>
  <div>
      <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods:{
    logout(){
      //清除sessionStorage中的token,并且重定向到登陆页
       window.sessionStorage.clear()
       this.$router.push('/login')
    }
  }
}
</script>

<style>

</style>