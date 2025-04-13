import React, { useContext, useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { scaleOrdinal } from 'd3-scale';

const colors = scaleOrdinal(schemeCategory10).range();

const BetaCalculator = () => {
    const userContext = useContext(UserContext);
    const API_KEY = userContext.integrationToken;

    const [calculationData, setCalculationData] = useState({});
    const [inputData, setInputData] = useState({
        symbol1: '',
        symbol2: ''
    });

    const handleCalculate = () => {
        financeDataApi
            .calculateBeta({
                symbol1: inputData.symbol1,
                symbol2: inputData.symbol2
            }, API_KEY)
            .then((data) => {
                setCalculationData(data);
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
                <div className="title">Beta Calculator</div>
                <Form className="d-flex">
                    <FormControl
                        type="text"
                        name="symbol1"
                        placeholder="First Asset Symbol"
                        className="me-2"
                        aria-label="First Asset Symbol"
                        onChange={(e) => setInputData({ ...inputData, symbol1: e.target.value })}
                    />
                    <FormControl
                        type="text"
                        name="symbol2"
                        placeholder="Second Asset Symbol"
                        className="me-2"
                        aria-label="Second Asset Symbol"
                        onChange={(e) => setInputData({ ...inputData, symbol2: e.target.value })}
                    />
                    <Button variant="outline-success" onClick={handleCalculate}>Calculate</Button>
                </Form>
            </div>
            {calculationData.beta && (
                <div className="card">
                    <table>
                        <thead>
                            <tr>
                                <th>First Asset Symbol</th>
                                <th>Second Asset Symbol</th>
                                <th>Beta</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{calculationData.symbol1}</td>
                                <td>{calculationData.symbol2}</td>
                                <td>{calculationData.beta}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            {calculationData.prices1 && calculationData.prices2 && (
                <div className="card vertical-align" style={{ height: "400px" }}>
                    <div className="title">Price Comparison</div>
                    <ResponsiveContainer>
                        <LineChart
                            data={calculationData.prices1.map((price, index) => ({
                                date: index + 1, // Assuming sequential data points
                                price1: price,
                                price2: calculationData.prices2[index]
                            }))}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" label={{ value: "Data Points", position: "insideBottomRight", offset: -5 }} />
                            <YAxis />
                            <Legend />
                            <Tooltip />
                            <Line type="monotone" dataKey="price1" name="Symbol 1 Prices" stroke={colors[0]} />
                            <Line type="monotone" dataKey="price2" name="Symbol 2 Prices" stroke={colors[1]} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default BetaCalculator;