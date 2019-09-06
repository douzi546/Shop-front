<template>
  <div class="loginForm">
    <el-row type="flex" class="row-bg" justify="center" align="middle">
      <el-col :span="6" class="login-content">

        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="top" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">登录</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名为必填项', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      axios
        .post('http://localhost:8888/api/private/v1/login', this.loginForm)
        .then(res => {
          console.log(res)
          const { data, meta } = res.data
          if (meta.status === 200) {
            localStorage.setItem('token', data.token)
            this.$router.push('home')
          } else {
            this.$message({
              showClose: true,
              message: meta.msg,
              type: 'error',
              duration: 2000
            })
          }
        })
    },
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.login()
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>
<style>
.loginForm {
  background-color: #282c34;
}
#app {
  width: 100%;
  height: 100%;
}

.loginForm,
.row-bg {
  height: 100%;
}
.login-content {
  background-color: #fff;
  padding: 25px 30px;
  border-radius: 10px;
  min-width: 300px;
}
</style>
