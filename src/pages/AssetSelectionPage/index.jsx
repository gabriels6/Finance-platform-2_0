import React, { useEffect, useState, useContext } from 'react';
import { Form, FormControl, Button} from 'react-bootstrap';
import parseMethods from '../../utils/parse-methods';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import './styles.css';
import { MessageHolder } from '../../components';

const AssetSelectionPage = () => {

    const [foundAssets, setFoundAssets] = useState([]);
    const [keyword, setKeyword] = useState("");

    const userContext = useContext(UserContext);

    const API_KEY = userContext.integrationToken

    function handleFavoritesAdd(event) {
        let index = event.target.id.split("-")[1];
        let asset = foundAssets[index];
        financeDataApi.getAssetData(asset.symbol, API_KEY).then((data) => {
            let assetData = data[0]
            userContext.setFavoriteAssets([...userContext.favoriteAssets, {
                ...asset,
                treynorIndex: assetData.treynor_index,
                beta: assetData.beta,
                return: assetData.rentability
            }]);
        });
    }

    function handleFavoritesRemove(event) {
        let selectedIndex = event.target.id.split("-")[1];
        userContext.setFavoriteAssets(userContext.favoriteAssets.filter((asset, index) => {
            return index !== (selectedIndex * 1);
        }))
    }

    function handleKeyword(event) {
        setKeyword(event.target.value);
    }

    function searchAssets(event) {
        financeDataApi.searchAsset(keyword,'', API_KEY).then((data) => {
            setFoundAssets(parseMethods.parseJSONWithNumbers(data));
        }).catch((err) => {
            userContext.handleError(err)
        });
    }

    function handleImportAsset(event) {
        let selectedIndex = event.target.id.split("-")[1];
        let asset = foundAssets[selectedIndex];
        financeDataApi.importAsset(asset.symbol, API_KEY).then((data) => {
            financeDataApi.importAssetSeries(asset.symbol, '2021-01-01',API_KEY).then((data) => {
                userContext.setMessages([
                    ...userContext.messages,
                    {
                        type: 'success',
                        value: "Asset Data imported sucessfully!"
                    }
                ]);
            }).catch((err) => { userContext.handleError(err); });
        }).catch((err) => { userContext.handleError(err); });
    }

    return(
        <div className="control">
            <MessageHolder/>
            <div className="card asset-search">
                <div>
                    Search for Asset
                </div>
                <Form className="d-flex">
                    <FormControl
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    onChange={handleKeyword}
                    />
                    <Button variant="outline-success" onClick={searchAssets}>Search</Button>
                </Form>
            </div>
            <div className="card asset-search-result">
                <div className="title">
                    Found Assets
                </div>
                <div>
                    <table>
                        <thead>
                            <th>Symbol</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Region</th>
                            <th>Market Open</th>
                            <th>Market Close</th>
                            <th>Timezone</th>
                            <th>Currency</th>
                            <th></th>
                            <th></th>
                        </thead>
                        <tbody>
                            {foundAssets.map((asset, index) => (
                                <tr key={'search-item-'+index}>                                    
                                    <td>{asset.symbol}</td>
                                    <td>{asset.name}</td>
                                    <td>{asset.type}</td>
                                    <td>{asset.region}</td>
                                    <td>{asset.marketOpen}</td>
                                    <td>{asset.marketClose}</td>
                                    <td>{asset.timezone}</td>
                                    <td>{asset.currency}</td>
                                    <td>
                                        <Button variant="outline-primary" id={'searchAsset-'+index} onClick={handleFavoritesAdd}>
                                            Add to Favorites
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="outline-primary" id={'favoriteAsset-'+index} onClick={handleImportAsset}>
                                            Import Asset
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card asset-search-result">
                <div className="title">
                    Favorite Assets
                </div>
                <table>
                        <thead>
                            <th>Symbol</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Region</th>
                            <th>Market Open</th>
                            <th>Market Close</th>
                            <th>Timezone</th>
                            <th>Currency</th>
                            <th></th>
                        </thead>
                        <tbody>
                            {userContext.favoriteAssets.map((asset, index) => (
                                <tr key="index">
                                    <td>{asset.symbol}</td>
                                    <td>{asset.name}</td>
                                    <td>{asset.type}</td>
                                    <td>{asset.region}</td>
                                    <td>{asset.marketOpen}</td>
                                    <td>{asset.marketClose}</td>
                                    <td>{asset.timezone}</td>
                                    <td>{asset.currency}</td>
                                    <td>
                                        <Button variant="outline-danger" id={'favoriteAsset-'+index} onClick={handleFavoritesRemove}>
                                            Remove Asset
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </div>
        </div>
    )
}

export default AssetSelectionPage;