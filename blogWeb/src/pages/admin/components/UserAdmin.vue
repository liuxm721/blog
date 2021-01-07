<template>
  <div>
    用户管理
  </div>
</template>

<script>
import service from '../../../service/admin.js'
export default {
  name: 'useradmin',
  data () {
    return {

    }
  },
  methods: {
    getAllUser () {
      service.getAllUser().then(res => {
        let data = res.data
        console.log(data)
      })
    }
  },
  components: {

  },
  mounted () {
    this.getAllUser()
  },
}
</script>

<style lang='scss' scoped>
</style>
