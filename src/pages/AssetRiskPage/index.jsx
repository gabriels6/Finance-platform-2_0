import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import React, { useContext } from 'react';
import { useState } from 'react';
import { Button, Form, FormControl, FormLabel } from 'react-bootstrap';
import { ScatterChart, CartesianGrid, XAxis, YAxis, Scatter, Tooltip, Label, LabelList, BarChart, Bar, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import groupMethods from '../../utils/group-methods';
import './styles.css';

const AssetRiskPage = () => {

    const colors = scaleOrdinal(schemeCategory10).range();
    const userContext = useContext(UserContext);

    const API_KEY = userContext.integrationToken

    const [assetDataForVar, setAssetDataForVar] = useState({
        symbol: "",
        reliability: 95.0,
        expected_return: 0.0,
        initial_date: "",
        final_date: "",
        amount: ""
    });

    const labels = {
        initial_date: "Initial Date (yyyy-mm-dd)",
        final_date: "Final Date (yyyy-mm-dd)",
        reliability: "Reliability (%)",
        expected_return: "Expected Return (%)"
    }

    const [assetVarResult, setAssetVarResult] = useState(0.0)
    const [startDate, setStartDate] = useState('');

    function handleAssetDataForVar(event) {
        let auxiliarDataForVar = assetDataForVar;
        auxiliarDataForVar[event.target.id] = event.target.value
        setAssetDataForVar(auxiliarDataForVar)
    }

    function handleRefresh(event) {
        let apiKey = userContext.integrationToken;
        let assets = userContext.favoriteAssets.map((asset) => asset.symbol)
        let assetPromises = [];
        let assetPricePromises = [];
        assets.forEach((asset) => {
            assetPromises.push(financeDataApi.getAssetData(asset, startDate, userContext.date, apiKey));
            assetPricePromises.push(financeDataApi.getAssetPriceHist(asset, startDate, userContext.date, null, apiKey));
        });
        Promise.all(assetPromises).then((assetData) => {
            let parsedAssetData = assetData.flat().map((assets) => ({
                ...assets,
                treynorIndex: assets.treynor_index,
                beta: assets.beta,
                return: assets.rentability
            }))

            userContext.setFavoriteAssets([
                ...parsedAssetData
            ])
        })
        Promise.all(assetPricePromises).then((assetPriceData) => {
            userContext.setAssetValueHist([
                ...assetPriceData.flat(1)
            ])
        });
    }

    function handleStartDate(event) {
        setStartDate(event.target.value);
    }

    function calculateAssetVar(){
        financeDataApi.calculateVar({
            ...assetDataForVar,
            expected_return: +assetDataForVar.expected_return/100.0,
            reliability: +assetDataForVar.reliability/100.0
        }, API_KEY).then((data) => {
            setAssetVarResult(data?.var)
        });
    }

    return (
        <div className="control">
            <div className="card asset-risk-header">
                <div>
                    Asset Risk Reports
                </div>
                <div class="horizontal-align">
                    <Form className="d-flex">
                        <FormControl className="me-2" type="date" value={startDate} onChange={handleStartDate} />
                    </Form>
                    <Button variant="outline-primary" onClick={handleRefresh}>
                        Refresh Values
                    </Button>
                </div>
            </div>
            <div className="card asset-risk-return-chart">
                <div className="title">
                    Risk x Return
                </div>
                <ResponsiveContainer>
                    <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid />
                        <XAxis dataKey="return" type="number" name="Return" unit="%" domain={[-100,100]}>
                            <Label value="Return" offset={0} position="insideBottom"/>
                        </XAxis>
                        <YAxis dataKey="beta" type="number" name="Beta" unit=" pts" domain={[-1.5,1.5]}>
                            <Label value="Risk" offset={0} angle={-90} position="insideLeft"/>
                        </YAxis>
                        <Scatter name="A school" data={userContext.favoriteAssets} fill="#8884d8" >
                            <LabelList dataKey="symbol" position="right"/>
                        </Scatter>
                        <Tooltip cursor={{strokeDasharray: '8 8'}} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <div className="card asset-risk-return-chart">
                <div className="title">
                    Treynor Ratio
                </div>
                <ResponsiveContainer>
                    <BarChart data={userContext.favoriteAssets}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="symbol" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="treynorIndex" fill="#bf00ff" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="card asset-risk-return-chart">
                <div className="title">
                    Asset Rentability Comparison
                </div>
                <ResponsiveContainer>
                    <LineChart data={groupMethods.groupAssetHist(userContext.assetValueHist,'rentability')}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Legend />
                        <Tooltip />
                        { groupMethods.groupAssetHistSecurities(userContext.assetValueHist).map((symbol,index) => (
                            <Line type="monotone" dataKey={symbol} key={`part-`+index} stroke={colors[index % 10]} />
                        )) }
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="card asset-var">
                <div className="title">
                    Asset VaR
                </div>
                <Form className="d-flex flex-column">
                    {Object.entries(assetDataForVar).map((value, index) => (
                        <div>
                            <FormLabel>
                                {labels[value[0]] || value[0]}
                            </FormLabel>
                            <FormControl
                                key={index}
                                type="search"
                                className="me-2"
                                aria-label="Search"
                                id={value[0]}
                                onChange={handleAssetDataForVar}
                            />
                        </div>
                    ))}
                    <div>
                    <Button variant="outline-success" onClick={calculateAssetVar}>Calculate</Button>
                    </div>
                </Form>
                <div className="subtitle">
                    Result: {assetVarResult}
                </div>
            </div>
        </div>
    )
}

export default AssetRiskPage;