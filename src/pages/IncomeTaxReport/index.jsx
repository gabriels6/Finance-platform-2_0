import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import UserContext from "../../context/UserContext";
import financeDataApi from "../../utils/finance-data-api";

const IncomeTaxReport = () => {

    const [reportData, setReportData] = useState({});
    const userContext = useContext(UserContext);


    function getReport(event) {
        financeDataApi.getIncomeTaxPortfolio({
            date: userContext.date
        }, userContext.integrationToken).then((data) => {
            setReportData({...data});
        })
    }

    return (
        <div className="control">
            <div className="card horizontal-align">
                <div className="title">
                    Income Tax Report
                </div>
                <Button variant='outline-primary' onClick={getReport}>
                    Refresh
                </Button>
            </div>
            <div className="card">
                <table>
                    <tbody>
                        <tr>
                            <td colSpan={7}>
                                Positions
                            </td>
                        </tr>
                        {reportData?.positions ? Object.entries(reportData?.positions).map((value, index) => {
                                        return (
                                           <>
                                                <tr>
                                                    <td rowSpan={value[1].length + 1}>
                                                        {value[0]}
                                                    </td>
                                                </tr>
                                                    {value[1].map((positionValue) => {
                                                        return (
                                                            <tr>
                                                                <td>{positionValue.asset_name}</td>
                                                                <td>{positionValue.average_price}</td>
                                                                <td>{positionValue.quantity}</td>
                                                                <td>{(positionValue.average_price * positionValue.quantity).toFixed(2)}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                
                                            </>
                                        )
                                    }) : ''}
                        <tr>
                            <td colSpan={7}>
                                Receivables
                            </td>
                        </tr>
                        {reportData?.receivables ? reportData.receivables.map((value) => {
                            return (
                                <>
                                    <tr>
                                        <td colSpan={7}>{value.asset.symbol}</td>
                                    </tr>
                                    {
                                        Object.entries(value.receivable_amounts).map((receivable_value) => {
                                            let receivable_key = receivable_value[0]
                                            let receivable_data = receivable_value[1]
                                            return(
                                                <tr>
                                                    <td>{receivable_key}</td>
                                                    <td colSpan={4}>{receivable_data}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                </>
                            )
                        }): ""}
                            
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default IncomeTaxReport;