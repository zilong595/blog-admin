import { createStore } from 'vuex'
import getters from "./getters"
import admin from './modules/admin'
import tagsView from './modules/tags-view'
const store = {
    getters,
    modules: {
        admin,
        tagsView
    }
}

export default createStore(store)
