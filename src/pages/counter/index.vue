<template>
  <div class="counter-warp">
    <p>Vuex counter：{{ count }}</p>
    <p>
      <button @click="increment">+</button>
      <button @click="decrement">-</button>
    </p>

    <a href="/pages/index/main" class="home">去往首页</a>
  </div>
</template>

<script>
// Use Vuex

import store from './store'

export default {
  created () {
    // console.log(this.$root.$mp.query);
    
  },
  mounted() {
    console.log(this.$root.$mp.query);

    
  },
  computed: {
    count () {
      return store.state.count
    }
  },
  methods: {
    increment () {
      // store.dispatch("increate")
      store.commit('INCREATE')
    },
    decrement () {
      // store.dispatch("decreate")
      store.commit('DECREATE')
    }
  }
}
</script>

<style>
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1rpx solid blue;
}
</style>
