<template>
  <div>
    <el-row>
      <el-col
        :span="6"
        class="chat-list"
      >
        <el-row
          v-for="(item, index) in chats"
          :key="index"
        >
          <el-button
            @click="chat(item.key, index)"
            type="text"
          >
            <el-avatar :src="item.avatar"></el-avatar>
            <el-badge :value="item.unread?item.unread:''">

              <div class="name">{{item.name}}</div>
              <div class="content">{{item.last && item.last.content}}</div>
            </el-badge>
          </el-button>
        </el-row>
      </el-col>
      <el-col :span="18">
        <div>标题</div>
        <v-infinite-scroll
          class="chat-record-content"
          :loading="loadingChatRecord.isLoading"
          @top="loadChatRecord"
          :onTopScrollsToBottom="false"
        >
          <el-divider v-if="loadingChatRecord.noMore">没有更多了</el-divider>
          <el-divider v-if="loadingChatRecord.loading">加载中...</el-divider>
          <el-row
            v-for="(item, index) in chatContent"
            :key="index"
          >
            <div class="time"> {{item.time | chatTime}}</div>
            <el-avatar
              id="avatar"
              :src="user[item.sender].avatar"
              :style="{float: float[item.sender]}"
            ></el-avatar>
            <span
              id="message"
              :style="{float: float[item.sender]}"
            >{{item.content}}</span>
          </el-row>
        </v-infinite-scroll>
        <el-row>
          <el-form
            :model="chatMsgForm"
            :rules="rules"
            ref="form"
          >
            <el-form-item prop="content">
              <el-input
                type="textarea"
                rows="5"
                resize="none"
                maxlength="500"
                v-model="chatMsgForm.content"
                :disabled="!$route.query.key"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row
          type="flex"
          justify="end"
        >
          <span class="tips">{{chatMsgForm.content.length}}/500</span>
          <el-button
            @click="sendMessage"
            type="primary"
          >发送</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import service from "../../../../service/user.js"
import Tool from "@/components/Tool.vue"
import config from "../../../../config.js"

