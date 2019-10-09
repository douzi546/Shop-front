export default {
  created() {
    this.getrolesList()
    this.getRightDialog()
  },
  data() {
    return {
      rolesList: [],
      dialogFormVisible: false,
      editForm: {
        id: -1,
        roleName: '',
        roleDesc: '',
      },
      dialogRightTree: false,
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      assignRightId: -1,
    }
  },
  methods: {
    async getrolesList() {
      const res = await this.$http.get("roles")
      // console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.rolesList = data
      }
    },
    async getRightDialog() {
      const res = await this.$http.get(`rights/tree`)
      console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        this.treeList = data
      }
    },
    // delRole(id) {
    //   this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.$message({
    //       type: 'success',
    //       message: '删除成功!'
    //     })
    //     this.$http.delete(`roles/${id}`)
    //       .then(res => {
    //         const { meta } = res.data
    //         if (meta.status === 200) {
    //           const index = this.rolesList.findIndex(item => item.id === id)
    //           this.rolesList.splice(index, 1)
    //         }
    //       })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     });
    //   });
    // },
    async delRole(id) {
      try {
        await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        const res = await this.$http.delete(`roles/${id}`)
        const { meta } = res.data
        if (meta.status === 200) {
          const index = this.rolesList.findIndex(item => item.id === id)
          this.rolesList.splice(index, 1)
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    editRole(editData) {
      this.dialogFormVisible = true
      for (const key in editData) {
        this.editForm[key] = editData[key]
      }
    },
    async submitEditRole() {
      const { id, roleName, roleDesc } = this.editForm
      const res = await this.$http.put(`roles/${id}`, {
        roleName, roleDesc
      })
      const { data, meta } = res.data
      if (meta.status === 200) {
        const currentRoles = this.rolesList.find(item => item.id === id)
        currentRoles.roleDesc = data.roleDesc
        currentRoles.roleName = data.roleName
        this.dialogFormVisible = false
      }
    },
    async delRoleRight(roleId, rightId) {
      const res = await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
      const { data, meta } = res.data
      if (meta.status === 200) {
        const curRole = this.rolesList.find(item => item.id === roleId)
        curRole.children = data
      }
    },
    assignRightDialog(currentRole, id) {
      this.assignRightId = id
      this.dialogRightTree = true
      this.$nextTick(() => {
        const level3Ids = []
        currentRole.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              level3Ids.push(level3.id)
            })
          })
        })
        this.$refs.treeList.setCheckedKeys(level3Ids)
      })

    },
    async submitAssignRight() {
      const getCheckedKeys = this.$refs.treeList.getCheckedKeys()
      const getHalfCheckedKeys = this.$refs.treeList.getHalfCheckedKeys()
      const allCheckedIds = [...getCheckedKeys, ...getHalfCheckedKeys].join(",")
      const res = await this.$http.post(`roles/${this.assignRightId}/rights`, {
        rids: allCheckedIds
      })
      console.log(res)
      if (res.data.meta.status === 200) {
        this.dialogRightTree = false
        this.getrolesList()

      }

    }
  }
}