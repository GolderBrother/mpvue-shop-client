<template>
  <div class="goods">
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
        <block v-for="(item, index) in gallery " :key="index">
          <swiper-item class="swiper-item">
            <image :src="item.img_url" class="slide-image" />
          </swiper-item>
        </block>
      </swiper>
      <button class="share" hover-class="none" open-type="share" value="">分享商品</button>
    </div>
    <div class="swiper-b">
      <div class="item">30天无忧退货</div>
      <div class="item">48小时快速退款</div>
      <div class="item">满88元免邮费</div>
    </div>
    <div class="goods-info">
      <div class="c">
        <p>{{info.name}}</p>
        <p>{{info.goods_brief}}</p>
        <p>￥{{info.retail_price}}</p>
        <div v-if="brand.name" class="brand">
          <p>{{brand.name}}</p>
        </div>
      </div>
    </div>
    <div @click="showType" class="section-nav">
      <div>请选择规格数量</div>
      <div></div>
    </div>
    <!-- <div @click="showType" class="section-nav">
      <div>用户评价</div>
      <div></div>
    </div> -->

    <div v-if="attribute.length!=0" class="attribute">
      <div class="head">
        商品参数
      </div>
      <div v-for="(item,index) in attribute" :key="index" class="item">
        <div>{{item.name}}</div>
        <div>{{item.value}}</div>
      </div>
    </div>
    <div v-if="goods_desc" class="detail">
      <wxParse :content="goods_desc" />
    </div>
    <!-- 常见问题 -->
    <div class="common-problem">
      <div class="h">
        <div class="line"></div>
        <text class="title">常见问题</text>
        <div class="line"></div>
      </div>
      <div class="b">
        <div class="item" v-for="(item, index) in issueList" :key="index">
          <div class="question-box">
            <text class="spot"></text>
            <text class="question">{{item.question}}</text>
          </div>
          <div class="answer">
            {{item.answer}}
          </div>
        </div>
      </div>
    </div>
    <!-- 常见问题 -->
    <!-- 大家都在看 -->

    <div class="common-problem">
      <div class="h">
        <div class="line"></div>
        <text class="title">大家都在看</text>
        <div class="line"></div>
      </div>
      <div class="sublist">
        <div @click="toGoodsDetail(subitem.id)" v-for="(subitem, subindex) in productList" :key="subindex">
          <img :src="subitem.list_pic_url" alt="">
          <p>{{subitem.name}}</p>
          <p>￥{{subitem.retail_price}}</p>
        </div>
      </div>
    </div>

    <!-- 大家都在看 -->
    <div class="bottom-fixed">
      <div @click="collect">
        <div class="collect" :class="[collectFlag ? 'active' :'']">

        </div>

      </div>
      <div @click="toCart">
        <div class="car">
          <span>
            {{allnumber}}
          </span>
          <img src="/static/images/ic_menu_shoping_nor.png" alt="">
        </div>
      </div>
      <div @click="bug">立即购买</div>
      <div @click="addCart">加入购物车</div>
    </div>

    <!-- 选择规格部分 -->
    <div v-show="showpop" @click="showType" class="pop">

    </div>
    <div class="attr-pop" :class="[showpop ? 'fadeup' : 'fadedown']">
      <div class="top">
        <div class="left">
          <img :src="info.primary_pic_url" alt="">
        </div>
        <div class="right">
          <div>
            <p>价格￥{{info.retail_price}}</p>
            <p>请选择数量</p>
          </div>
        </div>
        <div @click="showType" class="close">
          X
        </div>
      </div>
      <div class="b">
        <p>数量</p>
        <div class="count">
          <div @click="reduce" class="cut">-</div>
          <input class="number" disabled="" v-model="number" />
          <div @click="add" class="add">+</div>
        </div>
      </div>
    </div>

    <!-- 选择规格部分 -->
  </div>
</template>

<script>
import { get, post, toLogin, login, getStorageOpenid } from "@/utils";
import wxParse from "mpvue-wxparse";

