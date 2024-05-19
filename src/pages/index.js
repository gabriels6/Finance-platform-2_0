import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import PortfolioPage from './PortfolioPage';
import './index-styles.css';
import AssetSelectionPage from './AssetSelectionPage';
import AssetRiskPage from './AssetRiskPage';
import OrdersPage from './OrdersPage';
import AssetMaintaince from './AssetMaintaince';
import FundamentalistDataPage from './FundamentalistData';
import ImobiliaryFundsOportunities from './ImobiliaryFundsOportunities';
import StocksOportunities from './StocksOportunities';
import RealtimePortfolioPage from './RealtimePortfolioPage';
import DividendMap from './DividendMap';
import AssetPricesPage from './AssetPricesPage';
import { CrudPage } from '../components';
import DividendProjection from './DividendProjection';
import IncomeTaxReport from './IncomeTaxReport';
import ExchangeRate from './ExchangeRate';
import AssetComposition from './AssetComposition';
import PriceProjection from './PriceProjection';
import DividendsReceived from './DividendsReceived';
import AIInvestments from './AIInvestments';
import InvestmentDivision from './InvestmentDivision';
import PortfolioRiskPage from './PortfolioRiskPage';
import ProjectedPortfolioDividends from './ProjectedPortfolioDividends';

const SwitchControl = () => {

    const routes = [
        [<LoginPage/>, "/login"],
        [<HomePage/>, "/home"],
        [<PortfolioPage/>, "/portfolio"],
        [<AssetSelectionPage/>, "/management/asset-selection"],
        [<AssetRiskPage/>, "/analysis/asset-risk"],
        [<PortfolioRiskPage/>, "/analysis/portfolio-risk"],
        [<OrdersPage/>, "/management/orders"],
        [<AssetMaintaince/>, "/maintainance/asset"],
        [<FundamentalistDataPage/>, "/analysis/fundamentalist-data"],
        [<ImobiliaryFundsOportunities/>, "/analysis/imobiliary-funds-oportunities"],
        [<StocksOportunities/>, "/analysis/stocks-oportunities"],
        [<DividendMap/>, "/analysis/dividend-map"],
        [<RealtimePortfolioPage/>, "/portfolio/realtime-portfolio"],
        [<AssetPricesPage/>, "/maintainance/asset-prices"],
        [<DividendProjection/>, "/projection/dividends"],
        [<AssetComposition/>, "/projection/asset-composition"],
        [<PriceProjection/>, "/projection/prices"],
        [<IncomeTaxReport/>, "/analysis/income-tax-report"],
        [<ExchangeRate/>, "/analysis/exchange-rates"],
        [<CrudPage model='asset_types' fields={{id: 0, name: "", income_tax_identifier: "", created_at: "", updated_at: ""}}/>, "/maintainance/asset-types"],
        [<CrudPage model='sectors' fields={{id: 0, name: "", created_at: "", updated_at: ""}}/>, "/maintainance/sectors"],
        [<CrudPage model='receivables' fields={{asset_id: 0, receivable_type_id: 0, value: 0.0, date: "", payment_date: ""}}/>, "/maintainance/receivables"],
        [<CrudPage model='receivable_types' fields={{id: 0, name: "", income_tax_identifier: "", created_at: "", updated_at: ""}}/>, "/maintainance/receivable-types"],
        [<CrudPage model='currency' fields={{id: 0, symbol: "", name: ""}}/>, "/maintainance/currencies"],
        [<DividendsReceived/>, "/analysis/dividends-received"],
        [<AIInvestments/>, "/ai/investments"],
        [<InvestmentDivision/>, "/portfolio/investment-division"],
        [<ProjectedPortfolioDividends/>, "/projection/portfolio-dividend-growth"]
    ]

    return (
        <>
            <Routes>
                {routes.map((route, index) => (
                    <Route key={index} element={route[0]} path = {route[1]}/>
                ))}
            </Routes>
        </>
    );
}

export default SwitchControl;