<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb class="user-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框和添加用户 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="searchStr" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain @click="dialogAddVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-table :data="userList" stripe>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="电话" width="180">
      </el-table-column>
      <el-table-column prop="role_name" label="角色" width="180">
      </el-table-column>
      <el-table-column label="用户状态" width="180">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeStatus(scope.row.id,scope.row.mg_state)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="dialogEditVisible(scope.row)"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="delUser(scope.row.id)"></el-button>
          <el-button type="success" plain size="mini" @click="assignRole(scope.row)">
            <i class="el-icon-check"></i> 分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background layout="prev, pager, next" :total="total" :pageSize="pageSize" :currentPage.sync="currentPage" @current-change="curPage">
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogAddVisible" @close="closeAddUserDialog">
      <el-form :model="addUserMsg" :rules="rules" ref="addUserMsg">
        <el-form-item label="用户名" :label-width="formAddWidth" prop="username">
          <el-input v-model="addUserMsg.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formAddWidth" prop="password">
          <el-input v-model="addUserMsg.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formAddWidth">
          <el-input v-model="addUserMsg.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formAddWidth">
          <el-input v-model="addUserMsg.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="EditVisible">
      <el-form :model="editUserMsg" :rules="editRules" ref="editUserMsg">
        <el-form-item label="用户名" :label-width="formEditWidth">
          <el-input :value="editUserMsg.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formEditWidth" prop="email">
          <el-input v-model="editUserMsg.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formEditWidth" prop="mobile">
          <el-input v-model="editUserMsg.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EditVisible = false">取 消</el-button>
        <el-button type="primary" @click="subEditUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormAssignRole">
      <el-form :model="assignRoleLists">
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="assignRoleLists.name" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色列表" label-width="120px">
          <el-select v-model="assignRoleLists.roleId" placeholder="请选择">
            <el-option v-for="role in this.roleLists" :key="role.id" :label="role.roleName" :value="role.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAssignRole = false">取 消</el-button>
        <el-button type="primary" @click="subAssignRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
// import axios from 'axios'
export default {
  created() {
    this.getUserList()
    this.getRoleList()
  },
  data() {
    return {
      userList: [],
      pageSize: 3,
      total: 10,
      currentPage: 1,
      searchStr: '',
      dialogAddVisible: false,
      addUserMsg: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formAddWidth: '120px',
      rules: {
        username: [
          { required: true, message: '用户名为必填项', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur' }
        ]
      },
      EditVisible: false,
      editUserMsg: {},
      formEditWidth: '120px',
      editRules: {
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          {
            pattern: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ]
      },
      dialogFormAssignRole: false,
      assignRoleLists: {
        name: '',
        userId: -1,
        roleId: -1
      },
      roleLists: []
    }
  },
  methods: {
    async getUserList(currentPage = 1) {
      const res = await this.$http.get('/users', {
        params: {
          pagenum: currentPage,
          pagesize: this.pageSize,
          query: this.searchStr
        }
        // headers: {
        //   Authorization: localStorage.getItem('token')
        // }
      })
      console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      }
    },
    curPage(curP) {
      this.getUserList(curP)
    },
    search() {
      this.currentPage = 1
      this.getUserList()
    },
    async changeStatus(id, newstatus) {
      const res = await this.$http.put(`users/${id}/state/${newstatus}`)
      const { meta } = res.data
      if (meta.status === 200) {
        this.$message({
          message: '设置状态成功',
          type: 'success',
          duration: 1500
        })
      } else {
        this.$message({
          message: meta.msg,
          type: 'error'
        })
      }
    },
    submitAddUser() {
      this.$refs.addUserMsg.validate(valid => {
        if (valid) {
          this.$http.post('/users', this.addUserMsg).then(res => {
            console.log(res)
            const { meta } = res.data
            if (meta.status === 201) {
              this.dialogAddVisible = false
              this.currentPage = 1
              this.getUserList()
            }
          })
        } else {
          return false
        }
      })
    },
    closeAddUserDialog() {
      this.$refs.addUserMsg.resetFields()
    },
    delUser(id) {
      this.$confirm('确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete(`/users/${id}`).then(res => {
            const { meta } = res.data
            if (meta.status === 200) {
              // const index = this.userList.findIndex(item => item.id === id)
              // this.userList.splice(index, 1)
              this.getUserList(this.currentPage)
              const totalPage = Math.ceil((this.total - 1) / this.pageSize)
              if (this.currentPage > totalPage) {
                this.getUserList(--this.currentPage)
              }
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    dialogEditVisible(editData) {
      this.EditVisible = true
      this.editUserMsg = editData
    },
    subEditUser() {
      this.$refs.editUserMsg.validate(valid => {
        if (valid) {
          const { id, mobile, email } = this.editUserMsg
          this.$http
            .put(`users/${id}`, {
              mobile,
              email
            })
            .then(res => {
              console.log(res)
              const { data, meta } = res.data
              if (meta.status === 200) {
                this.EditVisible = false
                const updateUser = this.userList.find(item => item.id === id)
                updateUser.mobile = data.mobile
                updateUser.eamil = data.eamil
                this.$message({
                  message: '用户信息修改成功',
                  type: 'success'
                })
              }
            })
        } else {
          return false
        }
      })
    },
    async getRoleList() {
      const res = await this.$http.get('roles')
      console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.roleLists = data
      }
    },
    async assignRole(user) {
      this.dialogFormAssignRole = true
      this.assignRoleLists.name = user.username
      this.assignRoleLists.userId = user.id
      const res = await this.$http.get(`users/${user.id}`)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.assignRoleLists.roleId = data.rid
        if (data.rid === -1) {
          this.assignRoleLists.roleId = ''
        }
      }
    },
    async subAssignRole() {
      const { userId, roleId } = this.assignRoleLists
      const res = await this.$http.put(`users/${userId}/role`, {
        rid: roleId
      })
      if (res.data.meta.status === 200) {
        this.dialogFormAssignRole = false
        this.getUserList(this.currentPage)
      }
    }
  }
}
</script>

<style>
.user-breadcrumb {
  line-height: 40px;
  background-color: #d4dae0;
  font-size: 16px;
  padding-left: 10px;
}
</style>
