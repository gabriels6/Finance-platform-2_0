import React, { useContext, useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';

const ExchangeRate = () => {

    const [queryValues, setQueryValues] = useState({});
    const [exchangeRates, setExchangeRates] = useState([]);
    const userContext = useContext(UserContext);

    function getRates() {
        financeDataApi
            .getExchangeRates(queryValues, userContext.integrationToken)
            .then((data) => {
                setExchangeRates([...data]);
            });
    }

    function handleGetRates(event) {
        getRates();
    }

    function handleImportRates(event) {
        financeDataApi
            .importExchangeRates({
                ...queryValues,
                date: userContext.date
            }, userContext.integrationToken)
            .then(() => {
                getRates();
            });
    }

    return (
        <div className="control">
            <MessageHolder/>
            <div className="card dividend-form">
                <div className="title">Exchange Rates</div>
                <Form className="d-flex">
                    <FormControl
                    type="text"
                    placeholder="From Currency"
                    className="me-2"
                    aria-label="From Currency"
                    onChange={(event) => { setQueryValues({...queryValues, from_currency: event.target.value}) }}
                    />
                    <FormControl
                    type="text"
                    placeholder="To Currency"
                    className="me-2"
                    aria-label="To Currency"
                    onChange={(event) => { setQueryValues({...queryValues, to_currency: event.target.value}) }}
                    />
                    <Button variant="outline-success" onClick={handleGetRates}>Get Rates</Button>
                    <Button variant="outline-success" onClick={handleImportRates}>Import Rates</Button>
                </Form>
            </div>
            <div className="card">
                <table>
                    <thead>
                        <td>Date</td>
                        <td>From Currency</td>
                        <td>To Currency</td>
                        <td>Value</td>
                    </thead>
                    <tbody>
                        {exchangeRates.map((item, index) => {
                            return(
                                <tr key={index}>
                                    <td>{item?.date}</td>
                                    <td>{item?.from_currency_id}</td>
                                    <td>{item.to_currency_id}</td>
                                    <td>{item.price}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ExchangeRate;