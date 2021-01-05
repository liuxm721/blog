<template>
  <div>
    文章审核
    <el-table :data="articleList">
      <el-table-column
        width="55"
        type="selection"
      ></el-table-column>
      <el-table-column
        label="标题"
        prop="title"
      ></el-table-column>
      <el-table-column
        label="时间"
        prop="time"
      ></el-table-column>
      <el-table-column
        label="操作"
        v-slot="scope"
      >
        <el-button
          size="mini"
          type="primary"
          @click="pass(scope.$index)"
        >通过</el-button>
        <el-button
          size="mini"
          type="danger"
          @click.stop="fail(scope.$index)"
        >不通过</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articleList: [
        { title: "1", time: "2021年1月4日16:36:59" },
        { title: "1", time: "2021年1月4日16:36:59" },
      ]
    }
  },
  methods: {
    fail (index) {
      console.log(index)
      this.articleList.splice(index, 1)
    },
    pass (index) {

    }
  },
  components: {

  }
}
</script>

<style lang='scss' scoped>
</style>
