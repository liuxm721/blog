<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button
        size="mini"
        type="primary"
        @click="addClassfiy"
      >新增</el-button>
    </div>
    <el-table :data="types">
      <el-table-column
        label="键"
        prop="type"
        v-slot='scope'
      >
        <el-row v-if='!types[scope.$index].editable'>{{scope.row.type}}</el-row>
        <el-input
          v-else
          v-model="scope.row.type1"
          size="mini"
        ></el-input>
      </el-table-column>
      <el-table-column
        label="值"
        prop="label"
        v-slot='scope'
      >
        <el-row v-if='!types[scope.$index].editable'>{{scope.row.label}}</el-row>
        <el-input
          v-else
          v-model="scope.row.label1"
          size="small"
        ></el-input>
      </el-table-column>
      <el-table-column
        label="操作"
        v-slot='scope'
      >
        <div v-if='!types[scope.$index].editable'>

          <el-button
            size='mini'
            @click="edit(scope.$index)"
          >编辑</el-button>
          <TipButton
            size='mini'
            label='删除'
            type='danger'
            placement='top'
            @confirm="deleteClassify(scope.$index, scope.row)"
          ></TipButton>
        </div>
        <div v-else>
          <el-button
            size="mini"
            type='warning'
            @click="cancel(scope.$index)"
          >取消</el-button>
          <el-button
            size="mini"
            type='success'
            @click="confirm(scope.$index)"
          >确定</el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import service from '../../../service/admin.js'
import Classify from './Classify'
import TipButton from '../../../components/TipButton'
import { v4 } from 'uuid'

export default {
  data () {
    return {
      types: []
    }
  },
  methods: {
    edit (index) {
      this.types[index].editable === undefined ? this.$set(this.types[index], 'editable', true) : this.types[index].editable = true
      this.types[index].type1 === undefined ? this.$set(this.types[index], 'type1', this.types[index].type) : this.types[index].type1 = this.types[index].type
      this.types[index].label1 === undefined ? this.$set(this.types[index], 'label1', this.types[index].label) : this.types[index].label1 = this.types[index].label
    },
    addClassfiy () {
      this.types.push({ classify_id: '', type: '', type1: '', label: '', label1: '', editable: true })
    },
    cancel (index) {
      this.types[index].editable = false
      if (!this.types[index].type && !this.types[index].label) {
        this.types.splice(index, 1)
      }
    },
    confirm (index) {
      if (this.types[index].type1 && this.types[index].label1) {
        this.types[index].classify_id = v4()
        let form = {
          classify_id: this.types[index].classify_id,
          type: this.types[index].type1,
          label: this.types[index].label1
        }
        service.addArticleClassify(form).then(res => {
          let data = res.data
          console.log(data)
          if (data.status) {
            this.types[index].type = this.types[index].type1
            this.types[index].label = this.types[index].label1
            this.types[index].editable = false
            this.$message({ type: 'success', message: '添加成功' })
          }
        })
      }
    },
    deleteClassify (index, row) {
      console.log(row)
      let form = { classify_id: row.classify_id }
      service.deleteArticleClassify(form).then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.$message({ type: 'success', message: '删除成功' })
          this.types.splice(index, 1)
        }
      })
    },
    getArticleType () {
      service.getArticleType().then(res => {
        let data = res.data
        console.log(data)
        if (data.status) {
          this.types = data.data.types
        }
      })
    }
  },
  components: {
    Classify,
    TipButton
  },
  mounted () {
    this.getArticleType()
  },
}
</script>

<style lang='scss' scoped>
</style>
