import React, {useContext, useState} from 'react';
import { Button, FormControl, Form } from 'react-bootstrap';
import './styles.css';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';

const StocksOportunities = () => {


    const [stocksList, setStocksList] = useState([]);
    const [stocksFilter, setStocksFilter] = useState({
        pages: 1,
        offset: 0,
        expected_yield: 0.06
    });



    const userContext = useContext(UserContext);
    const API_KEY = userContext.integrationToken;

    function fillStocksTable() {
        financeDataApi.getStocksData(stocksFilter, API_KEY).then((data) => {
            setStocksList([...data]);
        })
    }

    function getAllStocksTable() {
        let initialOffset = 0
        setStocksList([{}]);
        let promises = []
        while(initialOffset < 400) {
            promises.push(financeDataApi.getStocksData({offset: initialOffset, pages: 50}, API_KEY));
            initialOffset += 50;
        }
        Promise.all(promises).then((data) => {
            setStocksFilter([...data.flat()])
        })
    }

    function clearSelectors(){
        document.querySelectorAll("[selector]").forEach((element) => {
            element.innerText = element.innerText.replace("+","")
        });
    }

    function orderStocks(event) {
        clearSelectors()
        event.target.innerText = "+" + event.target.innerText.replace("+","")
        let attribute = event.target.getAttribute('selector')
        let orderedFunds = stocksList.sort((itemA, itemB) => {
            return parseFloat(itemA[attribute]?.replace("R$","") || "0") > parseFloat(itemB[attribute]?.replace("R$","") || "0") ? -1 : 1
        })
        setStocksList([...orderedFunds])
    }


    return (
        <div className="control">
            <div className="card funds-search-bar">
                <div className="title">
                    Stocks List
                </div>
                <Form className="d-flex">
                    <FormControl
                    type="number"
                    placeholder="Offset"
                    className="me-2"
                    aria-label="Offset"
                    onChange={(event) => { setStocksFilter({...stocksFilter, offset: event.target.value}) }}
                    />
                    <FormControl
                    type="number"
                    placeholder="Pages"
                    className="me-2"
                    aria-label="Pages"
                    onChange={(event) => { setStocksFilter({...stocksFilter, pages: event.target.value})}}
                    />
                    <FormControl
                    type="number"
                    placeholder="Expected yield"
                    className="me-2"
                    aria-label="Expected yield"
                    onChange={(event) => { setStocksFilter({...stocksFilter, expected_yield: event.target.value})}}
                    />
                    <Button variant="outline-success" onClick={fillStocksTable}>Filter</Button>
                    <Button variant="outline-success" onClick={getAllStocksTable}>All</Button>
                </Form>
            </div>
            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <td selector={"asset"} onClick={orderStocks}>Asset</td>
                            <td selector={"date"} onClick={orderStocks}>Date</td>
                            <td selector={"assetValue"} onClick={orderStocks}>Value</td>
                            <td selector={"minValue"} onClick={orderStocks}>Min Value</td>
                            <td selector={"maxValue"} onClick={orderStocks}>Max Value</td>
                            <td selector={"dividendYield"} onClick={orderStocks}>DY (%)</td>
                            <td selector={"dividendMoney12Months"} onClick={orderStocks}>Dividends (R$)</td>
                            <td selector={"pVP"} onClick={orderStocks}>Price/NAV</td>
                            <td selector={"pEbitda"} onClick={orderStocks}>Price/Ebitda</td>
                            <td selector={"vpa"} onClick={orderStocks}>Net asset Value by Quote</td>
                            <td selector={"fairValue"} onClick={orderStocks}>Fair Price *</td>
                        </tr>
                    </thead>
                    <tbody>
                        {stocksList.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item?.asset}</td>
                                    <td>{item?.date}</td>
                                    <td>{item?.assetValue}</td>
                                    <td>{item?.minValue}</td>
                                    <td>{item?.maxValue}</td>
                                    <td>{item?.dividendYield}</td>
                                    <td>{item?.dividendMoney12Months}</td>
                                    <td>{item?.pVP}</td>
                                    <td>{item?.pEbitda}</td>
                                    <td>{item?.vpa}</td>
                                    <td>{item?.fairValue}</td>
                                </tr>
                            )
                        })}   
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StocksOportunities;