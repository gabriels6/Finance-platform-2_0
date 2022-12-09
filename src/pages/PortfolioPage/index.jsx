import React, { useContext } from 'react';
import './styles.css';
import { InputButton } from '../../components';
import { scaleOrdinal } from 'd3-scale';
import UserContext from '../../context/UserContext';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, LineChart, CartesianGrid, XAxis, YAxis, Brush, Label, Legend, Line, LabelList } from 'recharts'
import { schemeCategory10 } from 'd3-scale-chromatic';
import groupMethods from '../../utils/group-methods';
import calculateMethods from '../../utils/calculate-methods';
import financeDataApi from '../../utils/finance-data-api';

const PortfolioPage = () => {

    const colors = scaleOrdinal(schemeCategory10).range();

    const userContext = useContext(UserContext);

    function handleGetPortfolio(event) {
        let apiKey = userContext.integrationToken;
        financeDataApi.getPortfolio(event.currentTarget.id, userContext.date, apiKey).then((data) => {
            let promises = []
            let assetItems = data.orders
            let sectorExposures = data.sector_exposure
            assetItems.forEach((assetItem) => {
                promises.push(financeDataApi.getAssetPriceHist(assetItem.asset.symbol,'',userContext.date, apiKey))
            })
            Promise.all(promises).then((assets) => {
                userContext.setAssetValueHist([...assets.flat(1)])
            })
            userContext.setPortfolioAssets([...assetItems]);
            userContext.setSectorExposures([...sectorExposures]);
        });
        
    }

    return (
        <div className="control">
            <div className="title">
                Portfolio
            </div>
            <div className="card">
                <div className="value-section">
                    <div className="info-text">
                        Nav
                    </div>
                    <div className="value-text">
                        ${userContext.portfolioAssets.reduce((prevNav, item) => {
                            return prevNav + item.value
                        }, 0.0).toFixed(2) }
                    </div>
                </div>
                <div className="value-section">
                    <div className="info-text">
                        Quantity
                    </div>
                    <div className="value-text">
                        { userContext.portfolioAssets.reduce((prevNav, item) => {
                            return prevNav + item.quantity
                        }, 0.0).toFixed(2) }
                    </div>
                </div>
            </div>
            <div className='card horizontal-align'>
                <div className="title">
                        Portfolios
                </div>
                <div className='horizontal-align'>
                    {userContext.portfolios.map((item, index) => {
                        return (
                            <div key={index} className='card' id={item.name} onClick={handleGetPortfolio}>
                                {item.name} - ({item.currency?.symbol})
                            </div>
                        )
                    })}
                </div>  
            </div>
            <div className="horizontal-align">
                <div className="card portfolio-graphic">
                    <div className="title">
                        Portfolio Assets
                    </div>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={userContext.portfolioAssets.map((item) => ({...item, name: item.asset.symbol + "-" + item.type}))} nameKey="name" dataKey="value" innerRadius="45%" outerRadius="80%" label>
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
                <div className="card portfolio-graphic-subtitle">
                    <div className="title">
                        Portfolio Asset Types
                    </div>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={groupMethods.groupAssetsByType(userContext.portfolioAssets)} nameKey="type" dataKey="quantity" innerRadius="35%" outerRadius="65%" label>
                                {groupMethods.groupAssetsByType(userContext.portfolioAssets).map((asset, index) => (
                                    <Cell key={`part-${index}`} fill={colors[index % 10]}/>
                                ))}
                            </Pie>
                            <Tooltip trigger="click" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="card portfolio-graphic-subtitle">
                    <div className="title">
                        Portfolio Sector Exposure
                    </div>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={userContext.sectorExposures} nameKey="sector" dataKey="total" innerRadius="35%" outerRadius="65%" label>
                                {userContext.sectorExposures.map((asset, index) => (
                                    <Cell key={`part-${index}`} fill={colors[index % 10]}/>
                                ))}
                            </Pie>
                            <Tooltip trigger="click" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="card">
                <div className="title">
                    Asset Value History
                </div>
                <LineChart width={730} height={250} data={groupMethods.groupAssetHist(userContext.assetValueHist,'price')}
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
            </div>
            <div className="card">
                <div className="title">
                    Portfolio Asset Types
                </div>
                <table>
                    <thead>
                        <tr>
                            <td>Asset</td>
                            <td>Average Price</td>
                            <td>Current Price</td>
                        </tr>
                    </thead>
                    <tbody>
                        {userContext.portfolioAssets.map((item, index) => {
                            return(
                                <tr key={index}>
                                    <td>{item.asset.symbol}</td>
                                    <td>{item.average_price}</td>
                                    <td>{item.price_today}</td>
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