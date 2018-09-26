<template>
    <div class="feedback-list">
        <div class="feedback-list-wrapper">
            <div class="title">
                <h2>我的反馈列表</h2>
            </div>
            <div class="feedback-list-box">
                <ul>
                    <li v-for="(item,index) in list" :key="index" class="content-box" @click="goDetail(item.id)">
                        <div class="meta-row">
                            <span class="meta-user">{{ item.user_name }}</span>
                            <span class="meta-point"></span>
                            <span class="meta-time">{{ item.msg_time }}</span>
                        </div>
                        <div class="title-row">
                            <p class=".increase-ellipsis">
                                {{ item.msg_content }}
                            </p>
                        </div>
                    </li>
                </ul>
                <!-- iview-weapp 的分月组建引入不成功 -->
                <i-page current="1" total="5" mode="number" @change="handleChange"></i-page>
            </div>
        </div>
    </div>
</template>
<script>
import { formatMsgTime } from "@/utils/utils";
import { get, getStorageOpenid } from "@/utils";
export default {
  onLoad() {
    wx.setNavigationBarTitle({
      title: "反馈列表"
    });
    this.openId = getStorageOpenid();
    this.getList(true);
  },
  // 下拉刷新 需要覆盖旧的数据
  // 需要在main.js中配置 config: {
  //   enablePullDownRefresh: true
  // }
  onPullDownRefresh() {
    this.getList(true);
    //刷新完成后关闭
    wx.stopPullDownRefresh();
  },
  // 上拉加载 不需要覆盖旧的数据
  onReachBottom() {
    this.page = this.page + 1;
    if (this.page > this.total) {
      this.page = 1;
      return false;
    }
    this.getData(false);
  },
  data() {
    return {
      list: [],
      openId: "",
      page: 1,
      total: 0
    };
  },
  methods: {
    async getList(first) {
      let { data } = await get("/feedback/getListAction", {
        openId: this.openId,
        page: this.page
      });
      // 更新总页数
      this.total = data.total;
      // 格式化发表时间 1537934367655 => 5小时前
      if (data && data.length) {
        data.forEach((item, index) => {
          item["msg_time"] = formatMsgTime(item["msg_time"]);
        });
        if (first) {
          this.list = data;
        } else {
          this.list = [...this.list, ...data];
        }
      }
    },
    goDetail(id) {
      if (id) {
        wx.navigateTo({
          url: `/pages/feedbackDetail/main?id=${id}`
        });
      } else {
        wx.showToast({
          icon: "none",
          title: "该评论不存在"
        });
      }
    },
    // 分页
    handleChange({ detail }) {
      console.log(detail);
      const type = detail.type;
      if (type === "next") {
        this.page += 1;
      } else if (type === "prev") {
        this.page -= 1;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>

