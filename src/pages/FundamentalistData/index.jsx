import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { MessageHolder } from "../../components";
import UserContext from "../../context/UserContext";
import financeDataApi from "../../utils/finance-data-api";
import parseMethods from "../../utils/parse-methods";
import "./styles.css";

const FundamentalistDataPage = () => {

    const userContext = useContext(UserContext);

    const [selectedAsset, setSelectedAsset] = useState({});

    function importFundamentalistData(event){
        let asset_items = event.target.id.split("-")
        asset_items[0] = asset_items[0].replace(".SAO","")
        let type_map = {
            'Equity':'Stock',
            'ETF':'imobiliary_fund'
        };
        financeDataApi.importFundamentalistData({
            symbol: asset_items[0],
            type: type_map[asset_items[1]] || asset_items[1]
        }, userContext.integrationToken).then((data) => {
            userContext.handleSuccess("Fundamentalist Data successfully Imported.");
        }).catch(err => {
            userContext.handleError(err)
        });
    }

    function selectFundamentalistAsset(event) {
        let asset_symbol = event.target.id
        financeDataApi.getFundamentalistData({symbol: asset_symbol},userContext.integrationToken).then((data) => {
            if(!data[data.length - 1]) userContext.handleError(`${asset_symbol} not imported.`)
            setSelectedAsset({...data[data.length - 1]})
        }).catch(err => {
            userContext.handleError(err);
        })
    }

    return (
        <div className="control">
            <MessageHolder/>
            <div className="card">
                <div>
                    Fundamentalist Data Options
                </div>
            </div>
            <div className="card asset-list">
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Symbol</th>
                                <th>Type</th>
                                <th>External Id</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { userContext.assets.map((asset,index) => {
                                return (
                                    <tr key={'asset-item-'+index}>
                                        <td>{asset.id}</td>
                                        <td>{asset.symbol}</td>
                                        <td>{asset.asset_type.name}</td>
                                        <td>{asset.external_id}</td>
                                        <td>
                                            <Button variant="outline-primary" id={asset.symbol} onClick={selectFundamentalistAsset}>
                                                Select
                                            </Button>
                                        </td>
                                        <td>
                                            <Button variant="outline-primary" id={asset.symbol+"-"+asset.asset_type.name} onClick={importFundamentalistData}>
                                                Import Data
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            }) }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card fundamentalist-data-info">
                <div>
                    Fundamentalist Data
                </div>
                <div className="title">
                    {selectedAsset.asset} {selectedAsset.date}
                </div>
                <div className="horizontal-align">
                    <div className="fundamentalist-item">
                        <div className="fundamentalist-subtitle">
                            Value
                        </div>
                         {selectedAsset.asset_value}
                    </div>
                    <div className="fundamentalist-item">
                        <div className="fundamentalist-subtitle">
                            Min Value 52 weeks
                        </div>
                        {selectedAsset.min_value}
                    </div>
                    <div className="fundamentalist-item">
                        <div className="fundamentalist-subtitle">
                            Max Value 52 weeks
                        </div>
                        {selectedAsset.max_value}
                    </div>
                </div>
                <div className="horizontal-align">
                    <div className="fundamentalist-item">
                        <div className="fundamentalist-subtitle">
                            Dividend Yield
                        </div>
                        {selectedAsset.dividend_yield_percentage * 100}%
                    </div>
                    <div className="fundamentalist-item">
                        <div className="fundamentalist-subtitle">
                            Dividend Amount (12 months)
                        </div>
                        {selectedAsset.dividend_money_12_months}
                    </div>
                </div>
                <div className="horizontal-align">
                    <div className="fundamentalist-item">
                        <div className="fundamentalist-subtitle">
                            P/L
                        </div>
                        {selectedAsset.price_by_profit}
                    </div>
                    <div className="fundamentalist-item">
                        <div className="fundamentalist-subtitle">
                            P/VP
                        </div>
                        {selectedAsset.price_by_net_asset_value}
                    </div>
                    <div className="fundamentalist-item">
                        <div className="fundamentalist-subtitle">
                            P/EBITDA
                        </div>
                        {selectedAsset.price_by_ebitda}
                    </div>
                </div>
                <div className="horicontal-align">
                    <div className="fundamentalist-item">
                        <div className="fundamentalist-subtitle">
                            Value per Share
                        </div>
                        {selectedAsset.net_value_by_asset}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FundamentalistDataPage;