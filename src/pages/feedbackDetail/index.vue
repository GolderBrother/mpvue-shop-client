<template>
    <div class="feedback-detail">
        <div class="detail-container">
            <div class="detail-box" v-if="!isEmpty">
                <div class="detail-title">
                    <span class="user">{{ detailData.user_name }}</span>
                    <span class="time">{{ detailData.msg_time }}</span>
                </div>
                <div class="detail-content">
                    <p class="content">
                        {{detailData.msg_content}}
                    </p>
                </div>
            </div>
            <div class="detail-empty" v-else>
                该条评论不存在...
            </div>
        </div>
    </div>
</template>
<script>
import { get, getStorageOpenid } from "@/utils";
import { isEmptyObj, formatMsgTime } from "@/utils/utils";
export default {
  onLoad() {
    wx.setNavigationBarTitle({
      title: "我的反馈"
    });
    this.id = this.$root.$mp.query.id;
    this.openId = getStorageOpenid();
    this.getDetail();
  },
  data() {
    return {
      id: "",
      openId: "",
      detailData: {},
      isEmpty: false
    };
  },
  methods: {
    async getDetail() {
      const { data } = await get("/feedback/getDetailAction", {
        id: this.id,
        openId: this.openId
      });
      // 格式化发表时间 1537934367655 => 5小时前
      if (!isEmptyObj(data)) {
        data["msg_time"] = formatMsgTime(data["msg_time"]);
        this.detailData = data;
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>


