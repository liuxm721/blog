<template>
  <el-row>
    <el-col :span="2">
      <el-input :value="type"></el-input>
    </el-col>
    <el-col :span="2">
      <el-input :value="label"></el-input>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ['type', 'label'],
  data () {
    return {

    }
  },
  methods: {

  },
  components: {

  }
}
</script>

<style lang='scss' scoped>
</style>
