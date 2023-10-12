import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import React from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';


const PriceProjection = () => {

    const userContext = useContext(UserContext);

    const colors = scaleOrdinal(schemeCategory10).range();

    const [projectionQuery, setProjectionQuery] = useState({
        initial_date: "",
        final_date: "",
        symbol: "",
        projections: 10
    });

    const [projectionResults, setProjectionResults] = useState([]);

    function handleProjectionQuery(event) {
        let currQuery = projectionQuery;
        currQuery[event.target.name] = event.target.value;
        setProjectionQuery({...currQuery});
    }

    function getProjection(event) {
        financeDataApi.getProjectedPrice(projectionQuery, userContext.integrationToken).then((data) => {
            setProjectionResults(data);
        }).catch((err) => userContext.handleError(err))
    }

    return (
        <div className='control'>
            <MessageHolder/>
            <div className='title'>
                Price Projection
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
                            Predictions
                        </div>   
                        <FormControl placeholder="Number of Predictions" className="me-2" name="projections" type="number" value={projectionQuery.projections} onChange={handleProjectionQuery} />
                    </div>
                    <Button variant='outline-primary' onClick={getProjection}>
                        Refresh
                    </Button>
                </Form>
            </div>
            <div className='card horizontal-align portfolio-asset-hist'>
                { projectionResults.length > 0 ? (
                    <ResponsiveContainer>
                        <AreaChart data={projectionResults}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <Legend/>
                            <Tooltip />
                            <Area type="monotone" dataKey="price" stroke={colors[2 % 10]} fill={colors[2 % 10]}/>
                        </AreaChart>
                    </ResponsiveContainer>
                ) : <></>}
            </div>
        </div>
    );
}

export default PriceProjection;