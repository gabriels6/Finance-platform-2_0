import React, { useContext, useState } from 'react';
import './styles.css';
import { scaleOrdinal } from 'd3-scale';
import UserContext from '../../context/UserContext';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, CartesianGrid, XAxis, YAxis, Legend, BarChart, Bar } from 'recharts'
import { schemeCategory10 } from 'd3-scale-chromatic';
import groupMethods from '../../utils/group-methods';
import financeDataApi from '../../utils/finance-data-api';
import { FormSelect } from 'react-bootstrap';

const PortfolioPage = () => {

    const colors = scaleOrdinal(schemeCategory10).range();

    const userContext = useContext(UserContext);

    const [topPriceMethod, setTopPriceMethod] = useState('min_prices')

    const [currency, setCurrency] = useState("")

    const [plWithDividends, setPlWithDividends] = useState(false);

    function clearPortfolio(){
        setCurrency("")
        userContext.setTopPrices([])
        userContext.setPortfolioAssets([]);
        userContext.setSectorExposures([]);
        userContext.setPortfolioDividendYield(0.0);
        userContext.setPortfolioRentability(0.0);
    }

    function handleGetPortfolio(event) {
        clearPortfolio()
        let apiKey = userContext.integrationToken;
        financeDataApi.getPortfolio(event.currentTarget.id, userContext.date, apiKey).then((data) => {
            // let promises = []
            let nav = data.amount || 0.0
            let assetItems = data.orders
            let sectorExposures = data.sector_exposure
            let rentability = data.rentability
            let symbolsString = ""
            let currentCurrency = ""
            assetItems.forEach((assetItem) => {
                assetItem.percentage = 0.0
                if(nav != 0.0)
                    assetItem.percentage = (assetItem.converted_value || assetItem.value)/nav;
                currentCurrency = assetItem.financial_portfolio.currency.symbol
                if(assetItem.converted_value) assetItem.converted_value = +(+assetItem.converted_value)?.toFixed(2)
                if(assetItem.value) assetItem.value = +(+assetItem.value)?.toFixed(2)
                assetItem.rentability = ((assetItem?.value/assetItem?.purchase_value - 1.0) * 100.0)?.toFixed(2)
                assetItem.rentabilityAmount = (assetItem?.converted_value ? (assetItem?.converted_value - assetItem?.converted_purchase_value) : (assetItem?.value - assetItem?.purchase_value))?.toFixed(2)
                assetItem.rentabilityLabel = assetItem.asset?.symbol + " (" + (+assetItem.rentability)?.format({ decimalPlaces: 2}) + "%)"
                symbolsString += assetItem.asset.symbol + ","
                assetItem.convertedDividend = (assetItem.value||assetItem.converted_value) * (assetItem.dividend_yield||0.0)
                // promises.push(financeDataApi.getAssetPriceHist(assetItem.asset.symbol,'',userContext.date, '', apiKey))
            })
            setCurrency(currentCurrency)
            financeDataApi.getTopPrices({
                symbols: symbolsString,
                date: userContext.date,
                method: topPriceMethod
            }, apiKey).then((data) => {
                userContext.setTopPrices(data);
            })
            // Promise.all(promises).then((assets) => {
            //     userContext.setAssetValueHist([...assets.flat(1)])
            // })
            userContext.setPortfolioAssets([...assetItems.sort((a,b) => a?.value - b?.value) ]);
            userContext.setSectorExposures([...sectorExposures]);
            userContext.setPortfolioDividendYield(data.portfolio_dividend_yield);
            userContext.setPortfolioRentability(rentability);
        });
        
    }

    function handleGetConsolidatedPortfolio(event) {
        clearPortfolio()
        let apiKey = userContext.integrationToken;
        financeDataApi.getConsolidatedPortfolio(userContext.date, apiKey).then((data) => {
            // let promises = []
            let nav = data.amount || 0.0
            let assetItems = data.orders
            let sectorExposures = data.sector_exposure
            assetItems.forEach((assetItem) => {
                if(nav != 0.0)
                    assetItem.percentage = (assetItem.converted_value || assetItem.value)/nav;
                if(assetItem.converted_value) assetItem.converted_value = +(+assetItem.converted_value)?.toFixed(2)
                if(assetItem.value) assetItem.value = +(+assetItem.value)?.toFixed(2)
                assetItem.symbol = assetItem.asset?.symbol
                assetItem.rentability = ((assetItem?.value/assetItem?.purchase_value - 1.0) * 100.0)?.toFixed(2)
                assetItem.rentabilityAmount = (assetItem?.converted_value ? (assetItem?.converted_value - assetItem?.converted_purchase_value) : (assetItem?.value - assetItem?.purchase_value))?.toFixed(2)
                assetItem.rentabilityLabel = assetItem.asset?.symbol + " (" + (+assetItem.rentability)?.format({decimalPlaces: 2}) + "%)"
                assetItem.convertedDividend = (assetItem.value||assetItem.converted_value) * (assetItem.dividend_yield||0.0)
                // promises.push(financeDataApi.getAssetPriceHist(assetItem.asset.symbol,'',userContext.date, 'BRL',apiKey))
            })
            setCurrency("BRL")
            // Promise.all(promises).then((assets) => {
            //     userContext.setAssetValueHist([...assets.flat(1)])
            // })
            userContext.setPortfolioAssets([...assetItems.sort((a,b) => a?.converted_value - b?.converted_value)]);
            userContext.setSectorExposures([...sectorExposures]);
            userContext.setPortfolioDividendYield(data.portfolio_dividend_yield)
            userContext.setPortfolioRentability(data.rentability);
        });
    }

    function handleTopPriceMethod(event) {
        setTopPriceMethod(event.target.value)
        console.log(topPriceMethod)
    }

    return (
        <div className="control">
            <div className="title">
                Portfolio
            </div>
            <div className={"card " + ( userContext.mobileSize() ? "value-header" : "" )}>
                <div className="value-section">
                    <div className="info-text">
                        Nav
                    </div>
                    <div className="value-text">
                        {userContext.portfolioAssets.reduce((prevNav, item) => {
                            return prevNav + (item.converted_value || item.value)
                        }, 0.0).format({ decimalPlaces: 2, currency: currency}) }
                    </div>
                </div>
                <div className="value-section">
                    <div className="info-text">
                        Invested Amount
                    </div>
                    <div className="value-text">
                        {userContext.portfolioAssets.reduce((prevNav, item) => {
                            return prevNav + (item.converted_purchase_value || item.purchase_value)
                        }, 0.0).format({ decimalPlaces: 2, currency: currency}) }
                    </div>
                </div>
                <div className="value-section">
                    <div className="info-text">
                        Quantity
                    </div>
                    <div className="value-text">
                        { userContext.portfolioAssets.reduce((prevNav, item) => {
                            return prevNav + item.quantity
                        }, 0.0).format({ decimalPlaces: 2}) }
                    </div>
                </div>
                <div className="value-section">
                    <div className="info-text">
                        Portfolio Rentability
                    </div>
                    <div className="value-text">
                        { (userContext.portfolioRentability * 100)?.format({ decimalPlaces: 2}) }%
                    </div>
                </div>
                <div className="value-section">
                    <div className="info-text">
                        Portfolio Yield
                    </div>
                    <div className="value-text">
                        { (userContext.portfolioDividendYield * 100)?.format({ decimalPlaces: 2}) }%
                    </div>
                </div>
            </div>
            <div className='card horizontal-align value-header'>
                <div className={( userContext.mobileSize() ? "small-" : "" ) + "title center"}>
                    Portfolios
                </div>
                <div className='horizontal-align value-header'>
                    {userContext.portfolios.map((item, index) => {
                        return (
                            <div key={index} className='card' id={item.name} currency={item.currency?.symbol} onClick={handleGetPortfolio}>
                                {item.name} - ({item.currency?.symbol})
                            </div>
                        )
                    })}
                    <div className='card' id='consolidated-portfolio' onClick={handleGetConsolidatedPortfolio}>
                        Consolidated Portfolio - BRL
                    </div>
                </div>  
            </div>
            <div className="horizontal-align">
                <div className={"card vertical-align " + ( userContext.mobileSize() ? "portfolio-graphic-subtitle-small" : "portfolio-graphic-subtitle" )}>
                    <div className={( userContext.mobileSize() ? "small-" : "" ) + "title"}>
                        Portfolio Assets
                    </div>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={userContext.portfolioAssets.map((item) => ({...item, name: item.asset.symbol + "-" + item.type + " (" + (item.percentage * 100).format({ decimalPlaces: 2 }) + "%)"}))} nameKey="name" dataKey={userContext.portfolioAssets[0]?.converted_value ? "converted_value" : "value"} innerRadius="45%" outerRadius="80%" label>
                                { userContext.portfolioAssets.map((asset, index) => (
                                    <Cell key={`slice-${index}`} fill={colors[index % 10]}/>
                                ))}
                            </Pie>
                            <Pie data={userContext.portfolioAssets.map((item) => ({...item, name: item.asset.symbol + "-" + item.type}))} nameKey="name" dataKey="quantity" innerRadius="15%" outerRadius="40%">
                                { userContext.portfolioAssets.map((asset, index) => (
                                    <Cell key={`slice-${index}`} fill={colors[index % 10]}/>
                                ))}
                            </Pie>
                            <Pie data={userContext.portfolioAssets.map((item) => ({...item, name: item.asset.symbol + "-" + item.type}))} nameKey="name" dataKey="quantity" innerRadius="15%" outerRadius="40%">
                                { userContext.portfolioAssets.map((asset, index) => (
                                    <Cell key={`slice-${index}`} fill={colors[index % 10]}/>
                                ))}
                            </Pie>
                            <Tooltip trigger="click" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className={"card vertical-align " + ( userContext.mobileSize() ? "portfolio-graphic-subtitle-small" : "portfolio-graphic-subtitle" )}>
                    <div className={( userContext.mobileSize() ? "small-" : "" ) + "title"}>
                        Portfolio Asset Types
                    </div>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={groupMethods.groupAssetsByType(userContext.portfolioAssets).map((value) => ({ ...value, type: value.type + ` (${Math.round(value.percentage * 10000,2)/100}%)` }))} nameKey="type" dataKey="value" innerRadius="35%" outerRadius="65%" label>
                                {groupMethods.groupAssetsByType(userContext.portfolioAssets).map((asset, index) => (
                                    <Cell key={`part-${index}`} fill={colors[index % 10]}/>
                                ))}
                            </Pie>
                            <Tooltip trigger="click" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className={"card vertical-align " + ( userContext.mobileSize() ? "portfolio-graphic-subtitle-small" : "portfolio-graphic-subtitle" )}>
                    <div className={( userContext.mobileSize() ? "small-" : "" ) + "title"}>
                        Portfolio Sector Exposure
                    </div>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={userContext.sectorExposures.map((value) => ({ ...value, sector: value.sector + ` (${Math.round(value.percentage * 10000,2)/100 }%)`})) } nameKey="sector" dataKey="total" innerRadius="35%" outerRadius="65%" label>
                                {userContext.sectorExposures.map((asset, index) => (
                                    <Cell key={`part-${index}`} fill={colors[index % 10]}/>
                                ))}
                            </Pie>
                            <Tooltip trigger="click" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className={'card vertical-align ' + ( userContext.mobileSize() ? "portfolio-asset-hist-small" : "portfolio-asset-hist" )}>
                <div className='value-section'>
                    <div className="title">
                        P & L
                    </div>
                    <div className='info-text'>
                        <input type='checkbox' value={plWithDividends} onChange={() => {setPlWithDividends(!plWithDividends)}}/> With Dividends
                    </div>
                </div>
                {
                    plWithDividends ? (
                        <>
                            { userContext.portfolioAssets?.length > 0 && (
                                <ResponsiveContainer>
                                    <BarChart data={userContext.portfolioAssets.toSorted((a,b) => (+a?.rentabilityAmount + a?.convertedDividend) - (+b?.rentabilityAmount + b?.convertedDividend))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="rentabilityLabel" />
                                        <YAxis domain={[Math.floor(Math.min(...userContext.portfolioAssets.map((data) => (((+data.rentabilityAmount + data.convertedDividend) * 1)?.toFixed(2) * 1)))/100.0)*100.0 - 50,Math.ceil(Math.max(...userContext.portfolioAssets.map((data) => (((+data.rentabilityAmount + data.convertedDividend) * 1)?.toFixed(2) * 1)))/100.0)*100.0 + 50]}/>
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="rentabilityAmount" name='Rentability ($)' stackId={'a'}> 
                                            {userContext.portfolioAssets.toSorted((a,b) => (+a?.rentabilityAmount + a?.convertedDividend) - (+b?.rentabilityAmount + b?.convertedDividend)).map((assetItem) => (
                                                <Cell fill={assetItem?.rentabilityAmount > 0.0 ? '#34eb5e' : '#e65545'}/>
                                            ))}
                                        </Bar>
                                        <Bar dataKey="convertedDividend" name='Dividends ($)' stackId={'a'}>
                                            {userContext.portfolioAssets.toSorted((a,b) => (+a?.rentabilityAmount + a?.convertedDividend) - (+b?.rentabilityAmount + b?.convertedDividend)).map((assetItem) => (
                                                <Cell fill='#3474eb'/>
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) }
                        </>
                    ) : (
                        <>
                            { userContext.portfolioAssets?.length > 0 && (
                                <ResponsiveContainer>
                                    <BarChart data={userContext.portfolioAssets.toSorted((a,b) => a?.rentabilityAmount - b?.rentabilityAmount)}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="rentabilityLabel" />
                                        <YAxis domain={[Math.floor(Math.min(...userContext.portfolioAssets.map((data) => ((data.rentabilityAmount * 1)?.toFixed(2) * 1)))/100.0)*100.0 - 50,Math.ceil(Math.max(...userContext.portfolioAssets.map((data) => ((data.rentabilityAmount * 1)?.toFixed(2) * 1)))/100.0)*100.0 + 50]}/>
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="rentabilityAmount" name='Rentability ($)'>
                                            {userContext.portfolioAssets.toSorted((a,b) => a?.rentabilityAmount - b?.rentabilityAmount).map((assetItem) => (
                                                <Cell fill={assetItem?.rentabilityAmount > 0.0 ? '#34eb5e' : '#e65545'}/>
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) }
                        </>
                    )
                }
            </div>
            {/* <div className="card portfolio-asset-hist vertical-align">
                <div className="title">
                    Asset Value History
                </div>
                <ResponsiveContainer>
                    <LineChart data={groupMethods.groupAssetHist(userContext.assetValueHist,'price')}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Legend />
                        <Tooltip />
                        { groupMethods.groupAssetHistSecurities(userContext.assetValueHist).map((symbol,index) => (
                            <Line type="monotone" dataKey={symbol} key={`part-`+index} stroke={colors[index % 10]} />
                        )) }
                    </LineChart>
                </ResponsiveContainer>
            </div> */}
            <div className="card vertical-align">
                <div className="title">
                    Portfolio Asset Data
                </div>
                <table className={ userContext.mobileSize() ? "small" : "" }>
                    <thead>
                        <tr>
                            <td>Asset</td>
                            <td>Average Price</td>
                            <td>Current Price</td>
                            <td>Dividend Yield 12 months</td>
                            <td>Dividend Yield on cost 12 months</td>
                        </tr>
                    </thead>
                    <tbody>
                        {userContext.portfolioAssets.map((item, index) => {
                            return(
                                <tr key={index}>
                                    <td>{item.asset.symbol}</td>
                                    <td>{(item.average_price * 1.0)?.format({ currency: item.financial_portfolio.currency.symbol })}</td>
                                    <td>{item.price_today?.format({ currency: item.financial_portfolio.currency.symbol })}</td>
                                    <td>{(item.dividend_yield * 100.0).format({decimalPlaces: 2})}%</td>
                                    <td>{(item.dividend_yield_on_cost * 100.0).format({decimalPlaces: 2})}%</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="card vertical-align">
                <div className='card horizontal-align'>
                    <div className="title">
                        Portfolio TopPrices
                    </div>
                    <div className=''>
                        <FormSelect onChange={handleTopPriceMethod}>
                            <option name="min_prices">Por menor preço dos 6 meses</option>
                            <option name="dividend">Por perda de valor contra dividendos</option>
                        </FormSelect>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <td>Asset</td>
                            <td>Top Price</td>
                        </tr>
                    </thead>
                    <tbody>
                        {userContext.topPrices.map((item, index) => {
                            return(
                                <tr key={index}>
                                    <td>{item.symbol}</td>
                                    <td>{item.top_price.format({decimalPlaces: 2})}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PortfolioPage;