<template>
  <div class="addaddress">
    <div class="item">
      <input type="text" placeholder="姓名" v-model="userName">
    </div>
    <div class="item">
      <input type="text" placeholder="手机号码" v-model="telNumber">
    </div>
    <div class="item">
      <picker mode="region" @change="bindRegionChange" :value="region" :custom-item="customItem">
        <input type="text" placeholder="省份、城市、区县" v-model="address">
      </picker>
      <!-- <input type="text" placeholder="身份、城市、区县" v-model="address"> -->
    </div>
    <!-- <view class="section">
      <view class="section__title">省市区选择器</view>
      <picker mode="region" @change="bindRegionChange" :value="region" :custom-item="customItem">
        <view class="picker">
          当前选择：{{region[0]}}，{{region[1]}}，{{region[2]}}
        </view>
      </picker>
    </view> -->
    <div class="item">
      <input type="text" placeholder="详细地址，如楼道、楼盘号等" v-model="detailaddress">
    </div>
    <div class="item itemend">
      <checkbox-group @change="checkboxChange">
        <label class="checkbox">
          <checkbox class="box" value="true" :checked="checked" color="#B4282D" />设置为默认地址
        </label>
      </checkbox-group>
      <div @click="wxaddress">一键导入微信></div>
    </div>
    <div @click="saveAddress" class="bottom">
      保存
    </div>
  </div>
</template>

<script>
import { get, post, getStorageOpenid } from "../../utils";
import { isEmptyObj } from "../../utils/utils";
export default {
  onLoad() {
    this.initData();
  },
  created() {},
  mounted() {
    let navigationTitle = "增加地址";
    this.openId = getStorageOpenid();
    console.log(this.$root.$mp);
    const { id,res } = this.$root.$mp.query;
    console.log(id,res)
    if (res) {
      this.res = JSON.parse(decodeURIComponent(res));
      console.log(this.res);
      const { userName,telNumber,provinceName,cityName,countyName,detailInfo } = this.res;
      this.userName = userName;
      this.telNumber = telNumber;
      this.address = `${provinceName} ${cityName} ${
        countyName
      }`;
      this.detailaddress = detailInfo;
    }
    if (id) {
      navigationTitle = "编辑地址";
      this.id = id;
      this.getDetail();
    }
    wx.setNavigationBarTitle({
      title:navigationTitle
    });
  },
  data() {
    return {
      region: [],
      customItem: "全部",
      id: "",
      openId: "",
      res: {},
      userName: "",
      telNumber: "",
      address: "",
      detailaddress: "",
      checked: false
    };
  },
  methods: {
    initData() {
      this.region = [];
      this.customItem = "全部";
      this.id = "";
      this.res = {};
      this.userName = "";
      this.telNumber = "";
      this.address = "";
      this.detailaddress = "";
      this.checked = false;
    },
    bindRegionChange(e) {
      var value = e.mp.detail.value;
      this.address = value[0] + " " + value[1] + " " + value[2];
    },
    async getDetail() {
      const data = await get("/address/detailAction", {
        id: this.id
      });
      if(isEmptyObj(data)){
        wx.showToast({
          icon:'none',
          title:"该地址不存在",
          complete:() => {
            wx.navigateBack({
              changed:true
            })
          }
        })
        return;
      }
      const {
        data: { name, mobile, address, address_detail, is_default }
      } = data;
      this.userName = name;
      this.telNumber = mobile;
      this.address = address;
      this.detailaddress = address_detail;
      this.checked = is_default == 1 ? true : false;
    },
    checkboxChange(e) {
      this.checked = e.mp.detail.value[0];
    },
    async saveAddress() {
      const _this = this;
      const { data, msg } = await post("/address/saveAction", {
        userName: _this.userName,
        telNumber: _this.telNumber,
        address: _this.address,
        detailaddress: _this.detailaddress,
        checked: _this.checked,
        openId: _this.openId,
        addressId: _this.id
      });
      if (data) {
        wx.showToast({
          title: "添加成功", //提示的内容,
          icon: "success", //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {
            wx.navigateBack({
              delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
            });
          }
        });
      } else {
        console.log(msg);
      }
    },
    wxaddress() {
      const _this = this;
      wx.chooseAddress({
        success: function(res) {
          console.log(res);
          _this.userName = res.userName;
          _this.telNumber = res.telNumber;
          _this.address = `${res.provinceName} ${res.cityName} ${
            res.countyName
          }`;
          _this.detailaddress = res.detailInfo;
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
@import "./style.scss";
</style>
