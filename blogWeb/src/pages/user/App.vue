<template>
  <router-view></router-view>
</template>
<script>
export default {
  mounted() {},
  data() {
    return {}
  },
  methods: {
    change(file, fileList) {
      this.imgUrl = file.url;
    },
    preview() {
      console.log("preview")
    },
  },
};
</script>
<style lang="scss">
$color: #fff;
body {
  background-color: $color;
}
</style>