export default {
  mixins: [Tool],
  data () {
    return {
      chats: [],
      ws: null,
      loadingChatRecord: {
        loading: false,
        isLoading: false,
        noMore: false,
        page: 1,
        pageSize: 10,
      },
      chatContent: [],
      float: { slef: "right", other: "left" },
      elContent: "",
      user: {
        slef: "",
        other: "",
      },
      chatMsgForm: {
        from: "",
        to: "",
        type: "chat",
        content: ""
      },
      rules: {
        content: {
          validator: (rule, value, cb) => { if (this.chatMsgForm.content) { cb() } else { cb(new Error("消息不能为空")) } },
          trigger: "blur"
        }
      }
    }
  },
  methods: {
    chat (key, index) {
      this.$router.push({ path: "/interaction", query: { tab: 3, key } })
      this.chats[index].unread = 0
    },
    onOpen () {
      this.$message({ type: "success", message: "已进入聊天室" })
    },
    onClose () {
      this.$message({ type: "waring", message: "已退出聊天室" })
    },
    onError (key) {
      this.ws = new WebSocket("wss://shop.weiaiyanyan.com/chat?key=" + key)
      this.$message({ type: "danger", message: "连接失败，重连中..." })
    },
    onMessage (event) {
      let data = JSON.parse(event.data)
      if (data.from === this.chatMsgForm.to) {
        this.chatContent.push({ content: data.content, sender: "other", time: new Date() })
        this.$nextTick(() => {
          this.elContent.scrollTop = this.elContent.scrollHeight
        })
        for (let i in this.chats) {
          if (data.from === this.chats[i].to) {
            this.chats[i].last.content = data.content
            this.chats.unshift(this.chats.splice(i, 1)[0])
          }
        }
      } else {
        let exist = false
        for (let i in this.chats) {
          if (data.from === this.chats[i].to) {
            this.chats[i].unread++
            this.chats[i].last.content = data.content
            this.chats.unshift(this.chats.splice(i, 1)[0])
            exist = true
          }
        }
        if (!exist) {
          service.getOtherUserInfo({ key: data.from }).then(res => {
            let user = res.data
            console.log(user)
            if (user.status) {
              this.chats.unshift({
                to: data.from,
                avatar: user.data.avatar,
                key: user.data.key,
                last: { sender: "other", content: data.content },
                name: user.data.name,
                unread: 1
              })
            }
          })
        }
      }
    },
    initWebSocket (key) {
      this.ws = new WebSocket(config.chatURL + key)
      this.ws.addEventListener("message", this.onMessage)
      this.ws.addEventListener("open", this.onOpen)
      this.ws.addEventListener("close", this.onClose)
      this.ws.addEventListener("error", this.onError, key)
      this.heartCheck(key)
    },
    heartCheck (key) {
      setInterval(() => {
        console.log("再也不掉线了")
        if (this.ws.readyState === 1) {
          this.ws.send(JSON.stringify({ message: 'ping' }))
        } else {
          this.initWebSocket(key)
        }
      }, 1000 * 56)
    },
    sendMessage () {
      this.$refs.form.validate(vlid => {
        if (vlid) {
          console.log(this.chatMsgForm)

          let form = { record: this.chatMsgForm }
          service.sendMessage(form).then(res => {
            let data = res.data
            console.log(data)
            this.chatContent.push({ content: this.chatMsgForm.content, sender: "slef", time: new Date() })
            this.ws.send(JSON.stringify(this.chatMsgForm))
            this.$nextTick(() => {
              this.elContent.scrollTop = this.elContent.scrollHeight
              this.chatMsgForm.content = ""
            })
          })
        }
      })
    },
    getChatRecord (key) {
      let params = { key }
      service.getChatRecord(params).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.user.other = data.data.chats.to
          this.user.slef = data.data.chats.from
          this.chatMsgForm.to = data.data.chats.to.key
          this.chatMsgForm.from = data.data.chats.from.key
          this.chatContent = data.data.chats.record
          this.$nextTick(() => {
            this.elContent.scrollTop = this.elContent.scrollHeight
          })
        } else {
          this.chats.unshift(data.data.chats.to)
          this.user.other = data.data.chats.to
          this.user.slef = data.data.chats.from
          this.chatMsgForm.to = data.data.chats.to.key
          this.chatMsgForm.from = data.data.chats.from.key
        }
      })
    },
    getChatList () {
      let params = {}
      this.$route.query.key && (params.key = this.$route.query.key)
      service.getChatList(params).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.chats = data.data.chats
        }
      })
    },
    loadChatRecord () {
      console.log(1)
      this.loadingChatRecord.loading = true
      this.loadingChatRecord.isLoading = true
      let params = { key: this.$route.query.key, page: ++this.loadingChatRecord.page, pageSize: this.loadingChatRecord.pageSize }
      service.getChatRecord(params).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          let chazhi = this.elContent.scrollHeight
          this.chatContent.unshift(...data.data.chats.record)
          this.$nextTick(() => {
            this.elContent.scrollTop = this.elContent.scrollHeight - chazhi
          })
          this.loadingChatRecord.loading = false
          this.loadingChatRecord.noMore = data.data.noMore || false
          this.loadingChatRecord.isLoading = data.data.noMore || false
        }
      })
    }
  },
  watch: {
    $route (to) {
      if (to.query.key) {
        this.getChatRecord(to.query.key)
        this.chatMsgForm.to = to.query.key
      }
    }
  },
  components: {

  },
  mounted () {
    this.elContent = document.querySelector(".chat-record-content")
    this.getChatList()
    this.initWebSocket(sessionStorage.getItem("key"))
    this.$route.query.key && this.getChatRecord(this.$route.query.key)
    this.chatMsgForm.from = sessionStorage.getItem("key")
    this.chatMsgForm.to = this.$route.query.key
  },
  beforeDestroy () {
    this.ws.close()
  },
}
</script>

<style lang='scss' scoped>
.chat-list {
  height: 784px;
  overflow: auto;
  .el-button {
    width: 100%;
    text-align: left;
    padding: 10px 0;
  }
  .el-badge {
    height: 40px;
    width: 80px;
    vertical-align: top;
    .name {
      font-weight: bolder;
      margin-bottom: 10px;
    }
    .content {
      color: #c0c0c0;
    }
  }
}
.chat-record-content {
  height: 500px;
  overflow: auto;
  border: 2px solid #f4f5f6;
  padding: 20px;
  margin: 20px 0;
  .el-row {
    margin: 10px 0;
  }
  .time {
    text-align: center;
    font-size: 12px;
    color: #c0c0c0;
  }
  #message {
    box-sizing: border-box;
    margin: 0 10px;
    min-height: 40px;
    max-width: 40%;
    background-color: #409eff;
    padding: 10px;
    border-radius: 10px;
    word-wrap: break-word;
  }
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: rgba(144, 147, 153, 0.3);
  }
}
.tips {
  margin-right: 20px;
  color: #c0c0c0;
  line-height: 40px;
  font-size: 12px;
}
::v-deep textarea {
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: rgba(144, 147, 153, 0.3);
  }
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-scrollbar {
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
