import { useEffect, useState } from 'react';
import './App.css';
import './bootstrap/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom'; 
import { Header } from './components';
import UserContext from './context/UserContext';
import SwitchControl from './pages';
import { useCookies } from 'react-cookie';
import financeDataApi from './utils/finance-data-api';

function App() {

  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [showHeader, setShowHeader] = useState(true);
  const [messages, setMessages] = useState([]);
  const [cookies, setCookies, removeCookies] = useCookies(['token', 'user', 'date', 'integrationToken','favoriteAssets']);
  const [portfolioAssets, setPortfolioAssets] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assetValueHist, setAssetValueHist] = useState([]);
  const [favoriteAssets, setFavoriteAssets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [sectorExposures, setSectorExposures] = useState([]);
  const [portfolioDividendYield, setPortfolioDividendYield] = useState(0.0);
  const [topPrices, setTopPrices] = useState([]);
  const [portfolioRentability, setPortfolioRentability] = useState(0.0);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [searchingPortfolios, setSearchingPortfolios] = useState(false);

  const initialState = {
    user: user,
    token: token,
    messages: messages,
    showHeader: showHeader,
    messages: messages,
    cookies: cookies,
    portfolioAssets: portfolioAssets,
    assets: assets,
    assetValueHist: assetValueHist,
    favoriteAssets: favoriteAssets,
    date: cookies.date,
    integrationToken: cookies.integrationToken,
    orders: orders,
    portfolios: portfolios,
    searchingPortfolios: searchingPortfolios,
    sectorExposures: sectorExposures,
    portfolioDividendYield: portfolioDividendYield,
    topPrices: topPrices,
    portfolioRentability: portfolioRentability,
    setUser: setUser,
    setToken: setToken,
    setShowHeader: setShowHeader, 
    setMessages: setMessages,
    setCookies: setCookies,
    removeCookies: removeCookies,
    setPortfolioAssets: setPortfolioAssets,
    setAssets: setAssets,
    setAssetValueHist: setAssetValueHist,
    setFavoriteAssets: setFavoriteAssets,
    switchDate: switchDate,
    setOrders: setOrders,
    setPortfolios: setPortfolios,
    setSearchingPortfolios: setSearchingPortfolios,
    handleError: handleError,
    handleSuccess: handleSuccess,
    setSectorExposures: setSectorExposures,
    setPortfolioDividendYield: setPortfolioDividendYield,
    setTopPrices: setTopPrices,
    setPortfolioRentability: setPortfolioRentability,
    mobileSize: mobileSize
  }

  window.onresize = () => {
    setInnerWidth(window.innerWidth)
  }

  function mobileSize() {
    return innerWidth <= 700
  }

  function switchDate(date) {
    setCookies("date", date);
  }

  function handleMessage(type, message) {
    let messages = [...initialState.messages]
    messages.push({
        type: type,
        value: message, 
    });
    initialState.setMessages(messages);
  }

  function handleError(error) {
    handleMessage("error",error.message || error)
  }

  function handleSuccess(successMessage) {
    handleMessage("success",successMessage);
    
  }

  useEffect(() => {
    if(initialState.token == "" && cookies.token != null) {
        setUser(cookies.user);
        setToken(cookies.token);
        return;
    }
    if(initialState.favoriteAssets?.length == 0 && cookies.favoriteAssets?.length > 0) {
      initialState.setFavoriteAssets([
        ...cookies.favoriteAssets
      ])
      return;
    }
    if(!initialState.searchingPortfolios && initialState.portfolios?.length == 0 && cookies.token != null) {
      initialState.setSearchingPortfolios(true);
      financeDataApi.getAllUserPortfolios({},initialState.integrationToken).then((data) => {
        initialState.setPortfolios([...data])
      }).finally(() => {
        setTimeout(() => {
          initialState.setSearchingPortfolios(false);
        },10000);
      })
      return;
    }
  })

  return (
    <UserContext.Provider value={initialState}>
      <Router>
        <Header/>
        <SwitchControl/>
      </Router>  
    </UserContext.Provider>
  );
}

export default App;
