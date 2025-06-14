import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import financeDataApi from '../../utils/finance-data-api';
import UserContext from '../../context/UserContext';
import { MessageHolder } from '../../components';

const AssetValuationItem = () => {

    const [assetValuationQuery, setAssetValuationQuery] = useState({});
    const [assetValuationItems, setAssetValuationItems] = useState([]);
    const [refresh, setRefresh] = useState(true);

    const userContext = useContext(UserContext);

    function handleQueryChange(event) {
        let currentQuery = assetValuationQuery;
        currentQuery[event.target.name] = event.target.value;
        setAssetValuationQuery({ ...currentQuery });
    }

    function handleCreateItem() {
        financeDataApi.createAssetValuationItem(assetValuationQuery, userContext.integrationToken)
            .then(() => {
                setRefresh(true);
            }).catch((err) => {
                userContext.setMessages([
                    ...userContext.messages,
                    {
                        type: 'error',
                        value: err.error
                    }
                ]);
            });
    }

    function handleDelete(evt) {
        let id = evt.target.id;
        let item = assetValuationItems.find((item) => item?.asset?.id == id)
        financeDataApi.deleteAssetValuationItem(item.asset.symbol, userContext.integrationToken).then(() => {
            userContext.setMessages([
                ...userContext.messages,
                {
                    type: 'success',
                    value: 'Asset Valuation Item ' + id + ' successfully deleted!'
                }
            ]);
            setRefresh(true);
        }).catch((err) => {
            userContext.setMessages([
                ...userContext.messages,
                {
                    type: 'error',
                    value: 'Error deleting item: ' + id + '. ' + err?.error
                }
            ]);
        });
    }

    function handleEdit(evt) {
        let id = evt.target.id
        let item = assetValuationItems.find((item) => item?.asset?.id == id)
        setAssetValuationQuery({
            ...item,
            asset_symbol: item?.asset?.symbol,
        })
    }

    useEffect(() => {
        if (refresh) {
            financeDataApi.getAssetValuationItems(userContext.integrationToken).then((data) => {
                setAssetValuationItems(data);
                setRefresh(false);
            }).catch((err) => {
                userContext.setMessages([
                    ...userContext.messages,
                    {
                        type: 'error',
                        value: 'Error fetching asset valuation items. ' + err?.error
                    }
                ]);
            });
        }
    }, [refresh, userContext]);

    return (
        <div className='control'>
            <h1>Asset Valuation Items</h1>
                <div className='card horizontal-align'>
                    <Form className='d-flex'>
                        <div className='center'>
                            <div className='w-50'>
                                Asset Symbol
                            </div>
                            <FormControl className='me-2' name="asset_symbol" type='text' value={assetValuationQuery.asset_symbol || ''} onChange={handleQueryChange} />
                        </div>
                    </Form>
                    <Form className='d-flex'>
                        <div className='center'>
                            <div className='w-50'>
                                Last Quarter EPS
                            </div>
                            <FormControl className='me-2' name="last_quarter_eps" type='number' value={assetValuationQuery.last_quarter_eps || ''} onChange={handleQueryChange} />
                        </div>
                    </Form>
                    <Form className='d-flex'>
                        <div className='center'>
                            <div className='w-50'>
                                Average Payout Ratio
                            </div>
                            <FormControl className='me-2' name="average_payout_ratio" type='number' value={assetValuationQuery.average_payout_ratio || ''} onChange={handleQueryChange} />
                        </div>
                    </Form>
                    <Form className='d-flex'>
                        <div className='center'>
                            <div className='w-50'>
                                Expected Dividend Yield
                            </div>
                            <FormControl className='me-2' name="expected_dividend_yield" type='number' value={assetValuationQuery.expected_dividend_yield || ''} onChange={handleQueryChange} />
                        </div>
                    </Form>
                    <div className='center'>
                        <Button onClick={handleCreateItem}>Create</Button>
                    </div>
            </div>

            <MessageHolder />

            <table>
                <thead>
                    <tr>
                        <th>Asset ID</th>
                        <th>Last Quarter EPS</th>
                        <th>Average Payout Ratio</th>
                        <th>Expected Dividend Yield</th>
                        <th>Top Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assetValuationItems.map((item) => (
                        <tr key={item.asset?.id}>
                            <td>{item.asset?.symbol}</td>
                            <td>{item.last_quarter_eps}</td>
                            <td>{(item.average_payout_ratio * 100).format({ decimalPlaces: 2 })}%</td>
                            <td>{(item.expected_dividend_yield * 100).format({ decimalPlaces: 2 })}%</td>
                            <td>{(item.top_price || 0.0).format({ decimalPlaces: 2 })}</td>
                            <td>
                                <Button variant="outline-primary" id={item.asset?.id} onClick={handleEdit}>
                                    Edit
                                </Button>
                                <Button variant="outline-danger" id={item.asset?.id} onClick={handleDelete}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssetValuationItem;
