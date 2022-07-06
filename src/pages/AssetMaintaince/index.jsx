import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import './styles.css';

const AssetMaintaince = () => {

    const [assets, setAssets] = useState([]);
    const [reloaded, setReloaded] = useState(false);
    const userContext = useContext(UserContext);

    const [assetItem, setAssetItem] = useState({
        id: null,
        symbol: '',
        type: '',
        external_id: '',
    });

    useEffect(() => {
        if(!reloaded) {
            setReloaded(true);
            financeDataApi.getAssets(userContext.integrationToken).then((assetData) => {
                setAssets([...assetData]);
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
        financeDataApi.saveAsset(assetItem, userContext.token).then((data) => {
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
                userContext.messages,
                {
                    type: 'error',
                    value: err.error
                }
            ])
            setReloaded(false);
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
                    />
                    <Form.Label htmlFor="inputSymbol">
                        Symbol
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputSymbol"
                        onChange={handleChangeAssetitem}
                    />
                    <Form.Label htmlFor="inputType">
                        Type
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputType"
                        onChange={handleChangeAssetitem}
                    />
                    <Form.Label htmlFor="inputExternal_Id">
                        External Id
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputExternal_Id"
                        onChange={handleChangeAssetitem}
                    />
                    <div className="assets-buttons">
                        <Button variant='outline-primary' onClick={handleSaveAsset}>
                            Create Asset
                        </Button>
                        <Button variant='outline-primary' onClick={() => { setReloaded(false); }}>
                            Reload
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
                                <th>Type</th>
                                <th>External Id</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { assets.map((asset,index) => {
                                return (
                                    <tr key={'asset-item-'+index}>
                                        <td>{asset.id}</td>
                                        <td>{asset.symbol}</td>
                                        <td>{asset.asset_type.name}</td>
                                        <td>{asset.external_id}</td>
                                        <td>
                                            <Button variant="outline-primary" id={asset.id}>
                                                Edit
                                            </Button>
                                        </td>
                                        <td>
                                            <Button variant="outline-danger" id={asset.id}>
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