<template>
  <el-form
    :model="form"
    ref="form"
    :rules="rules"
  >
    <el-form-item prop="account">
      <el-input
        v-model="form.account"
        placeholder="账号"
      ><i
          class="iconfont icon-yonghuming"
          slot="prepend"
        ></i></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="form.password"
        placeholder="密码"
        type="password"
      ><i
          class="iconfont icon-shurumima"
          slot="prepend"
        ></i></el-input>
    </el-form-item>
    <el-row
      type="flex"
      justify="space-between"
    >
      <el-link
        :underline="false"
        @click="register"
      >没有账号？注册</el-link>
      <el-link
        type="danger"
        :underline="false"
        @click="resetPassword"
      >忘记密码</el-link>
    </el-row>
    <el-form-item>
      <el-button
        @click="submit"
        type="primary"
      >登录</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import service from "@/service/login.js"
export default {
  data () {
    return {
      form: {
        account: "",
        password: "",
      },
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { type: "email", message: "请输入正确邮箱", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    }
  },
  methods: {
    register () {
      this.$router.push("/register")
    },
    resetPassword () {
      this.$router.push("validator")
    },
    reset () {
      this.$refs.form.resetFields()
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          service.login(this.form).then((res) => {
            let data = res.data
            console.log(data)
            if (res.data.status) {
              sessionStorage.setItem("authorization", res.headers.authorization)
              this.$message({ message: "登录成功", type: "success" })
              setTimeout(() => window.location.replace("/"), 500)
            } else {
              this.$message({ message: res.data.message, type: "warning", })
            }
          })

        }
      })
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/font/iconfont.css";
.el-form-item {
  margin-top: 50px;
}
</style>