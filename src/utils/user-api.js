import axios from 'axios';

const apiUrl = process.env.REACT_APP_USER_API_URL
const api = axios.create({
    baseURL: apiUrl
});

export default {
    async authUser(username = '', password = '') {

        const { data } = await api.post('/auth', {
            email: username,
            password: password
        })

        return data;
    }
}