import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import React, { useContext } from 'react';
import { useState } from 'react';
import { Button, Form, FormControl, FormLabel } from 'react-bootstrap';
import { ScatterChart, CartesianGrid, XAxis, YAxis, Scatter, Tooltip, Label, LabelList, BarChart, Bar, Legend, LineChart, Line } from 'recharts';
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

    const [assetVarResult, setAssetVarResult] = useState(0.0)

    function handleAssetDataForVar(event) {
        let auxiliarDataForVar = assetDataForVar;
        auxiliarDataForVar[event.target.id] = event.target.value
        setAssetDataForVar(auxiliarDataForVar)
        console.log(assetDataForVar)
    }

    function handleRefresh(event) {
        let apiKey = userContext.integrationToken;
        let assets = userContext.favoriteAssets.map((asset) => asset.symbol)
        let assetPromises = [];
        let assetPricePromises = [];
        assets.forEach((asset) => {
            assetPromises.push(financeDataApi.getAssetData(asset, apiKey));
            assetPricePromises.push(financeDataApi.getAssetPriceHist(asset, '', userContext.date, apiKey));
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

    function calculateAssetVar(){
        financeDataApi.calculateVar(assetDataForVar, API_KEY).then((data) => {
            setAssetVarResult(data?.var)
        });
    }

    return (
        <div className="control">
            <div className="card asset-risk-header">
                <div>
                    Asset Risk Reports
                </div>
                <div>
                    <Button variant="outline-primary" onClick={handleRefresh}>
                        Refresh Values
                    </Button>
                </div>
            </div>
            <div className="card asset-risk-return-chart">
                <div className="title">
                    Risk x Return
                </div>
                <ScatterChart 
                    width={1050} 
                    height={350} 
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                    <CartesianGrid />
                    <XAxis dataKey="return" type="number" name="Return" unit="%" >
                        <Label value="Return" offset={0} position="insideBottom"/>
                    </XAxis>
                    <YAxis dataKey="beta" type="number" name="Beta" unit=" pts" >
                        <Label value="Risk" offset={0} angle={-90} position="insideLeft"/>
                    </YAxis>
                    <Scatter name="A school" data={userContext.favoriteAssets} fill="#8884d8" >
                        <LabelList dataKey="symbol" position="right"/>
                    </Scatter>
                    <Tooltip cursor={{strokeDasharray: '8 8'}} />
                </ScatterChart>
            </div>
            <div className="card asset-risk-return-chart">
                <div className="title">
                    Treynor Ratio
                </div>
                <BarChart width={1050} height={350} data={userContext.favoriteAssets}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="symbol" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="treynorIndex" fill="#bf00ff" />
                </BarChart> 
            </div>
            <div className="card asset-risk-return-chart">
                <div className="title">
                    Asset Rentability Comparison
                </div>
                <LineChart width={730} height={250} data={groupMethods.groupAssetHist(userContext.assetValueHist,'rentability')}
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
            </div>
            <div className="card asset-var">
                <div className="title">
                    Asset VaR
                </div>
                <Form className="d-flex flex-column">
                    {Object.entries(assetDataForVar).map((value, index) => (
                        <div>
                            <FormLabel>
                                {value[0]}
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