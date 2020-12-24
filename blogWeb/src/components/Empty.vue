<template>
  <div>
    {{text}}
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "空空如也"
    }
  }
}
</script>

<style lang='scss' scoped>
div {
  height: 50px;
  text-align: center;
  color: #c0c0c0;
  line-height: 50px;
  letter-spacing: 5px;
}
</style>
