<script>
export default {
  data () {
    return {
      tipLoginMessage: "",
    }
  },
  methods: {
    throttle (fn, time = 500) {
      let timer1 = null
      let timer2 = null
      let timer3 = null
      let num = 0
      let vm = this
      return function (...args) {
        if (num++ > 5) {
          if (!timer2) {
            this.$message({ type: "warning", message: "操作频繁，请稍后再试" })
            timer2 = setTimeout(() => { timer2 = null }, time)
          }
          timer3 && clearTimeout(timer3)
          timer3 = setTimeout(() => num = 0, time)
        } else if (!timer1) {
          fn.apply(vm, args)
          timer1 = setTimeout(() => { timer1 = null }, time)
        }
      }
    },
    debounce (fn, time = 500) {
      let timer = null
      let vm = this
      return function (...args) {
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
          fn.apply(vm, args)
        }, time)
      }
    },
    message (type = "text", message = "没有消息") {
      this.$message({ type, message })
    },
    isLogin () {
      if (sessionStorage.getItem("authorization")) {
        return true
      } else {
        this.tipLoginMessage("warning", "请登录")
        return false
      }
    }
  },
  created () {
    this.tipLoginMessage = this.throttle(this.message, 3000)
  },
  filters: {
    transtime (value) {
      let res = ""
      let time = new Date(value).getTime()
      let current = new Date().getTime()
      let parallax = (current - time) / 1000
      if (parallax > 24 * 60 * 60) {
        res = new Date(value).toLocaleDateString()
      } else if (parallax > 60 * 60) {
        res = Math.floor(parallax / (60 * 60)) + "小时前"
      } else {
        res = Math.floor(parallax / 60) + "分钟前"
      }
      return res
      console.log(1)
    },
    chatTime: (function () {
      let preTime = null
      return function (value) {
        let date = new Date(value)
        let day = date.toLocaleDateString()
        let time = date.toLocaleTimeString("chnises", { "hour12": false })
        let currentDay = new Date().toLocaleDateString()
        if (preTime && (date.getTime() - preTime.getTime()) < (1000 * 60 * 10) && (date.getTime() - preTime.getTime()) >= 0) {
          return ""
        }
        if (preTime && (preTime.getTime() > date.getTime())) {
          preTime = null
        }
        if (currentDay === day) {
          preTime = date
          return time
        } else {
          preTime = date
          return day + time
        }
      }
    })()
  },
}
</script>
