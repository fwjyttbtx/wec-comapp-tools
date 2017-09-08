<template>
    <el-row class="tools-menu-page">
      <el-col :span="4" class="tools-menu-col">
        <el-menu default-active="properties" class="tools-menu" theme="light" :router="true">
          <el-menu-item index="properties">系统配置</el-menu-item>
          <el-menu-item index="cache">缓存管理</el-menu-item>
        </el-menu>
      </el-col>
      <el-col class="el" :span="20">
        <router-view></router-view>
      </el-col>
    </el-row>
</template>

<script>

  export default {
      methods: {
      },
      created() {
          this.$router.replace("/properties");
      }
  }

</script>
<style>
  body {
    margin: 0;
    padding: 0;
  }
  html,
  body,
  .tools-menu-page,
  .tools-menu-col,
  .tools-menu {
    height: 100%;
  }
</style>