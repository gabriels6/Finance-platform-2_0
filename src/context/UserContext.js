import React from 'react';

export default React.createContext({
    user: "",
    token: "",
    showHeader: true,
    messages: [],
    assets: [],
    assetValueHist: [],
    cookies: {},
    favoriteAssets: [],
    date: "",
    integrationToken: "",
    orders: [],
    sectorExposures: [],
    portfolios: [],
    portfolioAssets: {},
    portfolioDividendYield: 0.0,
    topPrices: [],
    setUser: (newUser) => { },
    setToken: (newToken) => { },
    setShowHeader: (newShowHeader) => { },
    setMessages: (newMessages) => { },
    setCookies: (cookieName, cookieValue) => { },
    removeCookies: (cookieName) => { },
    setAssets: (newAssets) => { },
    setAssetValueHist: (newAssetValueHist) => { },
    setFavoriteAssets: (newFavoriteAssets) => { },
    switchDate: (newDate) => { },
    setOrders: (newOrders) => { },
    setPortfolios: (newPortfolios) => { },
    setSectorExposures: (newSectorExposures) => { },
    setPortfolioAssets: (newPortfolioAssets) => { },
    setPortfolioDividendYield: (newPortfolioDividendYield) => { },
    setTopPrices: (newTopPrices) => { }
});