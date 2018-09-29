<template>
  <div class="categoryList">
    <scroll-view scroll-x="true" :scroll-left="scrollLeft" class="head">
      <div @click="changeTab(index,item.id)" :class="[nowIndex==index ?'active':'']" v-for="(item, index) in navData" :key="index">
        {{item.name}}
      </div>
    </scroll-view>
    <div class="info">
      <img :src="currentNav.wap_banner_url" :alt="currentNav.name">
      <p>{{currentNav.name}}</p>
      <p>{{currentNav.front_desc}}</p>
    </div>
    <div class="list" v-if="goodsList.length!=0">
      <div @click="goGoodsDetail(item.id)" class="item" v-for="(item, index) in goodsList" :key="index">
        <img :src="item.list_pic_url" alt="">
        <p class="name">{{item.name}}</p>
        <p class="price">￥{{item.retail_price}}</p>
      </div>
    </div>
    <div v-else class="none">
      数据库暂无数据...
    </div>
  </div>
</template>

<script>
import { get } from "@/utils";
export default {
  onLoad() {
    this.initData();
  },
  onReady(){
    wx.setNavigationBarTitle({
      title:"专题"
    });
  },
  created() {},
  mounted() {
    //获取页面传的参数
    this.categoryId = this.$root.$mp.query.id;
    this.getAllData();
  },
  data() {
    return {
      categoryId: 0,
      nowIndex: 0,
      goodsList: [],
      navData: [],
      currentNav: {},
      scrollLeft: 0
    };
  },
  components: {},
  methods: {
    initData() {
      this.categoryId = 0;
      this.nowIndex = 0;
      this.goodsList = [];
      this.navData = [];
      this.currentNav = {};
      this.scrollLeft = 0;
    },
    async changeTab(index, id) {
      this.nowIndex = index;
      const { data, currentNav } = await get("/goods/goodsList", {
        categoryId: id
      });
      this.goodsList = data;
      this.currentNav = currentNav;
      //需要让导航滚动到可见区域
      if (this.nowIndex > 4) {
        this.scrollLeft = this.nowIndex * 60;
      }else {
        this.scrollLeft = 0;
      }
    },
    // 获取所有的列表数据
    async getAllData() {
      try {
        const { navData,currentNav } = await get("/category/categoryNav", {
          id: this.categoryId
        });
        this.navData = navData;
        this.currentNav = currentNav;
        this.navData.forEach((item,index) => {
            const { id } = item;
            if(id === this.currentNav.id){
              this.nowIndex = index;
            }
        })

        //需要让导航滚动到可见区域
        if (this.nowIndex > 4) {
          this.scrollLeft = this.nowIndex * 60;
        } else {
          this.scrollLeft = 0;
        }
        const listdata = await get("/goods/goodsList", {
          categoryId: this.categoryId
        });
        this.goodsList = listdata.data;
      } catch (error) {
        wx.showToast({
          title: "数据获取失败",
          icon: "loading"
        });
      }
    },
    // 跳转商品详情
    goGoodsDetail(goodsId) {
      if (goodsId) {
        wx.navigateTo({
          url: `/pages/goods/main?id=${goodsId}`
        });
      } else {
        wx.showToast({
          icon: "none",
          title: "该商品不存在"
        });
      }
    }
  },
  computed: {}
};
</script>
<style lang='scss' scoped>
@import "./style";
</style>
