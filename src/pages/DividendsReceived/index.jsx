import React, { useContext, useEffect, useState } from "react";
import './styles.css';
import UserContext from "../../context/UserContext";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import financeDataApi from "../../utils/finance-data-api";


const DividendsReceived = () => {

    const userContext = useContext(UserContext)

    const [dividendsMonths, setDividendsMonths] = useState([])

    function handleGetReceivables(event) {
        setDividendsMonths([])
        financeDataApi.getReceivedValues({
            portfolio_name: event.currentTarget.id
        }, userContext.integrationToken).then((data) => {
            console.log(Math.max(dividendsMonths.map((data) => (data.value * 1))))
            console.log(dividendsMonths.map((data) => (data.value * 1)))
            setDividendsMonths(data)
        })
    }

    return (
        <div className="control">
            <div className="title">
                Dividends Received
            </div>
            <div className={"card " + ( userContext.mobileSize() ? "value-header" : "" )}>
                <div className="value-section">
                    <div className="info-text">
                        Received Dividends
                    </div>
                    <div className="value-text">
                        {userContext.portfolios.map((item, index) => {
                            return (
                                <div key={index} className='card' id={item.name} onClick={handleGetReceivables}>
                                    {item.name} - ({item.currency?.symbol})
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className={'card vertical-align ' + ( userContext.mobileSize() ? "portfolio-asset-hist-small" : "portfolio-asset-hist" )}>
                <div className="title">
                    Dividends Received
                </div>
                {dividendsMonths.length > 0 && (
                    <ResponsiveContainer>
                        <BarChart data={dividendsMonths.map((data) => ({...data, month_year: data.month + "/" + data.year}))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month_year" />
                            <YAxis domain={[0,(Math.max(...dividendsMonths.map((data) => ((data.value * 1)?.toFixed(2) * 1))) + 1.0)]}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" name='Value ($)'>
                                {dividendsMonths.map((assetItem) => (
                                    <Cell fill={'#34eb5e'}/>
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) }
            </div>
        </div>
    )
}

export default DividendsReceived;