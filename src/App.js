import { useEffect, useState } from 'react';
import './App.css';
import './bootstrap/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom'; 
import { Header } from './components';
import UserContext from './context/UserContext';
import SwitchControl from './pages';
import { useCookies } from 'react-cookie';

function App() {

  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [showHeader, setShowHeader] = useState(true);
  const [messages, setMessages] = useState([]);
  const [cookies, setCookies, removeCookies] = useCookies(['token', 'user', 'date', 'integrationToken']);
  const [assets, setAssets] = useState([]);
  const [assetValueHist, setAssetValueHist] = useState([]);
  const [favoriteAssets, setFavoriteAssets] = useState([]);
  const [orders, setOrders] = useState([]);

  const initialState = {
    user: user,
    token: token,
    messages: messages,
    showHeader: showHeader,
    messages: messages,
    cookies: cookies,
    assets: assets,
    assetValueHist: assetValueHist,
    favoriteAssets: favoriteAssets,
    date: cookies.date,
    integrationToken: cookies.integrationToken,
    orders: orders,
    setUser: setUser,
    setToken: setToken,
    setShowHeader: setShowHeader, 
    setMessages: setMessages,
    setCookies: setCookies,
    removeCookies: removeCookies,
    setAssets: setAssets,
    setAssetValueHist: setAssetValueHist,
    setFavoriteAssets: setFavoriteAssets,
    switchDate: switchDate,
    setOrders: setOrders,
  }

  function switchDate(date) {
    setCookies("date", date);
  }

  useEffect(() => {
    if(initialState.token == "" && cookies.token != null) {
      setUser(cookies.user);
      setToken(cookies.token);
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
