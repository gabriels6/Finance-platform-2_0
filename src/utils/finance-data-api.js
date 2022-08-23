import axios from 'axios';

const financeDataUrl = process.env.REACT_APP_FINANCE_DATA_API_URL
const api = axios.create({
    baseURL: financeDataUrl
});

export default {
    async apiGet(url, params, apiKey) {
        const {data} = await api.get(url, {
            params,
            headers: {
                'x_api_key': apiKey
            }
        });

        return data;
    },
    async apiPost(url, body, apiKey) {
        const {data} = await api.post(url, body, {
            headers: {
                'x_api_key': apiKey
            }
        });

        return data;
    },
    async apiDelete(url, params, apiKey) {
        const { data } = await api.delete(url, {
            params,
            headers: {
                'x_api_key': apiKey
            }
        });
        return data;
    },
    async getAssets(apiKey) {

        const {data} = await api.get('/api/assets', { 
            headers: {
                'x_api_key': apiKey
            }
        });

        return data;
    },
    async importAssetSeries(symbol, startDate, apiKey) {
        return await this.apiGet('/api/integrator/quotes/import_series', {
            symbol: symbol,
            start_date: startDate
        },apiKey);
    },
    async createOrder(asset, quantity, date, apiKey) {
        const {data} = await api.post('/api/orders', {
            quantity: quantity,
            asset: asset,
            date: date
        },{
            headers: {
                'x_api_key': apiKey
            }
        });

        return data;
    },
    async getPortfolio(date, apiKey) {
        const {data} = await api.get('/api/orders/portfolio', {
            params: {
                date: date
            },
            headers: {
                'x_api_key': apiKey
            }
        });

        return data;
    },
    async searchAsset(symbol, startDate, apiKey) {

        const {data} = await api.get('/api/integrator/assets/search', {
            params: {
                symbol: symbol,
                start_date: startDate
            },
            headers: {
                'x_api_key': apiKey
            }
        });

        return data;
    },
    async getAssetData(symbol, apiKey) {

        const {data} = await api.get('/api/assets', {
            params: {
                external_id: symbol,
            },
            headers: {
                'x_api_key': apiKey
            }
        });

        return data;
    },
    async importAsset(symbol, apiKey) {

        const {data} = await api.get('/api/integrator/assets/import', {
            params: {
                symbol: symbol,
            },
            headers: {
                'x_api_key': apiKey
            }
        });

        return data;
    },
    async importSeries(symbol, startDate, apiKey) {

        const {data} = await api.get('/api/integrator/assets/import_series', {
            params: {
                start_date: startDate,
                symbol: symbol,
            },
            headers: {
                'x_api_key': apiKey
            }
        });

        return data;
    },
    async getPortfolio(date, apiKey) {
        return await this.apiGet('/api/orders/portfolio',{
            date: date
        }, apiKey);
    },
    async getAssetPriceHist(symbol, startDate, endDate, apiKey) {
        return await this.apiGet('/api/asset_prices',{
            symbol: symbol,
            end_date: endDate
        }, apiKey);
    },
    async saveAsset(assetBody, apiKey) {
        return await this.apiPost('/api/assets', assetBody, apiKey);
    },
    async deleteAsset(params, apiKey) {
        return await this.apiDelete('/api/assets', params, apiKey);
    },
    async importFundamentalistData(body = {symbol: "", type: ""}, apiKey) {
        return await this.apiPost('/api/integrator/assets/import_overview', body, apiKey)
    },
    async getFundamentalistData(params = {symbol: "", date:null}, apiKey) {
        return await this.apiGet('/api/fundamentalist_data', params, apiKey);
    }
}