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
        let selectedSymbol = event.target.id.split("-")[1];
        let asset = foundAssets.find((value) => {
            return value.symbol == selectedSymbol;
        });
        financeDataApi.getAssetData(asset.symbol, '', '', API_KEY).then((data) => {
            let assetData = data[0]
            let newFavoriteAssetArray = [...userContext.favoriteAssets, {
                ...asset,
                treynorIndex: assetData.treynor_index,
                beta: assetData.beta,
                return: assetData.rentability
            }]
            userContext.setFavoriteAssets(newFavoriteAssetArray);
            userContext.setCookies("favoriteAssets",JSON.stringify(newFavoriteAssetArray));
        });
    }

    function handleFavoritesRemove(event) {
        let selectedSymbol = event.target.id.split("-")[1];
        let filteredFavoriteAssets = userContext.favoriteAssets.filter((asset) => {
            return asset.symbol !== selectedSymbol;
        })
        userContext.setFavoriteAssets(filteredFavoriteAssets);
        userContext.setCookies("favoriteAssets",JSON.stringify(filteredFavoriteAssets));
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
        let selectedSymbol = event.target.id.split("-")[1];
        importAsset(selectedSymbol);
    }

    function handleImportAllAssets(event) {
        userContext.favoriteAssets.forEach((asset) => {
            importAsset(asset?.symbol)
        })
    }

    function importAsset(symbol) {
        financeDataApi.importAsset(symbol, API_KEY).then((data) => {
            financeDataApi.importAssetSeries(symbol, '2017-01-01',API_KEY).then((data) => {
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
                            <tr>
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
                            </tr>
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
                                        <Button variant="outline-primary" id={'searchAsset-'+asset.symbol} onClick={handleFavoritesAdd}>
                                            Add to Favorites
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="outline-primary" id={'favoriteAsset-'+asset.symbol} onClick={handleImportAsset}>
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
                <div className='horizontal-align'>
                    <div className="title">
                        Favorite Assets
                    </div>
                    <Button className="m-3" variant="outline-primary" onClick={handleImportAllAssets}>
                        Import All Favorite Assets
                    </Button>
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
                            <th></th>
                        </thead>
                        <tbody>
                            {userContext.favoriteAssets.map((asset, index) => (
                                <tr key={index}>
                                    <td>{asset.symbol}</td>
                                    <td>{asset.name}</td>
                                    <td>{asset.type}</td>
                                    <td>{asset.region}</td>
                                    <td>{asset.marketOpen}</td>
                                    <td>{asset.marketClose}</td>
                                    <td>{asset.timezone}</td>
                                    <td>{asset.currency}</td>
                                    <td>
                                        <Button variant="outline-danger" id={'favoriteAsset-'+asset.symbol} onClick={handleFavoritesRemove}>
                                            Remove Asset
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="outline-primary" id={'favoriteAsset-'+asset.symbol} onClick={handleImportAsset}>
                                            Import Asset
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