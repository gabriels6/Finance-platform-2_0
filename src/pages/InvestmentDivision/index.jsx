import React, { useContext, useEffect, useState } from 'react';

import AssetPricesPage from '../AssetPricesPage';
import { Button, Form, FormControl } from 'react-bootstrap';
import financeDataApi from '../../utils/finance-data-api';
import UserContext from '../../context/UserContext';
import { MessageHolder } from '../../components';
import groupMethods from '../../utils/group-methods';

const InvestmentDivision = () => {

    const [investmentDivisionsQuery, setInvestmentDivisionsQuery] = useState({})

    const [portfolioAmount, setPortfolioAmount] = useState(0.0)

    const [dividendYield, setDividendYield] = useState(0.0)

    const [refresh, setRefresh] = useState(true)

    const userContext = useContext(UserContext)

    const [investmentDivisions, setInvestmentDivisions] = useState([])

    function handleAssetQuery(event) {
        let currAssetPriceQuery = investmentDivisionsQuery;
        currAssetPriceQuery[event.target.name] = event.target.value;
        setInvestmentDivisionsQuery({...currAssetPriceQuery});
    }

    function handleCreateDivision() {
        financeDataApi.createInvestmentDivision(investmentDivisionsQuery, userContext.integrationToken)
            .then((data) => {
                setRefresh(true)
            }).catch((err) =>{
                userContext.setMessages([
                    ...userContext.messages,
                    {
                        type: 'error',
                        value: err.error
                    }
                ])
            })
    }

    function handleDelete(evt) {
        let id = evt.target.id
        financeDataApi.deleteInvestmentDivision({id: id}, userContext.integrationToken).then((data) => {
            userContext.setMessages([
                ...userContext.messages,
                {
                    type: 'success',
                    value: 'Division '+ id +' successfully deleted!'
                }
            ])
            setRefresh(true)
        }).catch((err) => {
            userContext.setMessages([
                ...userContext.messages,
                {
                    type: 'error',
                    value: 'Error deleting division:  '+ id + '. ' + err?.error
                }
            ])
        })
    }

    function handleEdit(evt) {
        let id = evt.target.id
        let division = investmentDivisions.find((item) => item?.id == id)
        setInvestmentDivisionsQuery({
            ...division,
            asset: division?.asset?.symbol,
        })
    }

    function handleClearId() {
        setInvestmentDivisionsQuery({
            ...investmentDivisionsQuery,
            id: null
        })
    }

    async function loadDivisions() {
        let divisions = await financeDataApi.getInvestmentDivisions({}, userContext.integrationToken)
        let amount = divisions.reduce((prevNav, item) => {
            return prevNav + (item.converted_top_amount || item.converted_value)
        }, 0.0)
        let dividends = divisions.reduce((prevNav, item) => {
            return prevNav + item.dividend
        }, 0.0)
        setDividendYield((dividends/amount * 100) || 0.0)
        setPortfolioAmount(amount)
        setInvestmentDivisions([...divisions.sort((a,b) => b?.discount - a?.discount )])
    }

    
    useEffect(() => {
        if(refresh) {
            loadDivisions().then(() => {
                setRefresh(false)
            })
        }
    }, [refresh])

    return (
        <div className='control'>
            <MessageHolder/>
            <div className='card horizontal-align'>
                <div className='title'>
                    Investment Division
                </div>
                <div className="value-section">
                    <div className="info-text">
                        Dividend yield
                    </div>
                    <div className="value-text">
                        { dividendYield.toFixed(2) }%
                    </div>
                </div>
                <div className="value-section">
                    <div className="info-text">
                        Portfolio Amount
                    </div>
                    <div className="value-text">
                        R$ { portfolioAmount.toFixed(2) }
                    </div>
                </div>
            </div>
            <div className='card horizontal-align'>
                <Form className='d-flex'>
                    <div className='center'>
                        <div className='w-50'>
                            Asset
                        </div>
                        <FormControl className='me-2' name="asset" type='text' value={investmentDivisionsQuery.asset} onChange={handleAssetQuery} />
                    </div>
                </Form>
                <Form className='d-flex'>
                    <div className='center'>
                        <div className='w-50'>
                            Quantity
                        </div>
                        <FormControl className='me-2' name="quantity" type='text' value={investmentDivisionsQuery.quantity} onChange={handleAssetQuery} />
                    </div>
                </Form>
                <Form className='d-flex'>
                    <div className='center'>
                        <div className='w-50'>
                            Top Price
                        </div>
                        <FormControl className='me-2' name="top_price" type='text' value={investmentDivisionsQuery.top_price} onChange={handleAssetQuery} />
                    </div>
                </Form>
                {
                    investmentDivisionsQuery.id && (
                        <div className='center'>
                            <Button variant="outline-primary" onClick={handleClearId}>
                                Clear Id
                            </Button>
                        </div>
                    )
                }
                <div className='center'>
                    <Button variant="outline-primary" onClick={handleCreateDivision}>
                        Create
                    </Button>
                </div>
            </div>
            <div className='card horizontal-align'>
                <table>
                    <thead>
                        <th>Portfolio Percentage</th>
                        <th>Asset</th>
                        <th>Currency</th>
                        <th>Current Quantity</th>
                        <th>Quantity</th>
                        <th>Value</th>
                        <th>Amount (Top price)</th>
                        <th>Dividend (Year)</th>
                        <th>Price</th>
                        <th>Top Price</th>
                        <th>Discount</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {investmentDivisions.map((division) => (
                            <tr>
                                <td>{(division.portfolio_percentage * 100).format({decimalPlaces: 2})}%</td>
                                <td>{division.asset?.symbol}</td>
                                <td>{division.asset?.currency?.symbol}</td>
                                <td>{division.current_quantity}</td>
                                <td>{(+division.quantity).format({ decimalPlaces: 2 })}</td>
                                <td>{division.value.format({ decimalPlaces: 2, currency: division.asset?.currency?.symbol })}</td>
                                <td>{(+division.converted_top_amount).format({ decimalPlaces: 2, currency: "BRL" })}</td>
                                <td>{(+division.dividend).format({ decimalPlaces: 2, currency: "BRL" })}</td>
                                <td>{(+division.price).format({ decimalPlaces: 2, currency: division.asset?.currency?.symbol })}</td>
                                <td>{(+division.top_price).format({ decimalPlaces: 2, currency: division.asset?.currency?.symbol })}</td>
                                <td>{(+division.discount * 100).format({ decimalPlaces: 2 })}%</td>
                                <td>
                                    <Button variant="outline-primary" id={division.id} onClick={handleEdit}>
                                        Edit
                                    </Button>
                                    <Button variant="outline-danger" id={division.id} onClick={handleDelete}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='card horizontal-align'>
                <table>
                    <thead>
                        <th>Asset Type</th>
                        <th>Portfolio Value</th>
                        <th>Expected Value</th>
                        <th>Remaining Value/Excess</th>
                        <th>Expected Dividends</th>
                        <th>Portfolio Percentage</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {groupMethods
                            .groupAssetsByType(
                                investmentDivisions.map((division) => ({...division, percentage: division.portfolio_percentage * 100, current_value: (division?.converted_value || division?.value || 0.0), converted_top_amount: (division.converted_top_amount || 0.0), type: (division.asset?.asset_type?.name || "none")})),
                                ["current_value","converted_top_amount","dividend"]
                            )
                            .map((groupedDivision) => {
                                return (
                                    <tr>
                                        <td>{groupedDivision.type}</td>
                                        <td>{groupedDivision.current_value.format({ currency: "BRL" })}</td>
                                        <td>{groupedDivision.converted_top_amount.format({ currency: "BRL" })}</td>
                                        <td>{(groupedDivision.converted_top_amount - groupedDivision.current_value).format({ currency: "BRL" })}</td>
                                        <td>{groupedDivision.dividend.format({ currency: "BRL" })}</td>
                                        <td>{groupedDivision.percentage}%</td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
            <div className='card horizontal-align'>
                <table>
                    <thead>
                        <th>Sector</th>
                        <th>Portfolio Value</th>
                        <th>Expected Value</th>
                        <th>Remaining Value/Excess</th>
                        <th>Expected Dividends</th>
                        <th>Portfolio Percentage</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {groupMethods
                            .groupAssetsByType(
                                investmentDivisions.map((division) => ({...division, current_value: (division?.converted_value || division?.value || 0.0) , percentage: division?.portfolio_percentage * 100,  value: (division.converted_top_amount || 0.0), type: (division.asset?.sector?.name || "none")})),
                                ["current_value","converted_top_amount", "dividend"]
                            )
                            .map((groupedDivision) => {
                                return (
                                    <tr>
                                        <td>{groupedDivision.type}</td>
                                        <td>{groupedDivision.current_value.format({ currency: "BRL" })}</td>
                                        <td>{groupedDivision.converted_top_amount.format({ currency: "BRL" })}</td>
                                        <td>{(groupedDivision.converted_top_amount - groupedDivision.current_value).format({ currency: "BRL" })}</td>
                                        <td>{groupedDivision.dividend.format({ currency: "BRL" })}</td>
                                        <td>{groupedDivision.percentage}%</td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
            <div className='card horizontal-align'>
                <table>
                    <thead>
                        <th>Country</th>
                        <th>Portfolio Value</th>
                        <th>Expected Value</th>
                        <th>Remaining Value/Excess</th>
                        <th>Expected Dividends</th>
                        <th>Portfolio Percentage</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {groupMethods
                            .groupAssetsByType(
                                investmentDivisions.map((division) => ({...division, current_value: (division?.converted_value || division?.value || 0.0) , percentage: division?.portfolio_percentage * 100,  value: (division.converted_top_amount || 0.0), type: (division.asset?.country?.name || "none")})),
                                ["current_value","converted_top_amount","dividend"]
                            )
                            .map((groupedDivision) => {
                                return (
                                    <tr>
                                        <td>{groupedDivision.type}</td>
                                        <td>{groupedDivision.current_value.format({ currency: "BRL" })}</td>
                                        <td>{groupedDivision.converted_top_amount.format({ currency: "BRL" })}</td>
                                        <td>{(groupedDivision.converted_top_amount - groupedDivision.current_value).format({ currency: "BRL" })}</td>
                                        <td>{groupedDivision.dividend.format({ currency: "BRL" })}</td>
                                        <td>{groupedDivision.percentage}%</td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default InvestmentDivision;