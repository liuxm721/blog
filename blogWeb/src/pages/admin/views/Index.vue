<template>
  <div>
    <el-header>

    </el-header>
    <el-container>
      <el-aside width="210px">
        <el-menu
          @select="selectMenu"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          class="fill-height"
        >
          <el-submenu
            v-for="(item, key) in menus"
            :key="key"
            :index="key"
          >
            <template slot="title">
              <span>{{item.label}}</span>
            </template>
            <el-menu-item
              v-for="(item, key) in item.subMenus"
              :key="key"
              :index="key"
            >{{item}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-tabs
          @tab-remove="removeTab"
          :value="checkedTab"
        >
          <el-tab-pane
            label="站点数据"
            name="SiteData"
          >
            <SiteData></SiteData>
          </el-tab-pane>
          <el-tab-pane
            v-for="(item, key) in tabs"
            :key="key"
            closable
            :label="item"
            :name="key"
          >
            <component :is="key"></component>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import SiteData from "../components/SiteData"
import UserAdmin from "../components/UserAdmin"
import ArticleReview from "../components/ArticleReview"
export default {
  data () {
    return {
      tabs: {},
      checkedTab: "SiteData",
      menus: {
        ArticleAdmin: { label: '文章管理', subMenus: { ArticleReview: '文章审核' } },
        UserAdmin: { label: '用户管理', subMenus: { UserAdmin: '用户管理' } }
      },
      componentsMap: {
        UserAdmin: "用户管理",
        ArticleReview: "文章管理"
      }
    }
  },
  methods: {
    removeTab (name) {
      this.tabs[name] && this.$delete(this.tabs, name)

    },
    selectMenu (name) {
      this.tabs[name] || this.$set(this.tabs, name, this.componentsMap[name])
      this.checkedTab = name
    }
  },
  components: {
    SiteData,
    UserAdmin,
    ArticleReview
  }
}
</script>

<style lang='scss' scoped>
.fill-height {
  height: calc(100vh - 60px);
}
</style>
