import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { ScatterChart, CartesianGrid, XAxis, YAxis, Scatter, Tooltip, Label, LabelList, BarChart, Bar, Legend } from 'recharts';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import './styles.css';

const AssetRiskPage = () => {

    const colors = scaleOrdinal(schemeCategory10).range();
    const userContext = useContext(UserContext);

    function handleRefresh(event) {
        let apiKey = userContext.integrationToken;
        let assets = userContext.favoriteAssets.map((asset) => asset.symbol)
        let assetPromises = assets.map((asset) => {
            return financeDataApi.getAssetData(asset, apiKey);
        })
        Promise.all(assetPromises).then((assetData) => {
            userContext.setFavoriteAssets([
                ...assetData.flat().map((assets) => ({
                    ...assets,
                    treynorIndex: assets.treynor_index,
                    beta: assets.beta,
                    return: assets.rentability
                }))
            ])
        })
        
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
        </div>
    )
}

export default AssetRiskPage;