(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{309:function(t,e,a){"use strict";var i=a(1),r=a.n(i)()((function(t){return t[1]}));r.push([t.i,".draft-list[data-v-aa8d6d4e]{margin:10px !important;padding:10px;border-radius:5px;box-shadow:0 2px 12px 0 rgba(0,0,0,.1)}.draft-list .el-image[data-v-aa8d6d4e]{height:120px;border-radius:5px}.draft-list .title[data-v-aa8d6d4e]{overflow:hidden;width:80%;text-align:left;text-overflow:ellipsis;font-size:1.5rem;line-height:4rem}.draft-list .time[data-v-aa8d6d4e]{font-size:12px;color:silver;margin-bottom:10px}",""]),e.a=r},505:function(t,e,a){"use strict";var i=a(1),r=a.n(i)()((function(t){return t[1]}));r.push([t.i,".el-form .el-input-group__append[data-v-8229c400]{background-color:#fff}.el-form>*[data-v-8229c400]{margin-bottom:20px}.el-upload i[data-v-8229c400]{border:1px dashed #d9d9d9;border-radius:5px;line-height:100px;width:200px;height:100px}.el-upload img[data-v-8229c400]{width:200px;height:100px}",""]),e.a=r},517:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-tabs",{on:{"tab-click":t.changeTab},model:{value:t.checkedTab,callback:function(e){t.checkedTab=e},expression:"checkedTab"}},[a("el-tab-pane",{attrs:{label:"编辑",name:"edit",lazy:""}},[a("Edit")],1),t._v(" "),a("el-tab-pane",{attrs:{label:"草稿",name:"draft",lazy:""}},[a("DraftList")],1)],1)};i._withStripped=!0;a(251);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-row",[t.draftList.length?a("el-row",t._l(t.draftList,(function(e,i){return a("el-row",{key:i,staticClass:"draft-list",attrs:{gutter:20}},[a("el-col",{attrs:{span:8}},[a("el-image",{attrs:{src:e.cover}})],1),t._v(" "),a("el-col",{attrs:{span:16}},[a("div",{staticClass:"title"},[t._v(t._s(e.title))]),t._v(" "),a("div",{staticClass:"time"},[t._v("最后修改时间："+t._s(t._f("transtime")(e.time)))]),t._v(" "),a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(a){return t.edit(e.article_id)}}},[t._v("编辑")]),t._v(" "),a("el-button",{attrs:{size:"mini",type:"success"},on:{click:function(a){return t.draftToArticle(e.article_id,i)}}},[t._v("提交")]),t._v(" "),a("el-button",{attrs:{size:"mini"},on:{click:function(a){return t.preview(e.article_id)}}},[t._v("预览")]),t._v(" "),a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(a){return t.deleteDraft(e.article_id,i)}}},[t._v("删除")])],1)],1)})),1):a("Empty"),t._v(" "),a("el-dialog",{attrs:{visible:t.dialogVisible},on:{"update:visible":function(e){t.dialogVisible=e}}},[a("h3",[t._v(t._s(t.preDraft.title))]),t._v(" "),a("div",{domProps:{innerHTML:t._s(t.preDraft.content)}})])],1)};r._withStripped=!0;a(302),a(252);var o=a(47),s={data:function(){return{draftList:"",preDraft:{},dialogVisible:!1}},methods:{preview:function(t){var e=this,a={article_id:t};o.a.getDraftDetail(a).then((function(t){var a=t.data;console.log(a),e.dialogVisible=!0,e.preDraft=a.data.draft}))},getDraft:function(){var t=this;o.a.getDraft().then((function(e){var a=e.data;console.log(a),t.draftList=a.data.draftList}))},deleteDraft:function(t,e){var a=this,i={article_id:t};o.a.deleteDraft(i).then((function(t){var i=t.data;console.log(i),i.status&&(a.$message({type:"success",message:i.message}),a.draftList.splice(e,1))}))},draftToArticle:function(t,e){var a=this,i={article_id:t};o.a.draftToArticle(i).then((function(t){var i=t.data;console.log(i),i.status&&(a.$message({type:"success",message:i.message}),a.draftList.splice(e,1))}))},edit:function(t){this.$router.push({path:"contribution",query:{tab:"edit",article_id:t}})}},components:{Empty:a(255).a},watch:{$route:function(){switch(this.$route.query.tab){case"draft":this.getDraft()}}},mounted:function(){this.getDraft()},filters:{transtime:function(t){var e=new Date(t).getTime(),a=((new Date).getTime()-e)/1e3;return a>86400?new Date(t).toLocaleDateString():a>3600?Math.floor(a/3600)+"小时前":Math.floor(a/60)+"分钟前"}}},l=a(2),n=a.n(l),c=a(309),d={insert:"head",singleton:!1},u=(n()(c.a,d),c.a.locals,a(4)),p=Object(u.a)(s,r,[],!1,null,"aa8d6d4e",null);p.options.__file="src/pages/user/components/contribution/DraftList.vue";var f=p.exports,h=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-form",{ref:"edit",attrs:{rules:t.rules,model:t.article}},[a("el-form-item",{attrs:{prop:"title"}},[a("el-input",{attrs:{placeholder:"标题",maxlength:"40",clearable:"",required:""},model:{value:t.article.title,callback:function(e){t.$set(t.article,"title",e)},expression:"article.title"}},[a("div",{attrs:{slot:"append"},slot:"append"},[t._v(t._s(t.titleLength)+"/40")])])],1),t._v(" "),a("el-form-item",{attrs:{prop:"content"}},[a("div",{attrs:{id:"editor"}})]),t._v(" "),a("el-form-item",{attrs:{label:"投稿区：",prop:"type"}},[a("el-checkbox-group",{model:{value:t.article.type,callback:function(e){t.$set(t.article,"type",e)},expression:"article.type"}},[a("el-checkbox",{attrs:{label:"front"}},[t._v("前端")]),t._v(" "),a("el-checkbox",{attrs:{label:"back"}},[t._v("后端")]),t._v(" "),a("el-checkbox",{attrs:{label:"js"}},[t._v("js")]),t._v(" "),a("el-checkbox",{attrs:{label:"css"}},[t._v("css")])],1)],1),t._v(" "),a("el-form-item",{attrs:{label:"封面（可选）"}},[a("el-upload",{ref:"uploadCover",attrs:{action:t.uploadArticleCoverUrl,headers:t.headers,"auto-upload":!1,name:"cover","list-type":"picture","show-file-list":!1,"on-change":t.changImg,"on-success":t.uploadSuccess}},[t.article.cover?a("img",{attrs:{src:t.article.cover}}):a("i",{staticClass:"el-icon-plus avatar-uploader-icon"})]),t._v(" "),a("el-button",{attrs:{disabled:!t.coverFile,size:"mini"},on:{click:t.uploadCover}},[t._v("上传封面")])],1)],1),t._v(" "),a("div",[a("el-button",{attrs:{type:"primary"},on:{click:t.uploadArticle}},[t._v("提交审核")]),t._v(" "),a("el-button",{attrs:{type:"info"},on:{click:t.uploadDraft}},[t._v("存为草稿")])],1)],1)};h._withStripped=!0;var v=a(310),g=a.n(v),m=a(311),b=a.n(m),_=(a(503),{data:function(){var t=this;return{editor:"",headers:{Authorization:sessionStorage.getItem("authorization")},uploadArticleCoverUrl:o.a.getUploadArticleCoverUrl(),coverFile:"",article:{article_id:"",title:"",content:"",type:[],cover:""},rules:{title:[{required:!0,message:"请填写标题",trigger:"blur"}],content:[{validator:function(e,a,i){t.editor.txt.html()?i():i(new Error("内容不能为空"))}}],type:[{required:!0,message:"请选择投稿区",trigger:"blur"}]}}},methods:{uploadArticle:function(){var t=this;this.$refs.edit.validate((function(e){e&&(t.article.content=t.editor.txt.html(),o.a.uploadArticle({article:t.article}).then((function(e){var a=e.data;console.log(a),a.status&&(t.$message({type:"success",message:a.message}),t.initArticle())})))}))},uploadDraft:function(){var t=this;this.$refs.edit.validate((function(e){e&&(t.article.content=t.editor.txt.html(),o.a.uploadDraft({article:t.article}).then((function(e){var a=e.data;console.log(a),a.status&&(t.$message({type:"success",message:a.message}),t.initArticle())})))}))},getDraftDetail:function(t){var e=this,a={article_id:t};o.a.getDraftDetail(a).then((function(t){var a=t.data;console.log(a),a.status&&(e.article=a.data.draft,e.editor.txt.html(e.article.content))}))},uploadCover:function(){this.$refs.uploadCover.submit()},uploadSuccess:function(t){console.log(t.data.img),this.article.cover=o.a.getImgUrl(t.data.img),this.$message({type:"success",message:t.message})},changImg:function(t,e){"ready"===t.status?(this.coverFile=t.raw,this.article.cover=t.url):this.coverFile=null,e.length>1&&e.shift()},initArticle:function(){this.article={article_id:"",title:"",content:"",type:[],cover:""},this.editor.txt.clear()}},watch:{$route:function(){this.$route.query.article_id&&this.getDraftDetail(this.$route.query.article_id)}},mounted:function(){this.editor=new g.a("#editor"),this.editor.highlight=b.a,this.editor.create()},computed:{titleLength:function(){return this.article.title.length}}}),x=a(505),y={insert:"head",singleton:!1},w=(n()(x.a,y),x.a.locals,Object(u.a)(_,h,[],!1,null,"8229c400",null));w.options.__file="src/pages/user/components/contribution/Edit.vue";var D={data:function(){return{checkedTab:""}},methods:{changeTab:function(t){this.$router.push({path:"/contribution",query:{tab:t.name}})}},components:{DraftList:f,Edit:w.exports},watch:{$route:function(){this.checkedTab=this.$route.query.tab||"edit"}},mounted:function(){this.checkedTab=this.$route.query.tab||"edit"}},k=Object(u.a)(D,i,[],!1,null,null,null);k.options.__file="src/pages/user/components/contribution/Contribution.vue";e.default=k.exports}}]);