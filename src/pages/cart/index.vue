<template>
  <div class="cart">
    <div class="top">
      <div>30天无忧退货</div>
      <div>48小时快速退款</div>
      <div>满88元免邮费</div>
    </div>
    <div v-if="listData.length !== 0" class="cartlist">
      <div class="item" @click="goGoodsDetail(item.goods_id)" @touchstart="startMove" @touchmove="deleteGoods" @touchend="endMove" :data-index="index" v-for="(item,index) in listData"
        :key="index">
        <div class="con" :style="item.textStyle">
          <div class="left">
            <!-- @click.stop mpvue 阻止事件冒泡 -->
            <div class="icon" @click.stop="changeColor(index,item.goods_id)" :class="[ Listids[index] ? 'active' : '',{active:allcheck}]"></div>
            <div class="img">
              <img :src="item.list_pic_url" alt="">
            </div>
            <div class="info">
              <p>{{item.goods_name}}</p>
              <p>￥{{item.retail_price}}</p>
            </div>
          </div>
          <div class="right">
            <div class="num">
              x{{item.number}}
            </div>
          </div>
        </div>

        <div @click.stop="delGoods(item.id,index)" class="delete" :style="item.textStyle1">
          <div>
            删除
          </div>
        </div>

      </div>
    </div>
    <div v-else class="cart-empty">
      <div class="center">
        <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/noCart-a8fe3f12e5.png" alt="">
        <p>
          购物车空空如也！快去<span class="home" @click="goHome">逛逛</span>吧
        </p>
      </div>
    </div>
    <div v-if="listData.length !== 0" class="fixed">
      <div @click="allCheck" :class="{active:allcheck}" class="left">
        全选({{isCheckedNumber}})
      </div>
      <div class="right">
        <div>
          ￥{{allPrise}}
        </div>
        <div @click="orderDown">下单</div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post, login, getStorageOpenid } from "@/utils";
