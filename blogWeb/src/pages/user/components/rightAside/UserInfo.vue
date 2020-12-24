<template>
  <el-row
    class="container"
    v-if="info"
  >
    <div class="avatar">
      <el-avatar
        :size="150"
        :src="avatar"
      ></el-avatar>
    </div>
    <div class="name">{{name}}</div>
    <el-divider></el-divider>
    <el-row
      type="flex"
      justify="space-around"
      class="info"
    >
      <div>文章<div>{{info.articleNum}}</div>
      </div>
      <div>点赞<div>{{info.fanNum}}</div>
      </div>
      <div>粉丝<div>{{info.articleNum}}</div>
      </div>
      <div>关注<div>{{info.followNum}}</div>
      </div>
    </el-row>

  </el-row>
</template>
<script>
import service from "../../../../service/user.js"
export default {
  data () {
    return {
      name: sessionStorage.getItem("name"),
      avatar: sessionStorage.getItem("avatar"),
      info: ""
    }
  },
  methods: {
    getUserZone () {
      service.getUserZone().then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.info = data.data
        }
      })
    }
  },
  mounted () {
    this.getUserZone()
  },
}
</script>
<style lang="scss" scoped>
.container {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
}
.avatar {
  margin-bottom: 10px;
  text-align: center;
  width: 100%;
}
.name {
  text-align: center;
}
.info {
  font-size: 12px;
  color: #c0c0c0;
  text-align: center;
}
</style>