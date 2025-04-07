import { wait } from '@testing-library/user-event/dist/utils';
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
    async internalSearchAsset(symbol, startDate, apiKey) {

        const {data} = await api.get('/api/assets/search', {
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
    async getProfitsLosses(date, apiKey) {
        const {data} = await api.get('/api/portfolio/profits_losses_from_sales', {
            params: {
                date: date,
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
    async importYahooYearlyQuotes(symbol, apiKey) {
        return await this.apiPost('/api/integrator/assets/import_yahoo_yearly_quotes', { symbol: symbol }, apiKey);
    },
    async importYahooHistoricalQuotes(symbol, apiKey) {
        return await this.apiPost('/api/integrator/assets/import_yahoo_historical_quotes', { symbol: symbol }, apiKey);
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
    async deleteInvestmentDivision(params, apiKey) {
        return await this.apiDelete('/api/investment_division', params, apiKey);
    },
    async importFundamentalistData(body = {symbol: "", type: ""}, apiKey) {
        return await this.apiPost('/api/integrator/assets/import_overview', body, apiKey)
    },
    async importDividends(body = {symbol: ""}, apiKey) {
        return await this.apiPost('/api/integrator/assets/import_stock_dividends', body, apiKey)
    },
    async createInvestmentDivision(body = { asset: "", value: 0.0 }, apiKey) {
        return await this.apiPost('/api/investment_division', body, apiKey)
    },
    async getInvestmentDivisions(params = {}, apiKey) {
        return await this.apiGet('/api/investment_division', params, apiKey)
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
    async calculatePortfolioVar(params = {
        portfolio_name:"",
        date:"",

    }, apiKey) {
        return await this.apiGet('/api/risk/var/calculate_portfolio', params, apiKey);
    },
    async calculateHistoricalVar(params = {
        symbol: "",
        date: "",
        amount: 0
    }, apiKey) {
        return await this.apiGet('/api/risk/var/calculate_historical_asset', params, apiKey)
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
    async importExchangeRatesHistorical(params = {}, apiKey) {
        return await this.apiPost('/api/integrator/exchange_rates/import_historical', params, apiKey);
    },
    async importAllDailyQuotes(params = {}, apiKey) {
        return await this.apiGet('/api/integrator/quotes/import_daily_quotes', params, apiKey);
    },
    async importDailyQuote(symbol, apiKey) {
        return await this.apiGet('/api/integrator/quotes/import', { symbol: symbol }, apiKey);
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
    },
    async getAIResultData(params = {}, apiKey) {
        return await this.apiGet('/api/intel/investments/check_asset', params, apiKey)
    },
    async trainInvestmentAI(params = {}, apiKey) {
        return await this.apiGet('/api/intel/investments/train', params, apiKey)
    },
    async getAITrainingItems(params = {}, apiKey) {
        return await this.apiGet('/api/intel/investments/train_items', params, apiKey)
    },
    async getProjectedPortfolioDividendsGrowth(params = {}, apiKey) {
        return await this.apiGet('/api/projection/projected_dividends_growth', params, apiKey)
    },
    async getEconomicIndexes(params = {}, apiKey) {
        return await this.apiGet('/api/economic_indexes',{}, apiKey)
    },
    async getStocksDividends(params = {}, apiKey) {
        return await this.apiGet('/api/receivables/stock_dividends', params, apiKey)
    },
    async saveEconomicIndex(body = {}, apiKey) {
        return await this.apiPost('/api/economic_indexes', body, apiKey)
    },
    async importEconomicIndexSeries(body = {}, apiKey) {
        return await this.apiPost('/api/integrator/indexes/import_series', body, apiKey)
    },
    async importBrazilianQuotes(token, apiKey) {
        const {data} = await api.post('api/finance_open/import_quotes', {}, {
            headers: {
                'x_api_key': apiKey,
                'token': token

            }
        });
        return data;
    },
    async financeOpenSearchAsset(keyword, token, apiKey) {
        const {data} = await api.get('api/finance_open/search_assets', {
            params: {
                keyword
            },
            headers: {
                'x_api_key': apiKey,
                'token': token

            }
        });
        return data;
    },
    async financeOpenImportAsset(symbol, country, token, apiKey) {
        const {data} = await api.get('api/finance_open/import_asset', {
            params: {
                symbol,
                country
            },
            headers: {
                'x_api_key': apiKey,
                'token': token

            }
        });
        return data;
    },
    async importTwelveDataEodPrices(symbols, apiKey) {
        return await this.apiGet('/api/integrator/quotes/import_twelve_data_eof_prices', { symbols }, apiKey)
    },
    async saveEarnings(body, apiKey) {
        return await this.apiPost('/api/income_tax/earnings', body, apiKey);
    },
    async getEarnings(apiKey) {
        return await this.apiGet('/api/income_tax/earnings',{}, apiKey);
    },
    async deleteEarning(date, asset_symbol, apiKey) {
        return await this.apiDelete('/api/income_tax/earnings', {
            date: date,
            asset_symbol: asset_symbol
        }, apiKey)
    },
    async savePtax(body, apiKey) {
        return await this.apiPost('/api/income_tax/ptax', body, apiKey);
    },
    async getPtax(year, apiKey) {
        return await this.apiGet('/api/income_tax/ptax',{}, apiKey);
    },
    async deletePtax(month, year, apiKey) {
        return await this.apiDelete('/api/income_tax/ptax', {
            month: month,
            year: year
        }, apiKey)
    },
    async getEarningMonthlyReport(date, apiKey) {
        return await this.apiGet('/api/income_tax/earnings/report', {
            date: date
        }, apiKey)
    },
    async getStockPricesByDay(date, apiKey) {
        return await this.apiGet('/api/asset_prices/stocks_prices_by_day', {
            date: date
        }, apiKey)
    },
    async editStockPrice(symbol, date, price, apiKey) {
        return await this.apiPost('/api/asset_prices/edit_stock_price', {
            symbol,
            date,
            price
        }, apiKey)
    }
}