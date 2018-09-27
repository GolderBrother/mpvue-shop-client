<template>
  <div class="collection">
    <div class="title">
      我的收藏
    </div>
    <div class="sublist">
      <div @click="goGoodsDetail(subitem.id)" v-for="(subitem, subindex) in collectlist" :key="subindex">
        <img :src="subitem.list_pic_url" alt="">
        <p>{{subitem.name}}</p>
        <p>￥{{subitem.retail_price}}</p>
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
    }
    
  },
  computed: {}
};
</script>
<style lang='scss' scoped>
@import "./style";
</style>
