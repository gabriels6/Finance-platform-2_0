import React, { useContext, useEffect, useState } from "react";
import { MessageHolder } from "../../components";
import { Button, Form } from "react-bootstrap";
import "./styles.css"
import financeDataApi from "../../utils/finance-data-api";
import UserContext from "../../context/UserContext";

const IncomeTaxEarnings = () => {

    const userContext = useContext(UserContext);

    const [earningItem, setearningItem] = useState({
        asset_symbol: '',
        date: '',
        value: 0,
        paid_tax: 0,
    });

    const [reloaded, setReloaded] = useState(false);
    const [earnings, setEarnings] = useState([]);

    useEffect(() => {
        if(!reloaded) {
            setReloaded(true);
            financeDataApi.getEarnings(userContext.integrationToken).then((earningData) => {
                setEarnings([...earningData]);
            });
        }
    })

    function handleChangeAssetitem(event) {
        let valueKey = event.target.id?.replace("input","")?.toLowerCase();
        let currentearningItem = earningItem;
        currentearningItem[valueKey] = event.target.value
        setearningItem({
            ...currentearningItem,
        });
    }

    function handleSaveEarning() {
        financeDataApi.saveEarnings(earningItem, userContext.integrationToken).then((data) => {
            userContext.setMessages([
                {
                    type:  "success",
                    value: `Earning for ${earningItem?.asset_symbol} successfully imported!`
                }
            ])
        }).catch((err) => {
            userContext.setMessages([
                {
                    type:  "error",
                    value: `Error creating earning for ${earningItem?.asset_symbol}: ${err.error}`
                }
            ])
        }).finally(() => {
            setReloaded(false)
        })
    }

    function handleDeleteEarning(event) {
        let earningToDelete = earnings[event.currentTarget.id]
        financeDataApi.deleteEarning(earningToDelete.date, earningToDelete.asset.symbol, userContext.integrationToken).then(() => {
            userContext.setMessages([
                {
                    type:  "success",
                    value: `Earning for ${earningItem?.asset_symbol} successfully delete!`
                }
            ])
        }).catch((err) => {
            userContext.setMessages([
                {
                    type:  "error",
                    value: `Error deleting earning for ${earningItem?.asset_symbol}: ${err.error}`
                }
            ])
        }).finally(() => {
            setReloaded(false)
        })
    }

    return (
        <div className="control">
            <MessageHolder/>
            <div className="card earning-header">
                <div className="title">
                    Earnings
                </div>
                <div className="earning-form">
                    <Form.Label htmlFor="inputAsset_Symbol">
                        Asset
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputAsset_Symbol"
                        onChange={handleChangeAssetitem}
                        value={earningItem.asset_symbol}
                    />
                    <Form.Label htmlFor="inputDate">
                        Date
                    </Form.Label>
                    <Form.Control
                        type="date"
                        id="inputDate"
                        onChange={handleChangeAssetitem}
                        value={earningItem.date}
                    />
                    <Form.Label htmlFor="inputValue">
                        Value
                    </Form.Label>
                    <Form.Control
                        type="number"
                        id="inputValue"
                        onChange={handleChangeAssetitem}
                        value={earningItem.value}
                    />
                    <Form.Label htmlFor="inputPaid_Tax">
                        Paid Tax
                    </Form.Label>
                    <Form.Control
                        type="number"
                        id="inputPaid_Tax"
                        onChange={handleChangeAssetitem}
                        value={earningItem.paid_tax}
                    />
                    <div className="assets-buttons">
                        <Button variant='outline-primary' onClick={handleSaveEarning}>
                            Save
                        </Button>
                    </div>
                </div>
            </div>
            <div className="card earning-list">
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Asset</th>
                                <th>Date</th>
                                <th>Value</th>
                                <th>Converted Value</th>
                                <th>Paid Tax</th>
                                <th>Converted Paid Tax</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { earnings.map((earning, index) => {
                                return (
                                    <tr key={'earning-item-'+index}>
                                        <td>{earning.asset?.symbol}</td>
                                        <td>{earning.date}</td>
                                        <td>{earning.value}</td>
                                        <td>{earning.converted_value}</td>
                                        <td>{earning.paid_tax}</td>
                                        <td>{earning.converted_paid_tax}</td>
                                        <td>
                                            <Button variant="outline-danger" id={index} onClick={handleDeleteEarning}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            }) }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default IncomeTaxEarnings;