<template>

  <div>
    <el-form
      :model="form"
      :rules="rules"
      ref="form1"
    >
      <el-form-item prop="account">
        <el-input
          v-model="form.account"
          placeholder="邮箱"
        ><i
            class="iconfont icon-yonghuming"
            slot="prepend"
          ></i></el-input>
      </el-form-item>
    </el-form>
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
    >

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

      <el-form-item prop="verifyCode">
        <el-input
          v-model="form.verifyCode"
          placeholder="验证码"
          type="text"
          style="width: 200px"
          :disabled="!editVerifyCodeAble"
        ><i
            class="el-icon-document-copy"
            slot="prepend"
          ></i></el-input>
        <el-button
          @click="getVerifyCode"
          type="text"
          :disabled="!getVerifyCodeAble"
        >
          <span v-show="!getVerifyCodeAble">{{getVerifyCodeTimer}} s 后再试</span>
          <span v-show="getVerifyCodeAble">获取验证码</span>

        </el-button>
      </el-form-item>

      <el-link
        :underline="false"
        @click="login"
      >已有账号？登录</el-link>

      <el-form-item>
        <el-button
          @click="submit"
          type="primary"
        >注册</el-button>
        <el-button @click="reset">重置</el-button>
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
    let userExist = (rule, value, cb) => {
      service.userExist({ account: value }).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) { cb(new Error(data.message)) }
        else { cb() }
      })
    }
    let validVerifyCode = (rule, value, cb) => {
      service.validRegisterVerifyCode({ verifyCode: value, account: this.form.account }).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) { cb() }
        else { cb("验证码无效") }
      })
    }
    return {
      form: {
        account: "",
        password: "",
        confirmPassword: "",
        verifyCode: "",
      },
      getVerifyCodeAble: true,
      getVerifyCodeTimer: 60,
      editVerifyCodeAble: false,
      rules: {
        account: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确邮箱", trigger: "blur" },
          { validator: userExist, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 32, message: "密码至少6位", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: passwordEq, trigger: "blur" }
        ],
        verifyCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { validator: validVerifyCode, trigger: "blur" }
        ]
      }
    }
  },
  computed: {},
  methods: {
    login () {
      this.$router.push("/login")
    },
    reset () {
      this.$refs.form.resetFields()
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          service.register(this.form).then((res) => {
            let data = res.data
            console.log(data)
            if (data.status) {
              this.$message({ message: "注册成功", type: "success" })
              sessionStorage.setItem("authorization", res.headers.authorization)
              setTimeout(() => window.location.replace("/"), 500)
            }
          })
        }
      })
    },
    getVerifyCode () {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          let form = { account: this.form.account }
          service.getRegisterVerifyCode(form).then(res => {
            let data = res.data
            console.log(data)
            if (data.status) {
              this.$message({ type: "success", message: data.message })
              this.getVerifyCodeAble = !this.getVerifyCodeAble
              this.editVerifyCodeAble = true
              let timer = setInterval(() => {
                if (!--this.getVerifyCodeTimer) {
                  clearInterval(timer)
                  this.getVerifyCodeTimer = 60
                  this.getVerifyCodeAble = !this.getVerifyCodeAble
                }
              }, 1000)
            } else {
              this.$message({ type: "danger", message: data.message })
            }
          })
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
@import "../../../assets/font/iconfont.css";
.el-form-item {
  margin-top: 50px;
}
</style>