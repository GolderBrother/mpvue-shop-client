<template>
    <div class="branddetail">
        <div class="banner">
            <img :src="detailData.pic_url" :alt="detailData.name">
            <div class="info">
                <span>{{ detailData.name }}</span>
            </div>
        </div>
        <div class="info-desc">
            {{ detailData.simple_desc }}
        </div>
        <div v-if="goodsList.length!=0" class="sortlist">
            <div v-for="(item, index) in goodsList" :key="index" class="item" @click="goGoodsDetail(item.id)">
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
  created() {},
  mounted() {
    this.id = this.$root.$mp.query.id;
    this.getDetail();
  },
  data() {
    return {
      id: "",
      detailData: {},
      goodsList: []
    };
  },
  components: {},
  methods: {
    async getDetail() {
      const { data, goodsList } = await get("/brand/detailaction", {
        id: this.id
      });
      this.detailData = data;
      this.goodsList = goodsList;
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