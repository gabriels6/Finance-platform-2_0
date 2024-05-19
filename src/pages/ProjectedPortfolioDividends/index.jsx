import React, { useContext, useState } from "react";
import UserContext from "../../context/UserContext";
import financeDataApi from "../../utils/finance-data-api";
import { InputText, MessageHolder } from "../../components";

const ProjectedPortfolioDividends = () => {

    const userContext = useContext(UserContext);

    const [projectedPortfolioDividends, setProjectedPortfolioDividends] = useState([])

    const [currency, setCurrency] = useState("BRL")
    const [years, setYears] = useState([])

    const [maxYears, setMaxYears] = useState(5)

    function handleGetProjectedDividends(event) {
        setProjectedPortfolioDividends([])
        setCurrency(event.currentTarget.getAttribute('currency'))
        financeDataApi.getProjectedPortfolioDividendsGrowth({ portfolio_name: event.currentTarget.id, max_years: maxYears }, userContext.integrationToken).then((data) => {
            setProjectedPortfolioDividends(data)
            setYears(data[0]?.projected_dividends_asset?.map((item) => item.year))
        })
    }

    return (
        <div className='control'>
            <MessageHolder/>
            <div className='title'>
                Projected Portfolio Dividend Growth
            </div>
            <div className='card horizontal-align value-header'>
                <div className={( userContext.mobileSize() ? "small-" : "" ) + "title center"}>
                    Portfolios
                </div>
                <div className="value-section">
                    <div className="info-text">
                        All Dividends
                    </div>
                    <div className="value-text">
                        { projectedPortfolioDividends.reduce((prev_dividends, curr_dividends) => {
                            return prev_dividends + curr_dividends.projected_dividends_asset.reduce((prev_dividend_item, curr_dividend_item) => {
                                return prev_dividend_item + (curr_dividend_item?.total_dividends || 0.0)
                            }, 0.0)
                        }, 0.0).format({ currency: currency, decimalPlaces: 2}) }
                    </div>
                </div>
                <div className="value-section">
                    <div className="info-text">
                        Final Yield
                    </div>
                    <div className="value-text">
                        { (projectedPortfolioDividends.reduce((prev_dividends, curr_dividends) => {
                            return prev_dividends + (curr_dividends.projected_dividends_asset[curr_dividends.projected_dividends_asset.length - 1]?.total_dividends || 0.0)
                        }, 0.0)/projectedPortfolioDividends.reduce((prev_dividends, curr_dividends) => {
                            return prev_dividends + (curr_dividends.projected_dividends_asset[curr_dividends.projected_dividends_asset.length - 1]?.value || 0.0)
                        }, 0.0) * 100 || 0.0).format({ decimalPlaces: 2}) }%
                    </div>
                </div>
                <InputText type={"number"} value={maxYears} onChange={(event) => { setMaxYears(event.currentTarget.value) }}/>
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
                                <>
                                    <tr>
                                        <td rowSpan={3}>{item.asset.symbol}</td>
                                        {
                                            item.projected_dividends_asset.map((projected_dividend_item) => (<td>{projected_dividend_item.dividends.format({ currency: currency, decimalPlaces: 2})}</td>))
                                        }
                                        <td>{item.projected_dividends_asset.reduce((prev, curr) => prev + curr.dividends, 0.0).format({ currency: currency, decimalPlaces: 2})}</td>
                                    </tr>
                                    <tr>
                                        {
                                            item.projected_dividends_asset.map((projected_dividend_item) => (<td>{projected_dividend_item.total_dividends.format({ currency: currency, decimalPlaces: 2})}</td>))
                                        }
                                        <td>{item.projected_dividends_asset.reduce((prev, curr) => prev + curr.total_dividends, 0.0).format({ currency: currency, decimalPlaces: 2})}</td>
                                    </tr>
                                    <tr>
                                        {
                                            item.projected_dividends_asset.map((projected_dividend_item) => (<td>{(projected_dividend_item.dividend_yield * 100).format({ decimalPlaces: 2})}%</td>))
                                        }
                                        <td>{(item.projected_dividends_asset.reduce((prev, curr) => prev + curr.dividend_yield * 100, 0.0)).format({  decimalPlaces: 2})}%</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2 + years.length}></td>
                                    </tr>
                                </>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProjectedPortfolioDividends;