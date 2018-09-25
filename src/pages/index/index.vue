<template>
  <div class="index">
    <div class="search">
      <div @click="toMappage">{{cityName}}</div>
      <div @click="toSearch">
        <input type="text" placeholder="搜索商品">
        <span class="icon"></span>
      </div>
      <button open-type="openSetting" @opensetting="handler">打开授权</button>
    </div>
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" circular="true" duration="500">
        <block v-for="(item, index) in banner " :key="index">
          <swiper-item class="swiper-item">
            <image :src="item.image_url" class="slide-image" />
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="channel">
      <div @click="categoryList(item.id)" v-for="(item, index) in channel" :key="index">
        <img :src="item.icon_url" alt="">
        <p>{{item.name}}</p>
      </div>
    </div>
    <div class="brand">
      <div @click="tobrandList" class="head">
        品牌制造商直供
      </div>
      <div class="content">
        <div @click="branddetail(item.id)" v-for="(item, index) in brandList" :key="index">
          <div>
            <p>{{item.name}}</p>
            <p>{{item.floor_price}}元起</p>
          </div>
          <img :src="item.new_pic_url" alt="">
        </div>
      </div>
    </div>
    <div class="newgoods">
      <div @click="goodsList('new')" class="newgoods-top">
        <div class="top">
          <p>新品首发</p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li @click="goodsDetail(item.id)" v-for="(item, index) in newGoods" :key="index">
              <img :src="item.list_pic_url" alt="">
              <p>{{item.name}}</p>
              <p>{{item.goods_brief}}</p>
              <p>￥{{item.retail_price}}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <div class="newgoods hotgoods">
      <div @click="goodsList('hot')" class="newgoods-top">
        <div class="top">
          <p>人气推荐
            <span></span> 好物精选</p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li @click="goodsDetail(item.id)" v-for="(item, index) in hotGoods" :key="index">
              <img :src="item.list_pic_url" alt="">
              <p>{{item.name}}</p>
              <p>{{item.goods_brief}}</p>
              <p>￥{{item.retail_price}}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <div class="topicList">
      <div @click="totopic" class="topicList-top">
        专题精选
        <span class="icon"></span>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li @click="topicdetail(item.id)" v-for="(item, index) in topicList" :key="index">
              <img :src="item.item_pic_url" alt="">
              <div class="btom">
                <div>
                  <p>{{item.title}}</p>
                  <p>{{item.subtitle}}</p>
                </div>
                <div>
                  {{item.price_info}}元起
                </div>
              </div>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <div class="newcategory">
      <div class="list" v-for="(item, index) in newCategoryList" :key="index">
        <div class="head">{{item.name}}好物</div>
        <div class="sublist">
          <div @click="goodsDetail(subitem.id)" v-for="(subitem, subindex) in item.goodsList" :key="subindex">
            <img :src="subitem.list_pic_url" alt="">
            <p>{{subitem.name}}</p>
            <p>￥{{subitem.retail_price}}</p>
          </div>
          <div @click="categoryList(item.id)">
            <div class="last">
              <p>{{item.name}}好物</p>
              <span class="icon"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import amapFile from "../../utils/amap-wx";
import { get } from "../../utils";
import { mapState, mapMutations } from "vuex";
export default {
  onLoad() {
    this.getCityName();
  },
  onShow() {
    wx.setNavigationBarTitle({ title: "首页" });
  },
  computed: {
    ...mapState(["cityName"])
  },
  created() {},
  mounted() {
    this.getData();
  },
  data() {
    return {
      banner: [],
      channel: [],
      brandList: [],
      newGoods: [],
      hotGoods: [],
      topicList: [],
      newCategoryList: []
    };
  },
  components: {},
  methods: {
    ...mapMutations(["update"]),
    toMappage() {
      const _this = this;
      // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
      wx.getSetting({
        success(res) {
          //如果没有同意授权,打开设置
          if (!res.authSetting["scope.userLocation"]) {
            wx.openSetting({
              success: res => {
                _this.getCityName();
              }
            });
          } else {
            wx.navigateTo({
              url: "/pages/mappage/main"
            });
          }
        }
      });
    },
    // 定位：获取当前所在城市 需要本地开启国外服务器代理才能访问得到
    getCityName2() {
      const _this = this;
      let myAmapFun = new amapFile.AMapWX({
        key: "e545e7f79a643f23aef187add14e4548"
      });
      myAmapFun.getRegeo({
        success: function(data) {
          //成功回调
          console.log(data);
          console.log(data[0].regeocodeData.formatted_address);
          // data[0].regeocodeData.formatted_address
          // _this.cityName = data[0].regeocodeData.formatted_address;
          _this.update({ cityName: data[0].regeocodeData.formatted_address });
        },
        fail: function(info) {
          //失败回调
          console.log(info);
          //如果用户拒绝授权
          // 默认为北京
          _this.cityName = "北京市";
          _this.update({ cityName: "北京市" });
        }
      });
    },
    openSetting(e) {
      if (e.detail.authSetting["scope.userLocation"]) {
        console.log(e.detail.authSetting["scope.userLocation"]);
        //e.detail.authSetting  这个是小程序的，mpvue自己打断点找一下吧，原谅我有点懒
        //if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"])
      }
    },
    // https://blog.csdn.net/weixin_36934930/article/details/80744457
    getCityName() {
      const _this = this;
      wx.getLocation({
        // type: 'wgs84',
        success: function(res) {
          let latitude, longitude;
          console.log("wxGetLocation", res);
          latitude = res.latitude.toString();
          longitude = res.longitude.toString();
          wx.request({
            header: {
              "Content-Type": "application/text"
            },
            url:
              "http://apis.map.qq.com/ws/geocoder/v1/?location=" +
              latitude +
              "," +
              longitude +
              "&key=MVGBZ-R2U3U-W5CVY-2PQID-AT4VZ-PDF35",
            success: function(res) {
              // _this.country = res.data.result.address_component.nation;
              // _this.province = res.data.result.address_component.province;
              // _this.city = res.data.result.address_component.city;
              // _this.district = res.data.result.address_component.district;
              console.log("getLocation success", res);
              const { locality } = res.data.result.address_component;
              _this.update({ cityName: locality });
              //_this.count();
              // console.log(res.data.result.address_component.nation,res.data.result.address_component.province,res.data.result.address_component.city,res.data.result.address_component.district)
            }
          });
        },
        fail: function(err) {
          console.log(err);
        }
      });
    },
    toSearch() {
      wx.navigateTo({
        url: "/pages/search/main"
      });
    },
    async getData() {
      try {
        const {
          banner,
          channel,
          brandList,
          newGoods,
          hotGoods,
          topicList,
          newCategoryList
        } = await get("/index/index");
        this.banner = banner;
        this.channel = channel;
        this.brandList = brandList;
        this.newGoods = newGoods;
        this.hotGoods = hotGoods;
        this.topicList = topicList;
        this.newCategoryList = newCategoryList;
      } catch (error) {
        console.log(error)
        // wx.showToast({
        //   title:"数据获取失败",
        //   icon: 'loading',
        // })
      }
    },
    goodsDetail(id) {
      wx.navigateTo({
        url: "/pages/goods/main?id=" + id
      });
    },
    categoryList(id) {
      wx.navigateTo({
        url: "/pages/categorylist/main?id=" + id
      });
    },
    goodsList(info) {
      if (info == "hot") {
        wx.navigateTo({
          url: "/pages/newgoods/main?isHot=" + 1
        });
      } else {
        wx.navigateTo({
          url: "/pages/newgoods/main?isNew=" + 1
        });
      }
    },
    topicdetail(id) {
      wx.navigateTo({
        url: "/pages/topicdetail/main?id=" + id
      });
    },
    totopic() {
      wx.navigateTo({
        url: "/pages/topic/main"
      });
    },
    tobrandList() {
      wx.navigateTo({
        url: "/pages/brandlist/main"
      });
    },
    branddetail(id) {
      wx.navigateTo({
        url: "/pages/branddetail/main?id=" + id
      });
    }
  },
  created() {}
};
</script>

<style lang='scss' scoped>
@import "./style.scss";
</style>
