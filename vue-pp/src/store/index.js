// vuex核心管理对象模块: store
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state';
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
Vue.use(Vuex);
export default new Vuex.Store({
    // 状态对象
    state,
    
    // 无副作用方法，唯一用于改变state的地方    只能同步  包含多个更新state函数的对象
    mutations,
    // 副作用方法，用于进行逻辑判断，以及拉取数据  可以有异步操作   包含多个对应事件回调函数的对象
    actions,

    getters
})