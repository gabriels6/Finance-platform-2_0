import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Form, FormControl } from "react-bootstrap";
import UserContext from "../../context/UserContext";
import financeDataApi from "../../utils/finance-data-api";
import './styles.css'

const ImobiliaryFundsOportunities = () => {

    const [fundsList, setFundsList] = useState([]);
    const [fundsFilter, setFundsFilter] = useState({
        offset: 0,
        amount_of_elements: 10,
    });

    const userContext = useContext(UserContext);
    const API_KEY = userContext.integrationToken;

    function fillFundsTable() {
        financeDataApi.getImobiliaryFundsdata(fundsFilter, API_KEY).then((data) => {
            setFundsList([...data]);
        })
    }

    function getAllFundsTable() {
        let initialOffset = 0
        setFundsList([{}]);
        let promises = []
        while(initialOffset < 400) {
            promises.push(financeDataApi.getImobiliaryFundsdata({offset: initialOffset, amount_of_elements: 50}, API_KEY));
            initialOffset += 50;
        }
        Promise.all(promises).then((data) => {
            setFundsList([...data.flat()])
        })
    }

    function clearSelectors(){
        document.querySelectorAll("[selector]").forEach((element) => {
            element.innerText = element.innerText.replace("+","")
        });
    }

    function orderFunds(event) {
        clearSelectors()
        event.target.innerText = "+" + event.target.innerText.replace("+","")
        let attribute = event.target.getAttribute('selector')
        let orderedFunds = fundsList.sort((itemA, itemB) => {
            return parseFloat(itemA[attribute]?.replace("R$","") || "0") > parseFloat(itemB[attribute]?.replace("R$","") || "0") ? -1 : 1
        })
        setFundsList([...orderedFunds])
    }

    return (
        <div className="control">
            <div className="card funds-search-bar">
                <div className="title">
                    Funds List
                </div>
                <Form className="d-flex">
                    <FormControl
                    type="number"
                    placeholder="Offset"
                    className="me-2"
                    aria-label="Offset"
                    onChange={(event) => { setFundsFilter({...fundsFilter, offset: event.target.value}) }}
                    />
                    <FormControl
                    type="number"
                    placeholder="Amount of Elements"
                    className="me-2"
                    aria-label="Amount of Elements"
                    onChange={(event) => { setFundsFilter({...fundsFilter, amount_of_elements: event.target.value})}}
                    />
                    <Button variant="outline-success" onClick={fillFundsTable}>Filter</Button>
                    <Button variant="outline-success" onClick={getAllFundsTable}>All</Button>
                </Form>
            </div>
            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <td selector={"asset"} onClick={orderFunds}>Asset</td>
                            <td selector={"date"} onClick={orderFunds}>Date</td>
                            <td selector={"assetValue"} onClick={orderFunds}>Value</td>
                            <td selector={"minValue"} onClick={orderFunds}>Min Value</td>
                            <td selector={"maxValue"} onClick={orderFunds}>Max Value</td>
                            <td selector={"dividendYield"} onClick={orderFunds}>DY (%)</td>
                            <td selector={"dividendMoney12Months"} onClick={orderFunds}>Dividends (R$)</td>
                            <td selector={"pVP"} onClick={orderFunds}>Price/NAV</td>
                            <td selector={"patrimonioPorCota"} onClick={orderFunds}>Price/Quote</td>
                        </tr>
                    </thead>
                    <tbody>
                        {fundsList.map((item, index) => {
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
                                    <td>{item?.patrimonioPorCota}</td>
                                </tr>
                            )
                        })}   
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ImobiliaryFundsOportunities;