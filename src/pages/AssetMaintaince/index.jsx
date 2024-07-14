import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import './styles.css';

const AssetMaintaince = () => {

    const [reloaded, setReloaded] = useState(false);
    const userContext = useContext(UserContext);

    const [assetItem, setAssetItem] = useState({
        id: '',
        symbol: '',
        asset_type: '',
        external_id: '',
        yahoo_code: '',
        sector: '',
        investing_external_id: '',
    });

    useEffect(() => {
        if(!reloaded) {
            setReloaded(true);
            financeDataApi.getAssets(userContext.integrationToken).then((assetData) => {
                userContext.setAssets([...assetData]);
            });
        }
    })

    function handleChangeAssetitem(event) {
        let valueKey = event.target.id?.replace("input","")?.toLowerCase();
        let currentAssetItem = assetItem;
        currentAssetItem[valueKey] = event.target.value
        setAssetItem({
            ...currentAssetItem,
        });
    }

    function handleSaveAsset(event) {
        financeDataApi.saveAsset(assetItem, userContext.integrationToken).then((data) => {
            userContext.setMessages([
                ...userContext.messages,
                {
                    type: 'success',
                    value: 'Asset successfully created!'
                }
            ])
            setReloaded(false);
        }).catch((err) => {
            userContext.setMessages([
                ...userContext.messages,
                {
                    type: 'error',
                    value: err.error
                }
            ])
            setReloaded(false);
        })
    }

    function handleImportQuotes(){
        financeDataApi.importAllDailyQuotes({}, userContext.integrationToken).then((data) => {
            userContext.setMessages([
                ...userContext.messages,
                {
                    type: 'success',
                    value: 'Daily quotes imported successfully!'
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

    function handleDeleteAsset(event) {
        let id = event.target.id;
        financeDataApi.deleteAsset({
            id: id
        }, userContext.integrationToken).then((data) => {
            userContext.setMessages([
                ...userContext.messages,
                {
                    type: 'success',
                    value: 'Asset sucessfully deleted!'
                }
            ]);
        }).catch((err) => {
            userContext.setMessages([
                ...userContext.messages,
                {
                    type: 'error',
                    value: err.error || err.message
                }
            ]);
        });
    }

    function handleYearlyQuotes(event) {
        let assetId = event.target.id
        let selectedAsset = userContext.assets.find((assetItem, index) => (assetItem.id == assetId));
        financeDataApi.importYahooYearlyQuotes(selectedAsset?.symbol, userContext.integrationToken).then(() => {
            userContext.setMessages([
                {
                    type:  "success",
                    value: `Yearly quotes for ${selectedAsset?.symbol} successfully imported!`
                }
            ])
        }).catch((ex) => {
            userContext.setMessages([
                {
                    type:  "error",
                    value: `Error importing quotes for ${selectedAsset?.symbol}: ${ex.error}`
                }
            ])
        })
    }

    function handleHistoricalQuotes(event) {
        let assetId = event.target.id
        let selectedAsset = userContext.assets.find((assetItem, index) => (assetItem.id == assetId));
        financeDataApi.importYahooHistoricalQuotes(selectedAsset?.symbol, userContext.integrationToken).then(() => {
            userContext.setMessages([
                {
                    type:  "success",
                    value: `Historical quotes for ${selectedAsset?.symbol} successfully imported!`
                }
            ])
        }).catch((ex) => {
            userContext.setMessages([
                {
                    type:  "error",
                    value: `Error importing historical quotes for ${selectedAsset?.symbol}: ${ex.error}`
                }
            ])
        })
    }

    function handleEdit(event) {
        let assetId = event.target.id
        let selectedAsset = userContext.assets.find((assetItem, index) => (assetItem.id == assetId));
        setAssetItem({
            id: selectedAsset.id,
            symbol: selectedAsset.symbol,
            currency: selectedAsset.currency.symbol,
            asset_type: selectedAsset.asset_type.name,
            external_id: selectedAsset.external_id,
            country: selectedAsset.country.name,
            yahoo_code: selectedAsset.yahoo_code,
            sector: selectedAsset.sector.name,
            investing_external_id: selectedAsset.investing_external_id
        })
    }

    return (
        <div className='control'>
            <MessageHolder/>
            <div className="card asset-header">
                <div>
                    Assets
                </div>
                <div className="asset-form">
                    <Form.Label htmlFor="inputId">
                        Id
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputId"
                        onChange={handleChangeAssetitem}
                        value={assetItem.id}
                    />
                    <Form.Label htmlFor="inputSymbol">
                        Symbol
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputSymbol"
                        onChange={handleChangeAssetitem}
                        value={assetItem.symbol}
                    />
                    <Form.Label htmlFor="inputCountry">
                        Country
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputCountry"
                        onChange={handleChangeAssetitem}
                        value={assetItem.country?.name}
                    />
                    <Form.Label htmlFor="inputCurrency">
                        Currency
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputCurrency"
                        onChange={handleChangeAssetitem}
                        value={assetItem.currency?.name}
                    />
                    <Form.Label htmlFor="inputAsset_Type">
                        Type
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputAsset_Type"
                        onChange={handleChangeAssetitem}
                        value={assetItem.asset_type}
                    />
                    <Form.Label htmlFor="inputExternal_Id">
                        External Id
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputExternal_Id"
                        onChange={handleChangeAssetitem}
                        value={assetItem.external_id}
                    />
                    <Form.Label htmlFor="inputYahoo_Code">
                        Yahoo Code
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputYahoo_Code"
                        onChange={handleChangeAssetitem}
                        value={assetItem.yahoo_code}
                    />
                    <Form.Label htmlFor="inputSector">
                        Sector
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputSector"
                        onChange={handleChangeAssetitem}
                        value={assetItem.sector}
                    />
                    <Form.Label htmlFor="inputInvesting_external_id">
                        Investing External Id
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputInvesting_external_id"
                        onChange={handleChangeAssetitem}
                        value={assetItem.investing_external_id}
                    />
                    <div className="assets-buttons">
                        <Button variant='outline-primary' onClick={handleSaveAsset}>
                            Create Asset
                        </Button>
                        <Button variant='outline-primary' onClick={() => { setReloaded(false); }}>
                            Reload
                        </Button>
                        <Button variant='outline-primary' onClick={handleImportQuotes}>
                            Import all Daily Quotes
                        </Button>
                    </div>
                </div>
            </div>
            <div className="card asset-list">
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Symbol</th>
                                <th>Country</th>
                                <th>Currency</th>
                                <th>Type</th>
                                <th>External Id</th>
                                <th>Yahoo Code</th>
                                <th>Sector</th>
                                <th>Investing External Id</th>
                                <th></th>
                                <th></th>
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
                                        <td>{asset.country?.name}</td>
                                        <td>{asset.currency?.symbol}</td>
                                        <td>{asset.asset_type.name}</td>
                                        <td>{asset.external_id}</td>
                                        <td>{asset.yahoo_code}</td>
                                        <td>{asset.sector.name}</td>
                                        <td>{asset.investing_external_id}</td>
                                        <td>
                                            <Button variant="outline-primary" id={asset.id} onClick={handleYearlyQuotes}>
                                                Import Yearly Quotes
                                            </Button>
                                        </td>
                                        <td>
                                            <Button variant="outline-primary" id={asset.id} onClick={handleHistoricalQuotes}>
                                                Import Historical Quotes
                                            </Button>
                                        </td>
                                        <td>
                                            <Button variant="outline-primary" id={asset.id} onClick={handleEdit}>
                                                Edit
                                            </Button>
                                        </td>
                                        <td>
                                            <Button variant="outline-danger" id={asset.id} onClick={handleDeleteAsset}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            }) }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AssetMaintaince;