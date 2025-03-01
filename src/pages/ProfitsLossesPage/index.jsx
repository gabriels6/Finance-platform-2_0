import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import { MessageHolder } from "../../components";
import financeDataApi from "../../utils/finance-data-api";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ProfitsLossesPage = () => {

    const userContext = useContext(UserContext);

    const [profitsLosses, setProfitsLosses] = useState([]);

    const [refresh, setRefresh] = useState(true)

    useEffect(() => {
        if(refresh) {
            loadProfits().then(() => {
                setRefresh(false)
            })
        }
    }, [refresh])

    async function loadProfits() {
        let profits = await financeDataApi.getProfitsLosses(userContext.date, userContext.integrationToken);
        setProfitsLosses(profits.map((profit) => ({
            ...profit,
            label: `${profit.asset?.symbol}`
        })));
    }

    return (
        <div className='control'>
            <MessageHolder/>
            <div className='card horizontal-align'>
                <div className='title'>
                    Profits & Losses from Sales
                </div>
                <div className="value-section">
                    <div className="info-text">
                        Full profit
                    </div>
                    <div className="value-text">
                        R$ { profitsLosses.reduce((prev, curr) => prev + curr.total_profit,0.0).toFixed(2) }
                    </div>
                </div>
            </div>
            <div className={'card vertical-align ' + ( userContext.mobileSize() ? "portfolio-asset-hist-small" : "portfolio-asset-hist" )}>
                <ResponsiveContainer>
                    <BarChart data={profitsLosses.toSorted((a,b) => a?.total_profit - b?.total_profit)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis domain={[Math.floor(Math.min(...profitsLosses.map((data) => ((data.total_profit * 1)?.toFixed(2) * 1)))/100.0)*100.0 - 50,Math.ceil(Math.max(...profitsLosses.map((data) => ((data.total_profit * 1)?.toFixed(2) * 1)))/100.0)*100.0 + 50]}/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total_profit" name='Profit/Loss ($)'>
                            {profitsLosses.toSorted((a,b) => a?.total_profit - b?.total_profit).map((assetItem) => (
                                <Cell fill={assetItem?.total_profit > 0.0 ? '#34eb5e' : '#e65545'}/>
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )

}

export default ProfitsLossesPage;