<template>
  <!--
    	作者：luoyiming
    	时间：2019-11-05
    	描述：diy组件-模拟手机显示
    -->
  <div class="diy-phone-container">
    <draggable class="wrapper" v-model="diyData.items" :options="{ animation: 120, filter: '.drag__nomove' }">
      <template #item="{ element, index }">
        <div class="diy-phone-item" :class="{ active: form.selectedIndex == index }">
            <!-- 图片轮播 -->
            <template v-if="element.type == 'banner'">
              <Banner :item="element" :index="index" :selectedIndex="form.selectedIndex"></Banner>
            </template>
            <!-- 橱窗-->
            <template v-else-if="element.type == 'window'">
              <Window :item="element" :index="index" :selectedIndex="form.selectedIndex"></Window>
            </template>
           
            <!--导航组-->
            <template v-else-if="element.type == 'navBar'">
              <NavBar :item="element" :index="index" :selectedIndex="form.selectedIndex"></NavBar>
            </template>
           
            <!--富文本-->
            <template v-else-if="element.type == 'richText'">
              <RichText :item="element" :index="index" :selectedIndex="form.selectedIndex"></RichText>
            </template>
            <!--辅助空白-->
            <template v-else-if="element.type == 'blank'">
              <Blank :item="element" :index="index" :selectedIndex="form.selectedIndex"></Blank>
            </template>
            <!--辅助线-->
            <template v-else-if="element.type == 'guide'">
              <Guide :item="element" :index="index" :selectedIndex="form.selectedIndex"></Guide>
            </template>
          </div>
      </template>
    </draggable>
  </div>
</template>

<script>
  import Setpages from './model/Setpages.vue';
  import Banner from './model/Banner.vue';
  import Window from './model/Window.vue';
  import NavBar from './model/NavBar.vue';
  import RichText from './model/RichText.vue';
  import Blank from './model/Blank.vue';
  import Guide from './model/Guide.vue';
  import draggable from 'vuedraggable';
  export default {
    components: {
      /*顶部状态栏*/
      Setpages,
      /*图片轮播组件*/
      Banner,
      /*图片橱窗*/
      Window,
      /*导航组*/
      NavBar,
      /*富文本*/
      RichText,
      /*辅助空白*/
      Blank,
      /*辅助线*/
      Guide,
      /*拖动*/
      draggable,
    },
    data() {
      return {};
    },
    props: {
      form: Object,
      defaultData: Object,
      diyData: Object
    },
    created() {},
    methods: {
      /*删除diy元素*/
      onDeleleItem: function(index) {
        let self = this;
        ElMessageBox.confirm('确定要删除吗?', '提示', {
            type: 'warning'
          })
          .then(() => {
            self.diyData.items.splice(index, 1);
            self.form.selectedIndex = -1;
          });
      },

      /*编辑当前选中的Diy元素*/
      onEditer: function(index) {
        let self = this;
        // 记录当前选中元素的索引
        self.form.selectedIndex = index;
        // 当前选中的元素数据
        self.form.curItem = self.form.selectedIndex < 0 ? self.diyData.page : self.diyData.items[self.form
          .selectedIndex];
        // 注册编辑器事件
        //self.initEditor();
      },

      /* 注册编辑器事件*/
      initEditor: function() {
        let self = this;
        // 注册dom事件
        self.$nextTick(function() {
          // 销毁 umeditor 组件
          if (self.form.umeditor.hasOwnProperty('key')) {
            self.form.umeditor.destroy();
          }
          // 注册html组件
          self.editorHtmlComponent();
          // 富文本事件
          if (self.form.curItem.type === 'richText') {
            //self.onRichText(self.form.curItem);
          }
        });
      },

      /*编辑器事件：html组件*/
      editorHtmlComponent: function() {
        let self = this;
        var editor = self.$refs['diy-editor'];
        // 单/多选框
        //editor.find('input[type=checkbox], input[type=radio]').uCheck();
        // select组件
        // $editor.find('select').selected();
      }
    }
  };
</script>

<style>
  .diy-phone-container {
    position: relative;
    height: calc(100vh - 150px);
  }

  .diy-phone-container .wrapper {
    height: calc(100% - 90px);
    overflow-y: auto;
  }

  .diy-phone-container .phone-top {
    padding: 0 20px;
    border-radius: 18px 18px 0 0;
  }

  .diy-phone-container .phone-top .status-bar {
    height: 20px;
    display: flex;
    justify-content: space-between;
  }

  .diy-phone-container .phone-top .svg-icon {
    width: 20px;
    height: 20px;
    color: #333333;
  }

  .diy-phone-container .phone-top .navigation {
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 18px;
  }

  .diy-phone-container .diy-phone-item {}

  .diy-phone-container .diy-phone-item>div {
    position: relative;
    border: 2px solid #f1f1f2;
  }

  .diy-phone-container .diy-phone-item>div:hover,
  .diy-phone-container .diy-phone-item.active>div {
    border: 2px dashed #3a8ee6;
  }

  .diy-phone-container .diy-phone-item .btn-edit-del {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 10;
  }

  .diy-phone-container .diy-phone-item .btn-edit-del>div {
    width: 32px;
    height: 16px;
    line-height: 16px;
    display: inline-block;
    text-align: center;
    font-size: 10px;
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
    margin-left: 2px;
    cursor: pointer;
  }

  .diy-phone-container img {
    width: 100%;
  }
</style>
