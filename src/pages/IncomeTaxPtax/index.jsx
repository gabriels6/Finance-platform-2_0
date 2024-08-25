import React, { useContext, useEffect, useState } from "react";
import { MessageHolder } from "../../components";
import { Button, Form } from "react-bootstrap";
import UserContext from "../../context/UserContext";
import financeDataApi from "../../utils/finance-data-api";
import "./styles.css"

const IncomeTaxPtax = () => {
    
    const userContext = useContext(UserContext);

    const [ptaxItem, setptaxItem] = useState({
        month: 0,
        year: 0,
        value: 0
    });

    const [reloaded, setReloaded] = useState(false);
    const [ptax, setPtax] = useState([]);

    useEffect(() => {
        if(!reloaded) {
            setReloaded(true);
            financeDataApi.getPtax(userContext.date?.getYear(), userContext.integrationToken).then((ptaxData) => {
                setPtax([...ptaxData]);
            });
        }
    })

    function handleChangeAssetitem(event) {
        let valueKey = event.target.id?.replace("input","")?.toLowerCase();
        let currentptaxItem = ptaxItem;
        currentptaxItem[valueKey] = event.target.value
        setptaxItem({
            ...currentptaxItem,
        });
    }

    function handleSavePtax() {
        financeDataApi.savePtax(ptaxItem, userContext.integrationToken).then((data) => {
            userContext.setMessages([
                {
                    type:  "success",
                    value: `Ptax for ${ptaxItem?.asset_symbol} successfully imported!`
                }
            ])
        }).catch((err) => {
            userContext.setMessages([
                {
                    type:  "error",
                    value: `Error creating ptax for ${ptaxItem?.asset_symbol}: ${err.error}`
                }
            ])
        }).finally(() => {
            setReloaded(false)
        })
    }

    function handleDeletePtax(event) {
        let ptaxToDelete = ptax[event.currentTarget.id]
        financeDataApi.deletePtax(ptaxToDelete.month, ptaxToDelete.year, userContext.integrationToken).then(() => {
            userContext.setMessages([
                {
                    type:  "success",
                    value: `Ptax for ${ptaxItem?.asset_symbol} successfully delete!`
                }
            ])
        }).catch((err) => {
            userContext.setMessages([
                {
                    type:  "error",
                    value: `Error deleting ptax for ${ptaxItem?.asset_symbol}: ${err.error}`
                }
            ])
        }).finally(() => {
            setReloaded(false)
        })
    }

    return (
        <div className="control">
            <MessageHolder/>
            <div className="card ptax-header">
                <div className="title">
                    Ptax
                </div>
                <div className="ptax-form">
                    <Form.Label htmlFor="inputMonth">
                        Month
                    </Form.Label>
                    <Form.Control
                        type="number"
                        id="inputMonth"
                        onChange={handleChangeAssetitem}
                        value={ptaxItem.month}
                    />
                    <Form.Label htmlFor="inputYear">
                        Year
                    </Form.Label>
                    <Form.Control
                        type="number"
                        id="inputYear"
                        onChange={handleChangeAssetitem}
                        value={ptaxItem.year}
                    />
                    <Form.Label htmlFor="inputValue">
                        Value
                    </Form.Label>
                    <Form.Control
                        type="number"
                        id="inputValue"
                        onChange={handleChangeAssetitem}
                        value={ptaxItem.value}
                    />
                    <div className="assets-buttons">
                        <Button variant='outline-primary' onClick={handleSavePtax}>
                            Save
                        </Button>
                    </div>
                </div>
            </div>
            <div className="card ptax-list">
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Year</th>
                                <th>Value</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { ptax.map((ptax, index) => {
                                return (
                                    <tr key={'ptax-item-'+index}>
                                        <td>{ptax.month}</td>
                                        <td>{ptax.year}</td>
                                        <td>{ptax.value}</td>
                                        <td>
                                            <Button variant="outline-danger" id={index} onClick={handleDeletePtax}>
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

export default IncomeTaxPtax;