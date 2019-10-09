<template>
  <el-container class="home-wrapper">
    <el-header>
      <el-row>
        <el-col :span="8">
          <div class="logo">
            <img src="@/assets/logo.png" alt="">
          </div>
        </el-col>
        <el-col :span="8">
          <div class="title">超级无敌后台管理系统</div>
        </el-col>
        <el-col :span="8">
          <div class="welcome">
            <span>欢迎这位超级无敌会员</span>
            <a href="javascript:;" @click="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :router="true">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/home/user">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>用户列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <template>
              <el-menu-item index="/home/right">
                <i class="el-icon-menu"></i>
                <span>权限列表</span>
              </el-menu-item>
            </template>
            <template>
              <el-menu-item index="/home/role">
                <i class="el-icon-menu"></i>
                <span>角色列表</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    logout() {
      this.$confirm('你确定要退出吗?', '提示', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style scoped lang="less">
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  padding: 0;
}
.logo {
  text-align: left;
}
.title {
  color: #fff;
  font-size: 36px;
  font-weight: bold;
  line-height: 60px;
}
.welcome {
  line-height: 60px;
  text-align: right;
  padding-right: 40px;
  span {
    font-weight: bold;
  }
  a {
    color: #ea5303;
  }
}

.el-aside {
  background-color: #545c64;
  color: #333;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}

.home-wrapper {
  height: 100%;
}
.menu-item-group {
  padding: 0;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
