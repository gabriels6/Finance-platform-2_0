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

const SwitchControl = () => {
    return (
        <>
            <Routes>
                <Route element={<LoginPage/>} path="/login"/>
                <Route element={<HomePage/>} path="/home"/>  
                <Route path="/personal-finances">
                    Personal Finances Pages
                </Route>
                <Route element={<PortfolioPage/>} path="/portfolio"/>
                <Route path="/management">
                    Management page
                </Route>
                <Route element={<AssetSelectionPage/>} path="/management/asset-selection"/>
                <Route element={<AssetRiskPage/>} path="/analysis/asset-risk"/>
                <Route element={<OrdersPage/>} path="/management/orders"/>
                <Route element={<AssetMaintaince/>} path="/maintainance/asset"/>
                <Route element={<FundamentalistDataPage/>} path="/analysis/fundamentalist-data"/>
                <Route element={<ImobiliaryFundsOportunities/>} path="/analysis/imobiliary-funds-oportunities"/>
                <Route element={<StocksOportunities/>} path="/analysis/stocks-oportunities"/>
                <Route element={<DividendMap/>} path="/analysis/dividend-map"/>
                <Route element={<RealtimePortfolioPage/>} path="/portfolio/realtime-portfolio"/>
            </Routes>
        </>
    );
}

export default SwitchControl;