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
    async createOrder(id, asset, quantity, price, date, portfolioName, currency, apiKey) {
        const {data} = await api.post('/api/orders', {
            id: id,
            quantity: quantity,
            asset: asset,
            price: price,
            date: date,
            portfolio_name: portfolioName,
            currency: currency,
        },{
            headers: {
                'x_api_key': apiKey
            }
        });

        return data;
    },
    async getPortfolio(portfolioName, date, apiKey) {
        const {data} = await api.get('/api/orders/portfolio', {
            params: {
                portfolio_name: portfolioName,
                date: date
            },
            headers: {
                'x_api_key': apiKey
            }
        });

        return data;
    },
    async getConsolidatedPortfolio(date, apiKey) {
        const {data} = await api.get('/api/portfolio/consolidated_portfolio', {
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
    async getAssetData(symbol, startDate, endDate, apiKey) {

        const {data} = await api.get('/api/assets', {
            params: {
                external_id: symbol,
                start_date: startDate,
                end_date: endDate,
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
    async getAssetPriceHist(symbol, startDate, endDate, currency, apiKey) {
        return await this.apiGet('/api/asset_prices',{
            symbol: symbol,
            start_date: startDate,
            end_date: endDate,
            currency: currency
        }, apiKey);
    },
    async getProjectedPrice(projectionQuery, apiKey) {
        return await this.apiGet('/api/projection/projected_price', projectionQuery, apiKey)
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
    async importDividends(body = {symbol: ""}, apiKey) {
        return await this.apiPost('/api/integrator/assets/import_stock_dividends', body, apiKey)
    },
    async getFundamentalistData(params = {symbol: "", date:null}, apiKey) {
        return await this.apiGet('/api/fundamentalist_data', params, apiKey);
    },
    async calculateVar(params = {
        symbol: "",
        reliability: 95.0,
        expected_return: 0.0,
        initial_date: "",
        final_date: "",
        amount: ""
    }, apiKey) {
        return await this.apiGet('/api/risk/var/calculate_asset', params, apiKey);
    },
    async getImobiliaryFundsdata(params = {}, apiKey) {
        return await this.apiGet('/api/integrator/assets/all_imobiliary_funds_data', params, apiKey);
    },
    async getStocksData(params = {}, apiKey) {
        return await this.apiGet('/api/integrator/assets/all_stocks_data', params, apiKey);
    },
    async getDividendsData(params = {}, apikey) {
        return await this.apiGet('/api/integrator/assets/stock_dividends', params, apikey);
    },
    async getAllUserPortfolios(params = {}, apiKey) {
        return await this.apiGet('/api/portfolio', params, apiKey);
    },
    async getRealtimeAssets(params = {}, apiKey) {
        return await this.apiGet('/api/integrator/assets/current_stocks_data', params, apiKey);
    },
    async getDividendsProjection(params = {}, apiKey) {
        return await this.apiGet('/api/projection/dividends', params, apiKey);
    },
    async getIncomeTaxPortfolio(params = {}, apiKey) {
        return await this.apiGet('/api/income_tax/from_portfolio', params, apiKey);
    },
    async importExchangeRates(params = {}, apiKey) {
        return await this.apiPost('/api/integrator/exchange_rates/import', params, apiKey);
    },
    async getExchangeRates(params = {}, apiKey) {
        return await this.apiGet('/api/exchange_rates/',params, apiKey);
    },
    async getAssetComposition(body = {
        asset_data: [{
            symbol: "",
            quantity: 0.0,

        }]
    }, apiKey) {
        return await this.apiPost('/api/projection/asset_composition',body, apiKey);
    },
    async getTopPrices(params = {}, apiKey) {
        return await this.apiGet('/api/assets/top_prices', params, apiKey);
    },
    async getReceivedValues(params = {}, apiKey) {
        return await this.apiGet('/api/receivables/received_values', params, apiKey)
    }
}