export default {
  onShow() {
    this.openId = getStorageOpenid();
    this.getListData();
  },
  onReady(){
    wx.setNavigationBarTitle({
      title:"购物车"
    });
  },
  created() {},
  data() {
    return {
      openId: "",
      allcheck: false,
      listData: [],
      Listids: [],
      userInfo: {},
      tranX: 0,
      tranX1: 0,
      startX: "",
      startY: "",
      moveX: "",
      moveY: "",
      moveEndX: "",
      moveEndY: "",
      X: 0,
      Y: ""
    };
  },
  components: {},
  methods: {
    initTextStyle() {
      //滑动之前先初始化数据
      this.listData.forEach((item,index) => {
        item.textStyle = "";
        item.textStyle1 = "";
      });
    },
    startMove(e) {
      this.initTextStyle();
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
    },
    deleteGoods(e) {
      //滑动之前先初始化样式数据
      this.initTextStyle();
      // 获取自定义属性值
      const index = e.currentTarget.dataset.index;
      console.log(index);
      if (this.X <= -100) {
        this.flag = true;
      }
      if (!this.flag) {
        this.moveX = e.touches[0].pageX;
        this.moveY = e.touches[0].pageY;
        this.X = this.moveX - this.startX;
        this.Y = this.moveX - this.startY;
        this.listData[index].textStyle = `transform:translateX(${
          this.tranX
        }rpx);`;
        if (this.X >= 100) {
          this.X = 0;
        }
        this.tranX = this.X;
        if (this.X <= -100) {
          this.X = -100;
        }
        this.tranX1 = this.X;
        this.listData[index].textStyle1 = `transform:translateX(${
          this.tranX1
        }rpx);`;
      } else {
        this.moveX = e.touches[0].pageX;
        this.moveY = e.touches[0].pageY;
        this.X = this.moveX - this.startX;
        this.Y = this.moveX - this.startY;

        this.tranX = this.X - 100;
        this.listData[index].textStyle = `transform:translateX(${
          this.tranX
        }rpx);`;
        // transform:'translateX(' + tranX + 'rpx)'

        console.log(this.listData[index].textStyle);

        if (this.X + -100 > -100) {
          this.flag = false;
        }
        this.tranX1 = -100;
        this.listData[index].textStyle1 = `transform:translateX(-100rpx);`;
        console.log(this.listData[index].textStyle1);
        // this.listData = this.listData;
      }
      // if (Math.abs(this.X) > Math.abs(this.Y) && this.X > 20) {
      //   this.scrollflag = false;
      // } else if (Math.abs(this.X) > Math.abs(this.Y) && this.X < 20) {
      //   console.log("right 2 left");
      // }
    },
    endMove(e) {
      const index = e.currentTarget.dataset.index;
      if (this.X > -50) {
        this.tranX1 = 0;
        this.tranX = 0;
        this.listData[index].textStyle = `transform:translateX(${
          this.tranX
        }rpx);`;
        this.listData[index].textStyle1 = `transform:translateX(${
          this.tranX1
        }rpx);`;
      } else if (this.X <= -50) {
        this.tranX1 = -100;
        this.tranX = -100;
        this.listData[index].textStyle = `transform:translateX(${
          this.tranX
        }rpx);`;
        this.listData[index].textStyle1 = `transform:translateX(${
          this.tranX1
        }rpx);`;
      }
    },
    // 下单
    async orderDown() {
      console.log(this.Listids)
      if (this.Listids.length == 0) {
        wx.showToast({
          title: "请选择商品",
          icon: "none",
          duration: 1500
        });
        return false;
      }
      // 去掉数组中空的false的
      let newgoodsid = [];
      this.Listids.forEach((item,index) => {
        if (item) {
          newgoodsid.push(item);
        }
      }); 
      let goodsId = newgoodsid.join(",");
      const {data} = await post("/order/submitAction", {
        goodsId: goodsId,
        openId: this.openId,
        allPrise: this.allPrise
      });
      if (data) {
        wx.navigateTo({
          url: "/pages/order/main"
        });
      }
    },
    // 删除商品
    async delGoods(id, index) {
      wx.showModal({
        title: "",
        content: "是否要删除该商品",
        success: async (res) => {
          if (res.confirm) {
            this.Listids.splice(index, 1);
            const { data } = await get("/cart/deleteAction", {
              id: id
            });
            console.log(data);
            if(data){
              this.getListData();
            }
          } else if (res.cancel) {
            console.log("用户点击取消");
            //滑动之前先初始化样式数据
            this.initTextStyle();
          }
        }
      });
    },
    // 获取购物车商品列表
    async getListData() {
      try {
        const { data } = await get("/cart/cartList", {
          openId: this.openId
        });
        if (!data) return;
        data.forEach((item,index) => {
          item.textStyle = "";
          item.textStyle1 = "";
        });
        this.listData = data;
      } catch (error) {
        console.log(error)
        // wx.showToast({
        //   title:"数据获取失败",
        //   icon: 'loading',
        // });
      }
    },
    // 全选
    allCheck() {
      //先清空所有
      this.Listids = [];
      if (this.allcheck) {
        this.allcheck = false;
      } else {
        console.log("选择全部");
        this.allcheck = true;
        //循环遍历所有的商品id
        this.listData.forEach((item,index) => {
          this.Listids.push(item.goods_id);
        });
      }
    },
    change(e) {},
    changeColor(index, id) {
      if (this.Listids[index]) {
        this.$set(this.Listids, index, false);
      } else {
        this.$set(this.Listids, index, id);
      }
    },
    // 跳转商品详情
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
    // 跳转首页
    goHome(){
      wx.switchTab({
        url:"/pages/index/main"
      });
    }
  },
  computed: {
    // 计算选中的商品数
    isCheckedNumber() {
      let number = 0;
      this.Listids.forEach(item => {
        if(item) number++;
      })
      this.allcheck = (number == this.listData.length && number != 0) ? true : false;
      return number;
    },
    // 计算总价
    allPrise() {
      let Prise = 0;
      this.Listids.forEach((item,i) => {
        if(item){
          const goodsData = this.listData[i]; 
          Prise += goodsData.retail_price * goodsData.number;
        }
      })
      return Prise;
    }
  }
};
</script>
<style lang='scss' scoped>
@import "./style";
</style>
