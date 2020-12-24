<template>
  <div>

    <el-form
      :model="form"
      ref="form1"
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

    </el-form>
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
    >
      <el-form-item prop="verifyCode">
        <el-input
          v-model="form.verifyCode"
          placeholder="验证码"
          style="width: 200px"
          :disabled="!editValidCodeAble"
        ><i
            class="el-icon-document-copy"
            slot="prepend"
          ></i></el-input>
        <el-button
          type="text"
          @click="getValidCode"
          :disabled="!getValidCodeAble"
        >
          <span v-if="getValidCodeAble">获取验证码</span>
          <span v-else>{{getValidCodeNum}} s 后再获取</span>
        </el-button>
      </el-form-item>

      <el-form-item>
        <el-button
          @click="submit"
          type="primary"
        >验证</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import service from "@/service/login.js"

export default {
  data () {
    let userExist = (rule, value, cb) => {
      service.userExist({ account: value }).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) { cb() }
        else { cb("用户不存在") }
      })
    }
    return {
      form: {
        account: "",
        verifyCode: "",
      },
      editValidCodeAble: false,
      getValidCodeAble: true,
      getValidCodeNum: 60,
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { type: "email", message: "请输入正确邮箱", trigger: "blur" },
          { validator: userExist, trigger: "blur" }

        ],
        verifyCode: [{ required: true, message: "验证码", trigger: "blur" }],
      },
    }
  },
  methods: {

    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          service.validResetPasswordVerifyCode(this.form).then(res => {
            let data = res.data
            console.log(res)
            sessionStorage.setItem("authorization", res.headers.authorization)
            this.$router.push("/reset")
          })

        }
      })
    },
    getValidCode () {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          let params = { account: this.form.account }
          service.getResetPasswordVerifyCode(params).then(res => {
            let data = res.data
            console.log(data)
            if (data.status) {
              this.$message({ type: "success", message: data.message })
              this.editValidCodeAble = true
              this.getValidCodeAble = !this.getValidCodeAble
              let timer = setInterval(() => {
                if (!--this.getValidCodeNum) {
                  clearInterval(timer)
                  this.getValidCodeAble = !this.getValidCodeAble
                  this.getValidCodeNum = 60
                }
              }, 1000)
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