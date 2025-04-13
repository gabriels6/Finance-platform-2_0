import React, { useContext, useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import './styles.css';

const AveragePriceSimulator = () => {
    const userContext = useContext(UserContext);
    const API_KEY = userContext.integrationToken;

    const [simulationData, setSimulationData] = useState({});
    const [inputData, setInputData] = useState({
        symbol: '',
        quantity: '',
        price: ''
    });

    const handleSimulate = () => {
        financeDataApi
            .simulateAveragePrice({
                ...inputData,
                quantity: parseFloat(inputData.quantity),
                price: parseFloat(inputData.price)
            }, API_KEY)
            .then((data) => {
                setSimulationData(data);
            })
            .catch((ex) => {
                userContext.setMessages([
                    ...userContext.messages,
                    {
                        type: 'error',
                        value: ex.response?.data?.error || 'An error occurred.'
                    }
                ]);
            });
    };

    return (
        <div className="control">
            <MessageHolder />
            <div className="card">
                <div className="title">Average Price Simulator</div>
                <Form className="d-flex">
                    <FormControl
                        type="text"
                        name="asset_symbol"
                        placeholder="Stock Symbol"
                        className="me-2"
                        aria-label="Stock Symbol"
                        onChange={(e) => setInputData({ ...inputData, symbol: e.target.value })}
                    />
                    <FormControl
                        type="number"
                        name="quantity_purchased"
                        placeholder="Quantity"
                        className="me-2"
                        aria-label="Quantity"
                        onChange={(e) => setInputData({ ...inputData, quantity: e.target.value })}
                    />
                    <FormControl
                        type="number"
                        name="purchase_price"
                        placeholder="Purchase Price"
                        className="me-2"
                        aria-label="Purchase Price"
                        onChange={(e) => setInputData({ ...inputData, price: e.target.value })}
                    />
                    <Button variant="outline-success" onClick={handleSimulate}>Simulate</Button>
                </Form>
            </div>
            {simulationData.asset_symbol && (
                <div className="card">
                    <table>
                        <thead>
                            <tr>
                                <th>Asset Symbol</th>
                                <th>Average Price Before</th>
                                <th>Quantity Before</th>
                                <th>Quantity Purchased</th>
                                <th>Purchase Price</th>
                                <th>New Average Price</th>
                                <th>Currency</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{simulationData.asset_symbol}</td>
                                <td>{`${(simulationData.average_price_before * 1.0).format({ decimalPlaces: 2, currency: simulationData.asset_currency })}`}</td>
                                <td>{(simulationData.quantity_before * 1.0).format({ decimalPlaces: 2 })}</td>
                                <td>{(simulationData.quantity_purchased * 1.0).format({ decimalPlaces: 2 })}</td>
                                <td>{`${(simulationData.purchase_price * 1.0).format({ decimalPlaces: 2, currency: simulationData.asset_currency })}`}</td>
                                <td>{`${(simulationData.new_average_price * 1.0).format({ decimalPlaces: 2, currency: simulationData.asset_currency })}`}</td>
                                <td>{simulationData.asset_currency}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AveragePriceSimulator;