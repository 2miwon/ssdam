import router from '@/routes'
import axios from 'axios'
import api from '@/api'
import { calculateExpirationTime} from "@/util/dateUtils";
import axiosInstance from "@/api/axiosInstance";


export default {
  state: {
    accessToken: localStorage.getItem('accessToken') || '', // 토큰이 있으면 가져오고 아니면 ''
    accessTokenExpirationTime: '',
    onboardingProcess: 0,
    redirectPath: null,
    isDarkMode: false,
    // noPosterDate: 0,
  },

  // 모든 state는 직접 접근하지 않고 getters를 통해서만 접근
  getters: {
    isLoggedIn: state => !!state.accessToken,
    authHeader: state => ({ Authorization: `Bearer ${state.accessToken}` }),
    redirectPath: state => state.redirectPath,
    isTokenExpired: state => {
      const expirationTime = new Date(state.accessTokenExpirationTime).getTime();
      const currentTime = new Date().getTime();
      return currentTime > expirationTime;
    },
    onboardingProcess: state => state.onboardingProcess,
    checkRecommendWatched: state => state.onboardingProcess & (1<<0),
    checkEditorWatched: state => state.onboardingProcess & (1<<1),
    checkRevisionWatched: state => state.onboardingProcess & (1<<2),
    checkSynonymWatched: state => state.onboardingProcess & (1<<3),
    checkIllustrationWatched: state => state.onboardingProcess & (1<<4),
    isDarkMode: state => state.isDarkMode,
    // showPoster: state => state.noPosterDate !== new Date().getDate(),
  },

  // state를 변경하는 로직은 mutations에서만 처리
  mutations: {
    SET_TOKEN: (state, accessToken) => state.accessToken = accessToken,
    SET_REDIRECT_PATH: (state, path) => state.redirectPath = path,
    SET_ACCESS_TOKEN_EXPIRATION_TIME: (state, accessTokenExpirationTime) => state.accessTokenExpirationTime = accessTokenExpirationTime,
    SET_ONBOARDING_PROCESS: (state, onboardingProcess) => state.onboardingProcess = onboardingProcess,
    SET_DARK_MODE: (state, isDarkMode) => state.isDarkMode = isDarkMode
    // SET_NO_POSTER_DATE: (state) => state.noPosterDate = new Date().getDate(),
  },

  // API 호출 등의 async 작업은 actions에서 처리
  actions: {
    async authorizeGoogle() {
      await axios({
        url: api.auth.authorizeGoogle(),
        method: 'get',
      }).then(res => {
        const { authorization_url } = res.data; // 서버에서 받아온 인증 URL
        window.location.href = authorization_url;
      }).catch(err => {
        console.log(err)
        router.push({ name: 'login' }) // 에러시 로그인 페이지로 이동
      })
    },

    async authorizeNaver() {
      await axios({
        url: api.auth.authorizeNaver(),
        method: 'get',
      }).then(res => {
        const { authorization_url } = res.data; // 서버에서 받아온 인증 URL
        window.location.href = authorization_url;
      }).catch(err => {
        console.log(err)
        router.push({ name: 'login' }) // 에러시 로그인 페이지로 이동
      })
    },

    async authorizeKakao() {
      await axios({
        url: api.auth.authorizeKakao(),
        method: 'get',
      }).then(res => {
        const { authorization_url } = res.data; // 서버에서 받아온 인증 URL
        window.location.href = authorization_url;
      }).catch(err => {
        console.log(err)
        router.push({ name: 'login' }) // 에러시 로그인 페이지로 이동
      })
    },


    async handleGoogleCallback({ dispatch, commit, getters }, urlParams ) {
      await axios({
        url: api.auth.callbackGoogle(),
        method: 'get',
        params: urlParams,
        withCredentials: true
      }).then(res => {
        const { access_token, access_token_expiration_time, onboarding_process } = res.data;
        const accessTokenExpirationTime = calculateExpirationTime(access_token_expiration_time)

        commit('SET_ONBOARDING_PROCESS', onboarding_process)
        dispatch('saveToken', access_token)
        dispatch('setAccessTokenExpirationTime', accessTokenExpirationTime)
        if (getters.redirectPath) {
          router.push(getters.redirectPath)
        } else{
          router.push({ name: 'book' })
        }
      }).catch(err => {
        console.error('Google login failed:', err);
        router.push({ name: 'login' }) // 에러시 로그인 페이지로 이동
      })
    },

    async handleNaverCallback({ commit, dispatch, getters }, urlParams ) {
      await axios({
        url: api.auth.callbackNaver(),
        method: 'get',
        params: urlParams,
        withCredentials: true
      }).then(res => {
        const { access_token, access_token_expiration_time, onboarding_process } = res.data;
        const accessTokenExpirationTime = calculateExpirationTime(access_token_expiration_time)

        commit('SET_ONBOARDING_PROCESS', onboarding_process)
        dispatch('saveToken', access_token)
        dispatch('setAccessTokenExpirationTime', accessTokenExpirationTime)
        if (getters.redirectPath) {
          router.push(getters.redirectPath)
        } else{
          router.push({ name: 'book' })
        }
      }).catch(err => {
        console.error('Naver login failed:', err);
        router.push({ name: 'login' }) // 에러시 로그인 페이지로 이동
      })
    },

    async handleKakaoCallback({ commit, dispatch, getters }, urlParams ) {
      await axios({
        url: api.auth.callbackkakao(),
        method: 'get',
        params: urlParams,
        withCredentials: true
      }).then(res => {
        const { access_token, access_token_expiration_time, onboarding_process } = res.data;
        const accessTokenExpirationTime = calculateExpirationTime(access_token_expiration_time)

        commit('SET_ONBOARDING_PROCESS', onboarding_process)
        dispatch('saveToken', access_token)
        dispatch('setAccessTokenExpirationTime', accessTokenExpirationTime)
        if (getters.redirectPath) {
          router.push(getters.redirectPath)
        } else{
          router.push({ name: 'book' })
        }
      }).catch(err => {
        console.error('Kakao login failed:', err);
        router.push({ name: 'login' }) // 에러시 로그인 페이지로 이동
      })
    },

    async updateUser({ getters, commit }, currentDone ) {
      const onboardingProcess = getters.onboardingProcess | (1<<currentDone)
      commit('SET_ONBOARDING_PROCESS', onboardingProcess)
      await axiosInstance({
        url: api.accounts.update(),
        method: 'put',
        data: {
          onboarding_process: onboardingProcess
        }
      }).then(() => {
      }).catch(() => {
      })
    },

    // state.token 추가
    saveToken({ commit }, accessToken) {
      commit('SET_TOKEN', accessToken)
    },

    setAccessTokenExpirationTime({commit}, accessTokenExpirationTime){
      commit('SET_ACCESS_TOKEN_EXPIRATION_TIME', accessTokenExpirationTime)
    },

    // state.token 삭제
    removeToken({ commit }) {
      commit('SET_TOKEN', '')
    },

    async logOut({ dispatch }) {
      await axiosInstance({
        url: api.accounts.logout(),
        method: 'post',
      })
      .then(() => { // 성공하면 토큰 삭제/사용자 알람
      })
      .catch(err => {
        console.error(err.response)
      })
      dispatch('removeToken')
      localStorage.removeItem('vuex')
    },
  }
}