const home = {
  state: {
    cityName: "定位中.."
  },
  actions: {
      update({commit},config){
        commit("UPDATE",config)
      }
  },
  mutations: {
    /**
     * 更新定位城市
     * @param {Object} state 
     * @param {Object} config {cityName:""}
     */
    UPDATE(state, config) {
      Object.keys(config).map((item, index) => {
        state[item] = config[item]
      })
    }
  }
}
export default home;