export default {
  onLoad() {
    this.initData();
    //判断是否登录获取用户信息
    if (login()) {
      this.userInfo = login();
    }
    // 获取 get 提交的 query 参数
    this.id = this.$root.$mp.query.id;
    this.openId = getStorageOpenid();
    this.handleGoodsDetail();
  },
  //商品转发
  onShareAppMessage() {
    const { info: { name, id }, gallery} = this;
    return {
      title: name,
      path: `/pages/goods/main?id=${id}`,
      imageUrl: gallery[0].img_url //拿第一张商品的图片
    };
  },
  mounted() {},
  data() {
    return {
      allnumber: 0,
      openId: "",
      collectFlag: false,
      number: 0,
      showpop: false,
      gallery: [],
      info: {},
      brand: {},
      attribute: [],
      issueList: [],
      productList: [],
      goods_desc: "",
      id: "",
      userInfo: "",
      goodsId: "",
      goodsAllPrice: 0,
      submitType: "buy"
    };
  },
  components: {
    wxParse
  },
  methods: {
    initData() {
      this.gallery = [];
      this.info = {};
      this.allnumber = 0;
      this.collectFlag = false;
      this.number = 0;
      this.showpop = false;
      this.gallery = [];
      this.info = {};
      this.brand = {};
      this.attribute = [];
      this.issueList = [];
      this.productList = [];
      this.goods_desc = "";
      this.id = "";
      this.goodsId = "";
      this.goodsAllPrice = 0;
    },
    toGoodsDetail(id) {
      wx.navigateTo({
        url: "/pages/goods/main?id=" + id
      });
    },
    add() {
      this.number = this.number + 1;
    },
    reduce() {
      if (this.number > 1) {
        this.number = this.number - 1;
      } else {
        return false;
      }
    },
    async bug() {
      if (toLogin()) {
        if (this.showpop) {
          if (this.number == 0) {
            wx.showToast({
              title: "请选择商品数量", //提示的内容,
              duration: 2000, //延迟时间,
              icon: "none",
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
            return false;
          }
          const data = await post("/order/submitAction", {
            openId: this.openId,
            goodsId: this.goodsId,
            goodsNums:this.number,
            goodsPrice: this.goodsAllPrice,
            submitType: this.submitType
          });
          if (data) {
            wx.navigateTo({
              url: "/pages/order/main"
            });
          }
        } else {
          this.showpop = true;
        }
      }
    },
    async collect() {
      if (toLogin()) {
        // 取消收藏
        const { goodsId,userInfo:{openId}} = this;
        if(this.collectFlag){
          const res = await get("/collect/deleteCollect",{
            openId,
            goodsId
          });
        }else{ // 收藏
          const res = await post("/collect/addcollect", {
            openId,
            goodsId
          });
        }
        this.collectFlag = !this.collectFlag;
      }
    },
    async addCart() {
      if (toLogin()) {
        if (this.showpop) {
          if (this.number == 0) {
            wx.showToast({
              title: "请选择商品数量", //提示的内容,
              duration: 2000, //延迟时间,
              icon: "none",
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
            return false;
          }
          const data = await post("/cart/addCart", {
            openId: this.userInfo.openId,
            goodsId: this.goodsId,
            number: this.number
          });
          //添加成功后
          if (data) {
            this.allnumber = this.allnumber + this.number;
            this.showpop = false;
            wx.showToast({
              title: "添加购物车成功",
              icon: "success",
              duration: 1500
            });
          }
        } else {
          this.showpop = true;
        }
      }
    },
    toCart() {
      // 跳转购物车，因为这是 tab 页面，因此跳转方式为 wx.switchTab, wx.navigateTo 这方式不行
      wx.switchTab({
        url: "/pages/cart/main"
      });
      // wx.navigateTo({
      //   url: "/pages/cart/main"
      // });
    },
    async handleGoodsDetail() {
      const data = await get("/goods/detailaction", {
        id: this.id,
        openId: this.openId
      });
      this.gallery = data.gallery;
      this.info = data.info;
      this.goodsAllPrice = data.info.retail_price * data.allnumber;
      this.goodsId = data.info.id;
      this.brand = data.brand;
      this.attribute = data.attribute;
      this.goods_desc = data.info.goods_desc;
      this.issueList = data.issue;
      this.collectFlag = data.collected;
      this.allnumber = data.allnumber;
      this.productList = data.productList;
    },
    showType() {
      this.showpop = !this.showpop;
    }
  },
  computed: {}
};
</script>
<style lang='scss' scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
@import "./style.scss";
</style>
