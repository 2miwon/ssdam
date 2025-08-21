import axios from "axios";
import store from "@/store";
import api from "@/api/index";
import router from "@/routes";

const axiosInstance = axios.create({
    withCredentials: true
});

axiosInstance.interceptors.request.use(async (config) => {
    if (store.getters.isTokenExpired) {
        try {
            const response = await axios({
                url: api.auth.reissueToken(),
                method: 'post',
                withCredentials: true,
            })
            const { access_token, access_token_expiration_time } = response.data;

            const now = new Date();
            const expirationTimeUTC = new Date(now.getTime() + access_token_expiration_time * 1000);
            const accessTokenExpirationTime = new Date(expirationTimeUTC.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

            await store.dispatch('saveToken', access_token)
            await store.dispatch('setAccessTokenExpirationTime', accessTokenExpirationTime)
        } catch (error) {
            console.error("Failed to refresh token", error);
            router.push({ name: 'login' })
        }
    }

    config.headers =  store.getters.authHeader;
    return config
})

export default axiosInstance