export default ({
	state: {
		//visitedTab: '',
		openedTabs: [
			{ title: '首页', name: 'ConsoleView', path: '/console', closable: false }
		],
		cachedTabs: [],
	},
	mutations: {
		ADD_TAB(state, tab) {
			state.openedTabs.push(tab);
			state.cachedTabs.push(tab.name);
		},
		REMOVE_TAB(state, tabName) {
			state.openedTabs = state.openedTabs.filter(tab => tab.name !== tabName);
			state.cachedTabs = state.cachedTabs.filter(cache => cache !== tabName);
		},
		SET_OPENED_TABS(state, tabs) {
			state.openedTabs = tabs;
		},
		SET_CACHED_TABS(state, tabs) {
			state.cachedTabs = tabs;
		},
	},
	actions: {
		addView({ commit }, tab) {
			commit('ADD_TAB', tab);
		},
		removeTab({ commit }, tabName) {
			commit('REMOVE_TAB', tabName);
		},
		setOpenedTabs({ commit }, tabs) {
			commit('SET_OPENED_TABS', tabs);
		},
		setCachedTabs({ commit }, tabs) {
			commit('SET_CACHED_TABS', tabs);
		}
	}
})