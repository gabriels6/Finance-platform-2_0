import React, { useContext, useState } from "react";
import './styles.css';
import { Bar, Legend, BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import UserContext from "../../context/UserContext";
import financeDataApi from "../../utils/finance-data-api";

const PortfolioRiskPage = () => {

    const userContext = useContext(UserContext);

    const [varResult, setVarResult] = useState([])

    const [currency, setCurrency] = useState(null)

    const labels = {}

    function handleGetVar(event) {
        let portfolioValues = event.currentTarget.id?.split("-")
        setVarResult([])
        setCurrency(portfolioValues[1])
        financeDataApi.calculatePortfolioVar({ portfolio_name: portfolioValues[0], date: userContext.date}, userContext.integrationToken).then((data) => {
            setVarResult(data)
        })
    }

    return (
        <div className="control">
            <div className="card">
                <div className="title">
                    Portfolio VaR
                </div>
                <div className='horizontal-align value-header'>
                    {userContext.portfolios.map((item, index) => {
                        return (
                            <div key={index} className='card' id={item.name + "-" + item.currency?.symbol} currency={item.currency?.symbol} onClick={handleGetVar}>
                                {item.name} - ({item.currency?.symbol})
                            </div>
                        )
                    })}
                </div>
            </div>
            { varResult.length && (
                <div className="card">
                        <table>
                            <thead>
                                <th>Asset</th>
                                <th>Invested Value</th>
                                <th>99%</th>
                                <th>97.5%</th>
                                <th>95%</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Total</td>
                                    <td>{ varResult.reduce((value, next) => value + next.total, 0.0).format({ decimalPlaces: 2, currency: currency }) }</td>
                                    <td>{ varResult.reduce((value, next) => value + next.var['0.99'], 0.0).format({ decimalPlaces: 2, currency: currency }) }</td>
                                    <td>{ varResult.reduce((value, next) => value + next.var['0.975'], 0.0).format({ decimalPlaces: 2, currency: currency }) }</td>
                                    <td>{ varResult.reduce((value, next) => value + next.var['0.95'], 0.0).format({ decimalPlaces: 2, currency: currency }) }</td>
                                </tr>
                                { varResult.map(result => (
                                    <tr>
                                        <td>{result.asset}</td>
                                        <td>{result.total.format({ decimalPlaces: 2, currency: currency })}</td>
                                        <td>{result.var['0.99'].format({ decimalPlaces: 2, currency: currency })}</td>
                                        <td>{result.var['0.975'].format({ decimalPlaces: 2, currency: currency })}</td>
                                        <td>{result.var['0.95'].format({ decimalPlaces: 2, currency: currency })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                </div>
            ) }
        </div>
    )
}

export default PortfolioRiskPage;