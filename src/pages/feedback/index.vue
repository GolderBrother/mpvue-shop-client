<template>
  <div class="feedback">
    <div class="title">
      意见与反馈
    </div>
    <div class="cont">
      <textarea class="text" max='150' name="" v-model="content" placeholder="请填写你的意见和反馈"></textarea>
      <span>{{content.length}}/150</span>
    </div>
    <div class="connect">
      <label for="">
        联系方式:
      </label>
      <input type="text" v-model="phone" placeholder="邮箱/手机号/微信号">
    </div>
    <div @click="submitComment" class="bottom">
      提交
    </div>
  </div>
</template>

<script>
import { post, login } from "@/utils";
export default {
  onReady() {
    wx.setNavigationBarTitle({
      title: "反馈"
    });
  },
  mounted() {
    //判断是否登录获取用户信息
    if (login()) {
      this.userInfo = login();
      console.log(this.userInfo);
    }
  },
  data() {
    return {
      userInfo: {},
      content: "",
      phone: ""
    };
  },
  components: {},
  methods: {
    fieldVerify(type, str) {
      if (type === "phone") {
        if (!str) {
          wx.showToast({
            icon: "none",
            title: "手机号不能为空"
          });
          return false;
        }
        const isPhone = /1(3|5|6|7|8|9)\d{9}/.test(str);
        if (!isPhone) {
          wx.showToast({
            icon: "none",
            title: "手机号格式不正确"
          });
          return false;
        }
        return true;
      }
      if (type === "content") {
        if (!str) {
          wx.showToast({
            icon: "none",
            title: "内容不能为空"
          });
          return false;
        }
        return true;
      }
    },
    async submitComment() {
      const _this = this;
      const {
        userInfo: { openId, nickName },
        content,
        phone
      } = this;
      const phoneVerify = this.fieldVerify("phone", phone);
      const contentVerify = this.fieldVerify("content", content);
      if (!phoneVerify || !contentVerify) return;
      const data = await post("/feedback/submitAction", {
        openId: openId,
        name: nickName,
        content: content,
        phone: phone
      });
      if (data.data) {
        wx.showToast({
          title: "提交成功", //提示的内容,
          icon: "none", //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {
            _this.content = "";
            _this.phone = "";
          }
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
