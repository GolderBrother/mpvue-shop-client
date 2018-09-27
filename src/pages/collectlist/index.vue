<template>
  <div class="collection">
    <div class="title">
      我的收藏
    </div>
    <div class="sublist">
      <div v-if="collectlist.length !== 0" class="collect-list">
        <div @click="goGoodsDetail(subitem.id)" v-for="(subitem, subindex) in collectlist" :key="subindex">
          <img :src="subitem.list_pic_url" alt="">
          <p>{{subitem.name}}</p>
          <p>￥{{subitem.retail_price}}</p>
        </div>
      </div>
      <div v-else class="collect-empty">
        <div class="center">
          <img src="/static/images/collect.png" alt="">
          <p>
            暂时没有收藏的商品哦！快去<span class="home" @click="goHome()">逛逛</span>吧
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, getStorageOpenid } from "../../utils";
export default {
  onShow() {
    wx.setNavigationBarTitle({
      title: "收藏"
    });
    this.openId = getStorageOpenid();
    this.getlist();
  },
  created() {},
  mounted() {},
  data() {
    return {
      openId: "",
      collectlist: []
    };
  },
  components: {},
  methods: {
    async getlist() {
      const data = await get("/collect/listAction", {
        openId: this.openId
      });
      this.collectlist = data.collectGoodsList;
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
    },
    goHome() {
      // 跳转首页，因为这是 tab 页面，因此跳转方式为 wx.switchTab, wx.navigateTo 这方式不行
      wx.switchTab({
        url:"/pages/index/main"
      });
    }
  },
  computed: {}
};
</script>
<style lang='scss' scoped>
@import "./style";
</style>
