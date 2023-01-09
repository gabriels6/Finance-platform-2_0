import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { Button, Form, FormControl, Tooltip } from 'react-bootstrap';
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';


const DividendProjection = () => {

    const userContext = useContext(UserContext);

    const colors = scaleOrdinal(schemeCategory10).range();

    const [projectionQuery, setProjectionQuery] = useState({
        initial_date: "",
        final_date: "",
        symbol: "",
        quantity: 1,
        monthly_increase_quantity: 0,
    });

    const [projectionResults, setProjectionResults] = useState({
        average_dividend_yield: 0.0,
        projected_dividends: []
    });

    function handleProjectionQuery(event) {
        let currQuery = projectionQuery;
        currQuery[event.target.name] = event.target.value;
        setProjectionQuery({...currQuery});
    }

    function getProjection(event) {
        financeDataApi.getDividendsProjection(projectionQuery, userContext.integrationToken).then((data) => {
            setProjectionResults(data);
        }).catch((err) => userContext.handleError(err))
    }

    return (
        <div className='control'>
            <MessageHolder/>
            <div className='title'>
                Dividends Projection
            </div>
            <div className='card horizontal-align'>
                <div className="value-section">
                    <div className="info-text">
                        Average Dividend Yield
                    </div>
                    <div className="value-text">
                        { (projectionResults.average_dividend_yield * 100).toFixed(2) }%
                    </div>
                </div>
            </div>
            <div className='card horizontal-align'>
                <Form className="d-flex">
                    <div className='center'>
                        <div className='w-50'>
                            Symbol
                        </div>
                        <FormControl className="me-2" name="symbol" type="text" value={projectionQuery.symbol} onChange={handleProjectionQuery} />
                    </div>
                    <div className='center'>
                        <div className='w-50'>
                            Start Date
                        </div>
                        <FormControl placeholder="Start Date" className="me-2" name="initial_date" type="date" value={projectionQuery.initial_date} onChange={handleProjectionQuery} />
                    </div>
                    <div className='center'>
                        <div className='w-50'>
                            End Date
                        </div>   
                        <FormControl placeholder="End Date" className="me-2" name="final_date" type="date" value={projectionQuery.final_date} onChange={handleProjectionQuery} />
                    </div>
                    <div className='center'>
                        <div className='w-50'>
                            Quantity
                        </div>   
                        <FormControl placeholder="Quantity" className="me-2" name="quantity" type="number" value={projectionQuery.quantity} onChange={handleProjectionQuery} />
                    </div>
                    <div className='center'>
                        <div className='w-50'>
                            Monthly Increased Quantity
                        </div>   
                        <FormControl placeholder="Monthly Increased Quantity" className="me-2" name="monthly_increase_quantity" type="number" value={projectionQuery.monthly_increase_quantity} onChange={handleProjectionQuery} />
                    </div>
                    <Button variant='outline-primary' onClick={getProjection}>
                        Refresh
                    </Button>
                </Form>
            </div>
            <div className='card horizontal-align portfolio-asset-hist'>
                <ResponsiveContainer>
                    <AreaChart data={projectionResults.projected_dividends}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Legend/>
                        <Tooltip />
                        <Area type="monotone" dataKey="accumulated_dividend" stroke={colors[2 % 10]} fill={colors[2 % 10]} label/>
                        <Area type="monotone" dataKey="average_dividend" stroke={colors[1 % 10]} fill={colors[1 % 10]} label/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default DividendProjection;