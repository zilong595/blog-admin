import router from '@/router'
import { getToken, setToken, removeToken } from '@/utils/cookies'

export default {
	state: {
		name: '',
		token: getToken() || '',
	},
	mutations: {
		SET_NAME(state, name) {
			state.name = name
		},
		SET_TOKEN(state, token) {
			state.token = token
			setToken(token);
		},
	},
	actions: {
		setName({ commit }, name) {
			commit('SET_NAME', name)
		},
		setToken({ commit }, token) {
			commit('SET_TOKEN', token)
		},
		getAdminInfo({ commit }) {
			return new Promise((resolve) => {
				commit('SET_NAME', 'test')
				resolve(res)
			})
		},
		logout({ commit }) {
			removeToken();
			commit('SET_TOKEN', '');
			router.push("/login");
		}
	}
}