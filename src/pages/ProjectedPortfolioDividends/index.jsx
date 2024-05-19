import React, { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import financeDataApi from "../../utils/finance-data-api";
import { MessageHolder } from "../../components";

const ProjectedPortfolioDividends = () => {

    const userContext = useContext(UserContext);

    const [projectedPortfolioDividends, setProjectedPortfolioDividends] = useState([])

    const [currency, setCurrency] = useState("BRL")
    const [years, setYears] = useState([])

    function handleGetProjectedDividends(event) {
        setCurrency(event.currentTarget.getAttribute('currency'))
        financeDataApi.getProjectedPortfolioDividendsGrowth({ portfolio_name: event.currentTarget.id }, userContext.integrationToken).then((data) => {
            setProjectedPortfolioDividends(data)
            setYears(data[0]?.projected_dividends_asset?.map((item) => item.year))
        })
    }

    return (
        <div className='control'>
            <MessageHolder/>
            <div className='title'>
                Projected Portfolio Dividends
            </div>
            <div className='card horizontal-align value-header'>
                <div className={( userContext.mobileSize() ? "small-" : "" ) + "title center"}>
                    Portfolios
                </div>
                <div className='horizontal-align value-header'>
                    {userContext.portfolios.map((item, index) => {
                        return (
                            <div key={index} className='card' id={item.name} currency={item.currency?.symbol} onClick={handleGetProjectedDividends}>
                                {item.name} - ({item.currency?.symbol})
                            </div>
                        )
                    })}
                    <div className='card' onClick={handleGetProjectedDividends}>
                        Consolidated Portfolio
                    </div>
                </div>  
            </div>
            <div className="card">
                <table className={ userContext.mobileSize() && "small" }>
                    <thead>
                        <tr>
                            <th>Asset</th>
                            { years.map((years) => (
                                <td>{years}</td>
                            )) }
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            projectedPortfolioDividends.map((item) => (
                                <tr>
                                    <td>{item.asset.symbol}</td>
                                    <td>{item.projected_dividends_asset[0].dividends.format({ currency: currency, decimalPlaces: 2})}</td>
                                    <td>{item.projected_dividends_asset[1].dividends.format({ currency: currency, decimalPlaces: 2})}</td>
                                    <td>{item.projected_dividends_asset[2].dividends.format({ currency: currency, decimalPlaces: 2})}</td>
                                    <td>{item.projected_dividends_asset[3].dividends.format({ currency: currency, decimalPlaces: 2})}</td>
                                    <td>{item.projected_dividends_asset[4].dividends.format({ currency: currency, decimalPlaces: 2})}</td>
                                    <td>{item.projected_dividends_asset.reduce((prev, curr) => prev + curr.dividends, 0.0).format({ currency: currency, decimalPlaces: 2})}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProjectedPortfolioDividends;