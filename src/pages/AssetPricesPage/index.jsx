import React, { useContext } from 'react';
import { useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';

const AssetPricesPage = () => {

    const userContext = useContext(UserContext);
    const [assetPriceQuery, setAssetPriceQuery] = useState({
        symbol: "",
        startDate: userContext.date,
        endDate: userContext.date
    });

    const [assetPrices, setAssetPrices] = useState([]);

    function handleAssetQuery(event) {
        let currAssetPriceQuery = assetPriceQuery;
        currAssetPriceQuery[event.target.name] = event.target.value;
        setAssetPriceQuery({...currAssetPriceQuery});
    }

    function handleRefresh(event) {
        financeDataApi.getAssetPriceHist(assetPriceQuery?.symbol, assetPriceQuery.startDate, assetPriceQuery.endDate, userContext.integrationToken).then((data) => {
            setAssetPrices([...data]);
        });
    }

    return (
        <div className='control'>
            <div className='card horizontal-align'>
                <div className='title'>
                    Asset Prices
                </div>
                <div className="value-section">
                    <div className="info-text">
                        Prices
                    </div>
                    <div className="value-text">
                        {assetPrices.length}
                    </div>
                </div>
                <Form className="d-flex">
                    <div className='center'>
                        <div className='w-50'>
                            Symbol
                        </div>
                        <FormControl className="me-2" name="symbol" type="text" value={assetPriceQuery.symbol} onChange={handleAssetQuery} />
                    </div>
                    <div className='center'>
                        <div className='w-50'>
                            Start Date
                        </div>
                        <FormControl placeholder="Start Date" className="me-2" name="startDate" type="date" value={assetPriceQuery.startDate} onChange={handleAssetQuery} />
                    </div>
                    <div className='center'>
                        <div className='w-50'>
                            End Date
                        </div>   
                        <FormControl placeholder="End Date" className="me-2" name="endDate" type="date" value={assetPriceQuery.endDate} onChange={handleAssetQuery} />
                    </div>
                </Form>
                <div className='center'>
                    <Button variant="outline-primary" onClick={handleRefresh}>
                        Refresh Values
                    </Button>
                </div>
            </div>
            <div className='card vertical-align'>
                <table>
                    <thead>
                        <th>Id</th>
                        <th>Asset</th>
                        <th>Date</th>
                        <th>Currency</th>
                        <th>Price</th>
                        <th>Rentability from Initial Date</th>
                    </thead>
                    <tbody>
                        {assetPrices.map((value, index) => (
                            <tr key={index}>
                                <td>{value.id?.$oid}</td>
                                <td>{value.asset?.symbol}</td>
                                <td>{value.date}</td>
                                <td>{value.currency?.symbol}</td>
                                <td>{value.price}</td>
                                <td>{Math.round((value.rentability || 0) * 10000)/100}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AssetPricesPage;