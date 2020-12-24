<template>
  <div>

    <el-form
      :model="form"
      :rules="rules"
      ref="form"
    >
      <el-form-item prop="account">
        <el-input
          v-model="form.account"
          placeholder="邮箱"
          disabled
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

      <el-form-item prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          placeholder="再次输入密码"
          type="password"
        ><i
            class="iconfont icon-shurumima"
            slot="prepend"
          ></i></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          @click="submit"
          type="primary"
        >修改</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import service from "@/service/login.js"
export default {
  data () {
    let passwordEq = (rule, value, cb) => {
      if (this.form.password === this.form.confirmPassword) { cb() }
      else { cb(new Error("密码不一致")) }
    }
    return {
      form: {
        account: sessionStorage.getItem("account"),
        password: "",
        confirmPassword: "",
      },
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 32, message: "密码至少6位", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: passwordEq, trigger: "blur" }
        ],
      }
    }
  },
  computed: {},
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let form = { password: this.form.password }
          service.resetPassword(form).then(res => {
            let data = res.data
            console.log(data)
            if (data.status) {
              this.$message({ type: "success", message: data.message })
              setTimeout(() => {
                window.location.replace("/")
              }, 1000)
            }
          })
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    service.getUserAccount().then(res => {
      let data = res.data
      console.log(data)
      if (data.status) {
        sessionStorage.setItem("account", data.data.account)
        next()
      } else {
        next("/login")
      }
    })
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/font/iconfont.css";
.el-form-item {
  margin-top: 50px;
}
</style>