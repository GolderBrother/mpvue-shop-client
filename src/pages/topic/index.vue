<template>
  <div class="topic">
    <ul class="list">
      <li @click="topicDetail(item.id)" v-for="(item, index) in topicList" :key="index">
        <div class="t-img">
          <img :src="item.scene_pic_url" alt="">
        </div>
        <div class="info">
          <p>{{item.title}}</p>
          <p>{{item.subtitle}}</p>
          <p>{{item.price_info}}元起</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { get } from "@/utils";
export default {
  onPullDownRefresh() {
    this.page = 1;
    this.getListData(true);
    //刷新完成后关闭
    wx.stopPullDownRefresh();
  },
  onReachBottom() {
    this.page = this.page + 1;
    if (this.page > this.total) {
      return false;
    }
    this.getListData();
  },
  onReady(){
    wx.setNavigationBarTitle({
      title:"专题"
    });
  },
  created() {},
  mounted() {
    this.getListData(true);
  },
  data() {
    return {
      topicList: [],
      page: 1,
      total: ""
    };
  },
  components: {},
  methods: {
    async getListData(first) {
      try {
        const data = await get("/topic/listaction", {
          page: this.page
        });
        this.total = data.total;
        if (first) {
          this.topicList = data.data;
        } else {
          //上拉加载跟多
          this.topicList = this.topicList.concat(data.data);
        }
      } catch (error) {
        wx.showToast({
          title: "数据获取失败",
          icon: "loading"
        });
      }
    },
    topicDetail(id) {
      if(id){
        wx.navigateTo({ url: "/pages/topicdetail/main?id=" + id });
      }else{
        wx.showToast({
          icon:"none",
          title:'该专题不存在'
        })
      }
    }
  },
  computed: {}
};
</script>
<style lang='scss' scoped>
@import "./style";
</style>
