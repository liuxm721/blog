<template>
  <div class="tip-button">
    <el-button
      :size="size"
      :type="type"
      v-popover:tip
    >{{label}}</el-button>
    <el-popover
      :placement="placement"
      ref="tip"
      v-model="visible"
    >
      <p class="tip-text">确认操作？</p>
      <el-button
        :size="size"
        @click="cancel"
      >取消</el-button>
      <el-button
        :size='size'
        :type="type"
        @click="confirm"
      >确定</el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: '按钮'
    },
    size: {
      type: String,
      default: 'mini'
    },
    placement: {
      type: String,
      defautl: 'top'
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    cancel () {
      this.visible = false
    }
  },
  components: {

  }
}
</script>

<style lang='scss' scoped>
.tip-button {
  display: inline-block;
}
.tip-text {
  margin: 10px 0;
  text-align: center;
}
</style>
