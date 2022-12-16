import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { Tooltip } from "react-bootstrap";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import UserContext from "../../context/UserContext";
import financeDataApi from "../../utils/finance-data-api";
import "./styles.css";

const RealtimePortfolioPage = () => {

    const colors = scaleOrdinal(schemeCategory10).range();

    const userContext = useContext(UserContext);


    const [refresh, setRefresh] = useState(0);
    const [navs, setNavs] = useState([]);
    const [assetValues, setAssetValues] = useState({})
    const [realtimePortfolio, setRealtimePortfolio] = useState({
        assets: [],
        exposures: []
    });

    useEffect(() => {
        clearInterval(window.portfolioInterval)
        window.portfolioInterval = setInterval(() => {
            if(realtimePortfolio.assets.length > 0) {
                financeDataApi.getRealtimeAssets({
                    symbols: realtimePortfolio.assets.map((item) => (item.asset.symbol)),
                },userContext.integrationToken).then((data) => {
                    let currentNav = 0.0;
                    let nowDate = new Date(Date.now());
                    data.forEach((item) => {
                        let currentAssetIndex = realtimePortfolio.assets.findIndex((portfolioItem, index) => (portfolioItem.asset.investing_external_id == item.asset));
                        let newAssets = realtimePortfolio.assets;
                        if(currentAssetIndex >= 0) {
                            console.log(newAssets[currentAssetIndex])
                            newAssets[currentAssetIndex].current_price = item.price
                            newAssets[currentAssetIndex].current_value = Math.round(item.price * newAssets[currentAssetIndex].quantity * 100 || 0.0)/100
                            setRealtimePortfolio({...realtimePortfolio, assets: [...newAssets]})
                            setAssetValues(prevValues => {
                                let currAssetHist = prevValues[newAssets[currentAssetIndex].asset.symbol] || [];
                                currAssetHist.push({
                                    time: nowDate.getHours()+":"+nowDate.getMinutes()+":"+nowDate.getSeconds() + " - " + newAssets[currentAssetIndex].current_value,
                                    value: newAssets[currentAssetIndex].current_value
                                })
                                let newAssetValuesHistory = {...prevValues}
                                newAssetValuesHistory[newAssets[currentAssetIndex].asset.symbol] = currAssetHist
                                return {...newAssetValuesHistory}
                            })
                            currentNav += newAssets[currentAssetIndex].current_value
                        }
                    });
                    setNavs(prevNavs => [
                        ...prevNavs,
                        {
                            time: nowDate.getHours()+":"+nowDate.getMinutes()+":"+nowDate.getSeconds() + " - " + Math.round(currentNav * 100)/100,
                            value: Math.round(currentNav * 100)/100,
                        }
                    ])
                })
            }
        },8000);
    }, [refresh]);

    function handleGetPortfolio(event) {
        let apiKey = userContext.integrationToken;
        financeDataApi.getPortfolio(event.currentTarget.id, userContext.date, apiKey).then((data) => {
            let promises = []
            let assetItems = data.orders
            let sectorExposures = data.sector_exposure
            setRealtimePortfolio({
                assets: [...assetItems],
                sectorExposures: [...sectorExposures]
            });
            setRefresh(!refresh);
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
                            ${realtimePortfolio.assets.reduce((prevNav, item) => {
                                return prevNav + (item.quantity * (item.current_price || item.price))
                            }, 0.0).toFixed(2) }
                        </div>
                    </div>
                    <div className="value-section">
                        <div className="info-text">
                            Quantity
                        </div>
                        <div className="value-text">
                            { realtimePortfolio.assets.reduce((prevNav, item) => {
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
                <div className='card vertical-align'>
                    <div className="title">
                            Positions
                    </div>
                    <div className='horizontal-align'>
                        <table>
                            <thead>
                                <tr>
                                    <td>Asset</td>
                                    <td>Investing external Id.</td>
                                    <td>Quantity</td>
                                    <td>Price</td>
                                    <td>Average Price</td>
                                    <td>Value</td>
                                    <td>Current Price</td>
                                    <td>Current Value</td>
                                    <td>Profit</td>
                                </tr>
                            </thead>
                            <tbody>
                            {realtimePortfolio.assets.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.asset.symbol}</td>
                                            <td>{item.asset.investing_external_id}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price}</td>
                                            <td>{item.average_price}</td>
                                            <td>{item.value}</td>
                                            <td>{Math.round(item.current_price * 100)/100 || 0.0}</td>
                                            <td>{Math.round(item.current_value * 100)/100 || 0.0}</td>
                                            <td className={((item.current_price - item.average_price)/item.average_price || 0.0) >= 0 ? "green" : "red"}>{Math.round((item.current_price - item.average_price)/item.average_price * 10000)/100 || 0.0}%</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>  
                    <div className="card">
                        <div className="title">
                            Portfolio History
                        </div>
                        <LineChart width={730} height={250} data={navs}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time"/>
                            <YAxis domain={['value - 200','value + 200']}/>
                            <Legend/>
                            <Tooltip />
                            <Line type="monotone" dataKey="value" name="value" stroke={colors[1 % 10]} />
                        </LineChart>
                    </div>
                    <div className="horizontal-align">
                        {
                            Object.entries(assetValues).map((item, index) => {
                                let key = item[0]
                                let values = item[1]
                                return (
                                    <div className="card vertical-align realtime-asset" key={key}>
                                        <div className="title">
                                            {key}
                                        </div>
                                        <LineChart width={550} height={250} data={values}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="time"/>
                                            <YAxis domain={['value - 200','value + 200']}/>
                                            <Legend/>
                                            <Tooltip />
                                            <Line type="monotone" dataKey="value" name="value" stroke={colors[index % 10]} />
                                        </LineChart>
                                    </div>
                                )
                            })
                        }
                    </div>
                    
                    
                </div>
        </div>
    )
}

export default RealtimePortfolioPage;