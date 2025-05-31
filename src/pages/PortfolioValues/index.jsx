import React, { useContext, useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { scaleOrdinal } from 'd3-scale';
import date from '../../utils/date';

const colors = scaleOrdinal(schemeCategory10).range();

const PortfolioValues = () => {
    const userContext = useContext(UserContext);
    const API_KEY = userContext.integrationToken;

    const [portfolioData, setPortfolioData] = useState([]);
    const [inputData, setInputData] = useState({
        start_date: date.formatDate(new Date((new Date(userContext.date || new Date())).getFullYear() + '-01-01T00:00:00')),
        end_date: date.formatDate(userContext.date instanceof Date ? new Date(userContext.date+"T00:00:00") : new Date()),
        benchmark_name: '',
        portfolio_name: ''
    });

    const handleFetchValues = () => {
        setPortfolioData([]);
        financeDataApi
            .getPortfolioValues(inputData, API_KEY)
            .then((data) => {
                setPortfolioData(data);
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
                <div className="title">Portfolio Values</div>
                <Form className="d-flex">
                    <FormControl
                        type="date"
                        name="start_date"
                        placeholder="Start Date"
                        className="me-2"
                        aria-label="Start Date"
                        value={inputData.start_date}
                        onChange={(e) => setInputData({ ...inputData, start_date: e.target.value })}
                    />
                    <FormControl
                        type="date"
                        name="end_date"
                        placeholder="End Date"
                        className="me-2"
                        aria-label="End Date"
                        value={inputData.end_date}
                        onChange={(e) => setInputData({ ...inputData, end_date: e.target.value })}
                    />
                    <FormControl
                        type="text"
                        name="benchmark_name"
                        placeholder="Benchmark Name"
                        className="me-2"
                        aria-label="Benchmark Name"
                        onChange={(e) => setInputData({ ...inputData, benchmark_name: e.target.value })}
                    />
                    <FormControl
                        type="text"
                        name="portfolio_name"
                        placeholder="Portfolio Name"
                        className="me-2"
                        aria-label="Portfolio Name"
                        onChange={(e) => setInputData({ ...inputData, portfolio_name: e.target.value })}
                    />
                    <Button variant="outline-success" onClick={handleFetchValues}>Fetch Values</Button>
                </Form>
            </div>
            {portfolioData.length > 0 && (
                <div className="card vertical-align" style={{ height: "400px" }}>
                    <div className="title">Rentability Comparison</div>
                    <ResponsiveContainer>
                        <LineChart
                            data={portfolioData.map((item) => ({
                                date: item.date,
                                rentability: item.rentability,
                                benchmark_rentability: item.benchmark_rentability
                            }))}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" label={{ value: "Date", position: "insideBottomRight", offset: -5 }} />
                            <YAxis domain={[(Math.min(...portfolioData.map(item => item.rentability)) - 0.25), (Math.max(...portfolioData.map(item => item.rentability)) + 0.25)]} />
                            <Legend />
                            <Tooltip />
                            <Line type="monotone" dataKey="rentability" name="Rentability" stroke={colors[0]} />
                            <Line type="monotone" dataKey="benchmark_rentability" name="Benchmark Rentability" stroke={colors[1]} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default PortfolioValues;