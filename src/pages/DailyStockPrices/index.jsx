import React, { useContext, useEffect, useState } from "react";
import { MessageHolder } from "../../components";
import UserContext from "../../context/UserContext";
import financeDataApi from "../../utils/finance-data-api";
import { Button } from "react-bootstrap";

const DailyStockPrices = () => {

    const userContext = useContext(UserContext);

    const [date, setDate] = useState("")
    const [stockPrices, setStockPrices] = useState([])

    useEffect(() => {
        if(date != userContext.date) {
            setDate(userContext.date)
            setStockPrices([])
            financeDataApi.getStockPricesByDay(userContext.date, userContext.integrationToken)
                .then((result) => {
                    setStockPrices(result)
                }).catch(() => {})
        }
    })

    function handleEditStockPrice(event) {
        let stockPrice = stockPrices[event.target.id]
        let price = document.getElementById('price-input'+event.target.id)?.value || 0.0
        financeDataApi.editStockPrice(stockPrice.symbol, stockPrice.date || userContext.date, price, userContext.integrationToken)
            .then(() => {
                userContext.setMessages([
                    {
                        type:  "success",
                        value: `Price for ${stockPrice?.symbol} successfully edited!`
                    }
                ])
                setDate("")
            })
            .catch((ex) => {
                userContext.setMessages([
                    {
                        type:  "error",
                        value: `Error updating price for ${stockPrice?.symbol}: ${ex.error}`
                    }
                ])
            })
    }

    return (
        <div className='control'>
            <MessageHolder />
            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Stock</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { stockPrices.map((assetPrice, index) => {
                            return (
                                <tr key={'asset-item-'+index}>
                                    <td>{assetPrice.symbol}</td>
                                    <td>{assetPrice.date}</td>
                                    <td>
                                        <input id={'price-input'+index} type="number" defaultValue={assetPrice.price}/>
                                    </td>
                                    <td>
                                        <Button variant="outline-primary" id={index} onClick={handleEditStockPrice}>
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            )
                        }) }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DailyStockPrices;