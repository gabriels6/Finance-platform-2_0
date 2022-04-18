import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import PortfolioPage from './PortfolioPage';
import './index-styles.css';
import AssetSelectionPage from './AssetSelectionPage';
import AssetRiskPage from './AssetRiskPage';
import OrdersPage from './OrdersPage';

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
            </Routes>
        </>
    );
}

export default SwitchControl;