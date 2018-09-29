<template>
  <div class="my">
    <div class="myinfo">
      <img @click="toLogin" :src="avator" alt="">
      <div @click="toLogin">
        <p>{{userInfo.nickName}}</p>
        <p v-if="userInfo.nickname">点击登录</p>
        <p v-else>微信用户</p>
      </div>
    </div>
    <div class="iconlist">
      <div @click="goTo(item)" v-for="(item, index) in listData" :key="index">
        <span class="iconfont" :class="item.icon"></span>
        <span>{{item.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { get, toLogin, login } from "@/utils";
import { mapGetters } from 'vuex';
export default {
  onShow() {
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    if (login()) {
      this.userInfo = login();
      console.log(this.userInfo);
      this.avator = this.userInfo.avatarUrl;
    }
  },
  onReady(){
    wx.setNavigationBarTitle({
      title:"我的"
    });
  },
  mounted() {},
  data() {
    return {
      avator:
        "http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png",
      allcheck: false,
      Listids: [],
      userInfo: {}
    };
  },
  components: {},
  methods: {
    // 跳转模块
    goTo({url,title}) {
      if (toLogin()) {
        if (!url) {
          wx.showToast({
            title: `${title}未开放`
          });
        } else {
          wx.navigateTo({
            url: url
          });
        }
      } else {
        wx.showToast({
          title: "请先登录"
        });
      }
    },
    toLogin() {
      if (!this.userInfo.avatarUrl) {
        wx.navigateTo({
          url: "/pages/login/main"
        });
      }
    }
  },
  computed: {
    ...mapGetters(['listData'])
  }
};
</script>
<style lang='scss' scoped>
@import "./style";
</style>
