import React, { useContext, useEffect, useState } from "react";
import { MessageHolder } from "../../components";
import UserContext from "../../context/UserContext";
import financeDataApi from "../../utils/finance-data-api";
import { Button } from "react-bootstrap";
import { scaleSequentialSymlog } from "d3-scale";

const DailyStockPrices = () => {

    const userContext = useContext(UserContext);

    const [date, setDate] = useState("")
    const [stockPrices, setStockPrices] = useState([])
    const [symbolsToImport, setSymbolsToImport] = useState([])

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

    function handleAddAutoImport(event) {
        let symbol = `${event.target.id}`.split("-")[2];
        let newSymbolsToImport
        if(symbolsToImport.includes(symbol))
            newSymbolsToImport = symbolsToImport.filter((symbolToImport) => symbolToImport != symbol)
        else
            newSymbolsToImport = [...symbolsToImport, symbol];
        setSymbolsToImport([...newSymbolsToImport])
    }

    function handleImportSelectedPrices() {
        financeDataApi.importTwelveDataEodPrices(symbolsToImport, userContext.integrationToken)
            .then(() => {
                userContext.setMessages([
                    {
                        type:  "success",
                        value: `Prices for ${symbolsToImport.join(",")} successfully imported`
                    }
                ])
                setDate("")
            })
            .catch((ex) => {
                userContext.setMessages([
                    {
                        type:  "error",
                        value: `Error importing prices for ${symbolsToImport.join(",")}: ${ex.error}`
                    }
                ])
            })
    }

    function handleImportBrazilianQuotes() {
        financeDataApi.importBrazilianQuotes(userContext.token, userContext.integrationToken).then((data) => {
            userContext.setMessages([
                ...userContext.messages,
                {
                    type: 'success',
                    value: 'Brazilian quotes imported successfully!'
                }
            ])
        }).catch((err) => {
            userContext.setMessages([
                ...userContext.messages,
                {
                    type: 'error',
                    value: err.error
                }
            ])
        })
    }

    return (
        <div className='control'>
            <MessageHolder/>
            <div className="card">
                <div className='value-section'>
                    <div className="info-text">
                        Prices to Auto Import
                    </div>
                    <div className='value-text'>
                        {symbolsToImport.length}
                    </div>
                </div>
                <div className='assets-buttons'>
                    <Button variant="outline-primary" onClick={handleImportSelectedPrices}>
                        Import selected Prices
                    </Button>
                    <Button variant="outline-primary" onClick={handleImportBrazilianQuotes}>
                        Import Brazilian Quotes
                    </Button>
                </div>
            </div>
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
                                        <Button id={"auto-import-"+assetPrice.symbol} variant={symbolsToImport.includes(assetPrice.symbol) ? "outline-danger" : "outline-primary"}
                                            onClick={handleAddAutoImport}>
                                            { symbolsToImport.includes(assetPrice.symbol) ? "Remove from Auto Import" : "Add to Auto Import" }
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