import React, { useContext, useEffect, useState } from "react";
import financeDataApi from "../../utils/finance-data-api";
import UserContext from "../../context/UserContext";

const IncomeTaxMonthlyReport = () => {

    const userContext = useContext(UserContext)

    const [monthlyReport, setMonthlyReport] = useState([]);

    const [reloaded, setReloaded] = useState(false);

    useEffect(() => {
        if(!reloaded) {
            setReloaded(true);
            financeDataApi.getEarningMonthlyReport(userContext?.date, userContext.integrationToken).then((earningData) => {
                setMonthlyReport([...earningData]);
            });
        }
    })

    return (
        <div className="control">
            <div className="card vertical-align">
                <div className="title">
                    Earnings Report
                </div>
                <div className="horizontal-align">

                </div>
            </div>
            <div className="card horizontal-align">
                <table>
                    <thead>
                        <tr>
                            <th>Month/Year</th>
                            <th>Ptax</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        { monthlyReport.map((monthReport) => {
                            return (
                                <tr>
                                    <td>{monthReport?.month}/{monthReport?.year}</td>
                                    <td>{monthReport.ptax}</td>
                                    <td>{monthReport.value}</td>
                                </tr>
                            )
                        }) }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default IncomeTaxMonthlyReport;