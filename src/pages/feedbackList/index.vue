<template>
    <div class="feedback-list">
        <div class="feedback-list-wrapper">
            <div class="title">
                <h2>我的反馈列表</h2>
            </div>
            <div class="feedback-list-box">
                <ul class="feedback-list">
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
                <!-- iview-weapp 的分页组件引入不成功 -->
                <!-- <i-page current="1" total="5" mode="number" @change="handleChange"></i-page> -->
                <!-- 引入自定义组件不行 -->
                <!-- <pagination
                    v-model="page" 
                    @change="selectPage"
                    :total-items="total" 
                 /> -->
                <ul class="pagination"> 
                    <li :class="['pagination-item','pagination-prev',{'pagination-item-disabled':page === 1}]" @click="selectPage('prev',1)">上一页</li>
                    <li :class="['pagination-item',{'pagination-item-active': curPage+1 === page}]" v-for="(curPage,index) in total" :key="index" @click="selectPage('select',curPage)">{{ curPage }}</li>
                    <li :class="['pagination-item', 'pagination-next',{'pagination-item-disabled':page === total}]" @click="selectPage('next',1)">下一页</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { formatMsgTime } from "@/utils/utils";
import { get, getStorageOpenid } from "@/utils";
import pagination from "@/components/pagination";
export default {
  onLoad() {
    wx.setNavigationBarTitle({
      title: "反馈列表"
    });
    this.openId = getStorageOpenid();
    (async () => {
      await this.getList(true, this.page);
      console.log("total", this.total);
    })();
  },
  // 下拉刷新 需要覆盖旧的数据
  // 需要在main.js中配置 config: {
  //   enablePullDownRefresh: true
  // }
  onPullDownRefresh() {
    if (this.page >= this.total) {
      this.page = this.total;
    } else {
      this.page += 1;
      this.getList(true, this.page);
      //刷新完成后关闭
      wx.stopPullDownRefresh();
    }
  },
  // 上拉加载 不需要覆盖旧的数据,追加新的数据
  onReachBottom() {
    if (this.page > this.total) {
      this.page = this.total;
      return false;
    }
    this.page += 1;
    this.getList(false, this.page);
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
    // 获取反馈列表
    async getList(first, page) {
      let { data, total } = await get("/feedback/getListAction", {
        openId: this.openId,
        page: page
      });
      // 更新总页数
      this.total = total;
      // 格式化发表时间 1537934367655 => 5小时前
      if (data && data.length) {
        data.forEach((item, index) => {
          item["msg_time"] = formatMsgTime(item["msg_time"]);
        });
        // 上拉刷新
        if (first) {
          this.list = data;
        } else {
          // 下拉加载
          this.list = [...this.list, ...data];
        }
      }
    },
    // 前往详情页
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
    // handleChange({ detail }) {
    //   console.log(detail);
    //   const type = detail.type;
    //   if (type === "next") {
    //     this.page += 1;
    //   } else if (type === "prev") {
    //     this.page -= 1;
    //   }
    // },

    // 分页
    selectPage(type, page) {
      let { page: currentPage, total } = this;
      if (type === "prev") {
        this.page = currentPage <= 1 ? 1 : currentPage - 1;
        currentPage > 1 && this.getList(true, this.page);
      } else if (type === "next") {
        this.page = currentPage >= total ? total : currentPage + 1;
        currentPage < total && this.getList(true, this.page);
      } else {
        if (this.page != page) {
          this.page = page;
          this.getList(true, this.page);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>

