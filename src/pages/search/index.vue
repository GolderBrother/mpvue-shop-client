<template>
  <div class="search">
    <div class="head">
      <div>
        <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/search2-2fb94833aa.png" alt="">
        <!-- @focus:输入框聚焦时触发 @input:键盘输入时触发 confirm 键盘按下确认键后触发-->
        <input type="text" confirm-type="search" focus="true" v-model="words" @focus="inputFocus" @input="tipsearch" @confirm="searchWords"
          placeholder="商品搜索">
        <!-- <input name="input" class="keywrod" focus="true" value="{{keyword}}" confirm-type="search" bindinput="inputChange" bindfocus="inputFocus" bindconfirm="onKeywordConfirm" confirm-type="search" placeholder="{{defaultKeyword.keyword}}" /> -->
        <img @click="clearInput" class="del" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png"
          alt="">
      </div>
      <div @click="cancel">取消</div>
    </div>
    <div class="searchtips" v-if="words">
      <div @click="searchWords(e)" v-if="tipsData.length!=0" :data-value="item.name" v-for="(item,index) in tipsData" :key="index">
        {{ item.name }}
      </div>
      <div v-if="tipsData.length==0" class="nogoods">
        数据库暂无此类商品...
      </div>
    </div>
    <div class="history" v-if="historyData.length!=0">
      <div class="t">
        <div>历史记录</div>
        <div @click="clearHistory">

        </div>
      </div>
      <div class="cont">
        <div @click="searchWords(item.keyword)" :data-value="item.keyword" v-for="(item,index) in historyData" :key="index">
          {{item.keyword}}
        </div>
      </div>
    </div>
    <div class="history hotsearch">
      <div class="t">
        <div>热门搜索</div>
      </div>
      <div class="cont">
        <div @click="searchWords(item.keyword)" v-for="(item,index) in hotData" :data-value="item.keyword" :class="{active:0==index}" :key="index">
          {{item.keyword}}
        </div>
      </div>
    </div>
    <!--商品列表  -->
    <div v-if="listData.length!=0" class="goodsList">
      <div class="sortnav">
        <div @click="changeTab(0)" :class="[0==nowIndex ?'active':'']">综合</div>
        <div @click="changeTab(1)" class="price" :class="[1==nowIndex ?'active':'', order =='desc'? 'desc':'asc']">价格</div>
        <div @click="changeTab(2)" :class="[2==nowIndex ?'active':'']">分类</div>
      </div>
      <div class="sortlist">
        <div @click="goGoodsDetail(item.id)" v-for="(item, index) in listData" :key="index" :class="[(listData.length)%2==0?'active':'none']"
          class="item">
          <img :src="item.list_pic_url" alt="">
          <p class="name">{{item.name}}</p>
          <p class="price">￥{{item.retail_price}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { post, get } from "@/utils";
export default {
  onLoad() {
    this.initData();
  },
  onReady(){
    wx.setNavigationBarTitle({
      title:"搜索"
    });
  },
  created() {},
  mounted() {
    this.openid = wx.getStorageSync("openid") || "";
    this.getHotData();
  },
  data() {
    return {
      nowIndex: 0,
      words: "",
      historyData: [],
      hotData: [],
      tipsData: [],
      listData: [],
      openid: "",
      order: "",
      isHot: 0,
      isNew: 0
    };
  },
  components: {},
  methods: {
    initData() {
      this.nowIndex = 0;
      this.words = "";
      this.historyData = [];
      this.hotData = [];
      this.tipsData = [];
      this.listData = [];
      this.openid = "";
      this.order = "";
      this.isHot = 0;
      this.isNew = 0;
    },
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
    cancel() {
      wx.navigateBack({
        delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      });
    },
    clearInput() {
      this.words = "";
      this.listData = [];
      this.tipsData = [];
    },
    // 输入框聚焦时触发
    inputFocus() {
      //商品清空
      this.listData = [];
      //展示搜索提示信息
      this.tipsearch();
    },
    async getlistData() {
      //获取商品列表
      const data = await get("/search/helperaction", {
        keyword: this.words,
        order: this.order
      });
      this.listData = data.keywords;
      this.tipsData = [];
    },
    changeTab(index) {
      this.nowIndex = index;
      if (index == 1) {
        this.order = this.order == "asc" ? "desc" : "asc";
      } else {
        this.order = "";
      }
      this.getlistData();
    },
    async clearHistory() {
      const data = await post("/search/clearhistoryAction", {
        openId: this.openid
      });
      if (data) {
        this.historyData = [];
      }
    },
    async searchWords(e) {
      // const { type = "" } = e;
      // this.words = type === "confirm" ? e.target.value : e.currentTarget.dataset.value;
      this.words = e.target.value || e.currentTarget.dataset.value;
      console.log(this.words);
      // 添加搜索关键词到搜索历史中
      if (!this.words) {
        const data = await post("/search/addhistoryaction", {
          openId: this.openid,
          keyword: this.words
        });
      }

      //获取历史数据
      this.getHotData();
      //获取商品列表
      this.getlistData();
    },
    async getHotData(first) {
      const { hotKeywordList, historyData } = await get(
        "/search/indexaction?openId=" + this.openid
      );
      this.hotData = hotKeywordList;
      this.historyData = historyData;
    },
    // 展示搜索提示信息 键盘输入时触发
    async tipsearch(e) {
      const keywords = e.target.value || this.words;
      const data = await get("/search/helperaction", {
        keyword: keywords
      });
      this.tipsData = data.keywords;
    },
    topicDetail(id) {
      wx.navigateTo({
        url: "/pages/topicdetail/main?id=" + id
      });
    }
  },
  computed: {}
};
</script>
<style lang='scss' scoped>
@import "./style";
</style>
