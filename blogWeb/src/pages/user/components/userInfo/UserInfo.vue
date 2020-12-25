<template>
  <el-tabs v-model="checkedTab">
    <el-tab-pane
      label="我的信息"
      name="userinfo"
    >
      <el-form label-width="100px">
        <el-form-item label="头像">
          <el-row style="text-align:center;height: 195px">
            <el-upload
              ref="upload"
              :action="uploadUserAvatarUrl"
              name="avatar"
              :auto-upload="false"
              :headers="headers"
              list-type="picture"
              style="width: 100%;"
              :show-file-list="false"
              :on-change="changeAvatar"
              title="点击更换头像"
              :on-success="changeAvatarSuccess"
            >
              <el-avatar
                v-if="preAvatar"
                :size="100"
                :src="preAvatar"
              ></el-avatar>
              <el-avatar
                v-else
                :size="100"
                :src="userInfo.avatar"
              ></el-avatar>
              <div
                slot="tip"
                style="font-size: 12px; color: #c0c0c0"
              >推荐：100像素 × 100像素 支持JPG、PNG等格式，图片需小于2M</div>
            </el-upload>
            <el-button
              v-if="preAvatar"
              type="success"
              size="mini"
              @click="sendChangeAvatar"
            >确定</el-button>
            <el-button
              v-if="preAvatar"
              type="danger"
              size="mini"
              @click="cancelChangeAvatar"
            >取消</el-button>
          </el-row>
        </el-form-item>
        <el-form-item label="用户名：">
          <span style="color: #c0c0c0">{{userInfo.account}}</span>
        </el-form-item>
        <el-form-item label="昵称：">
          <el-input
            :disabled="!isEdit"
            v-model="userInfo.name"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-show="!isEdit"
            @click="changeEdit"
            type="text"
          >编辑</el-button>
          <el-button
            v-show="isEdit"
            type="success"
            @click="sendChange"
          >提交</el-button>
          <el-button
            v-show="isEdit"
            type="danger"
            @click="changeEdit"
          >取消</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import service from "../../../../service/user.js"
export default {
  data () {
    return {
      checkedTab: "userinfo",
      userInfo: "",
      isEdit: false,
      uploadUserAvatarUrl: service.uploadUserAvatar(),
      preAvatar: "",
      headers: { Authorization: sessionStorage.getItem("authorization") }
    }
  },
  methods: {
    initWeb () {

    },
    changeAvatar (file, files) {
      this.preAvatar = file.url
      if (files.length > 1) {
        files.shift()
      }
    },
    changeEdit () {
      this.isEdit = !this.isEdit
    },
    sendChange () {
      let form = { name: this.userInfo.name }
      service.changeUserInfo(form).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.$message({ type: "success", message: "成功" })
          this.changeEdit()
        }
      })
    },
    cancelChangeAvatar () {
      this.preAvatar = ""
    },
    sendChangeAvatar () {
      this.$refs.upload.submit()
    },
    changeAvatarSuccess (res) {
      console.log(res)
      let form = { avatar: service.getImgUrl(res.data.img) }
      service.changeUserAvatar(form).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.$message({ type: "success", message: "修改头像成功" })
          this.preAvatar = ""
          this.userInfo.avatar = form.avatar
        }
      })
    },
    getUserInfo () {
      service.getUserInfo().then(res => {
        let data = res.data
        console.log(data)
        this.userInfo = data.data
      })
    }
  },
  components: {

  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style lang='scss' scoped>
</style>
