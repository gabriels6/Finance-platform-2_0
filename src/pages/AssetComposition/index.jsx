import React, { useContext, useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';

const AssetComposition = () => {

    const userContext = useContext(UserContext)
    const API_KEY = userContext.integrationToken

    const [queryItem, setQueryItem] = useState({})
    const [queryValues, setQueryValues] = useState([])

    const [composition, setComposition] = useState({})

    function handleGetConsolidatedPortfolio() {
        financeDataApi.getConsolidatedPortfolio(userContext.date, API_KEY).then((data) => {
            setQueryValues([
                ...(data.orders || []).map((item) => ({ symbol: item.asset?.symbol, quantity: item?.quantity }))
            ])
        })
    }

    function handleGetComposition() {
        financeDataApi
            .getAssetComposition({
                asset_data: queryValues,
                date: userContext.date
            }, API_KEY)
            .then((data) => {
                setComposition(data)
            })
            .catch((ex) => {
                userContext.setMessages([
                    ...userContext.messages, 
                    {
                        type: 'error',
                        value: ex.response.data.error
                    }
                ])
            })
    }
    
    function handleRemove(event) {
        let selectedSymbol = event.target.id.split("-")[1]
        let filteredQueryValues = queryValues.filter((asset) => {
            return asset.symbol !== selectedSymbol
        })
        setQueryValues(filteredQueryValues)
    }

    return (
        <div className='control'>
            <MessageHolder/>
            <div className="card">
                <div className="title">Asset Composition</div>
                <Form className="d-flex">
                    <FormControl
                    type="text"
                    name="asset"
                    placeholder="Asset symbol"
                    className="me-2"
                    aria-label="Asset symbol"
                    
                    onChange={(event) => { setQueryItem({...queryItem, symbol: event.target.value}) }}
                    />
                    <FormControl
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    className="me-2"
                    aria-label="Quantity"
                    onChange={(event) => { setQueryItem({...queryItem, quantity: event.target.value}) }}
                    />
                    <Button variant="outline-success" onClick={(event) => {
                        setQueryValues([
                            ...queryValues,
                            queryItem
                        ])
                        setQueryItem({})
                        let formElements = event.target.form.elements
                        formElements.asset.value = ""
                        formElements.quantity.value = 0.0
                    }}>Add Asset</Button>
                    <Button variant="outline-success" onClick={handleGetComposition}>Get Composition</Button>
                    <Button variant="outline-success" onClick={handleGetConsolidatedPortfolio}>Get Consolidated Portfolio</Button>
                </Form>
            </div>
            <div className="card">
                <table>
                    <thead>
                        <th>Symbol</th>
                        <th>Quantity</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {queryValues.map((item) => (
                            <tr>
                                <td>{item.symbol}</td>
                                <td>{item.quantity}</td>
                                <td>
                                    <Button variant="outline-danger" id={'favoriteAsset-'+item.symbol} onClick={handleRemove}>
                                        Remove Asset
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="card vertical-align">
                <div className="card">
                    <div className="value-section">
                        <div className="info-text">
                            Amount
                        </div>
                        <div className="value-text">
                            ${composition.total_amount?.toFixed(2) }
                        </div>
                    </div>
                    <div className="value-section">
                        <div className="info-text">
                            Portfolio Yield
                        </div>
                        <div className="value-text">
                            { (composition.total_yield * 100)?.toFixed(2) }%
                        </div>
                    </div>
                    <div className="value-section">
                        <div className="info-text">
                            Received Dividends
                        </div>
                        <div className="value-text">
                            $ { composition?.asset_data?.reduce((prevValue, currentValue) => (prevValue + currentValue.received_dividends), 0.0)?.toFixed(2) }
                        </div>
                    </div>
                </div>
                <table>
                    <thead>
                        <th>Symbol</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Received Dividends</th>
                        <th>Dividend Yield</th>
                        <th>Percentage</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {composition?.asset_data?.map((item) => (
                            <tr>
                                <td>{item.asset.symbol}</td>
                                <td>{item.quantity}</td>
                                <td>{item.amount?.toFixed(2)}</td>
                                <td>{item.received_dividends?.toFixed(2)}</td>
                                <td>{(item.dividend_yield * 100)?.toFixed(2)}%</td>
                                <td>{(item.amount/composition.total_amount * 100)?.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AssetComposition;