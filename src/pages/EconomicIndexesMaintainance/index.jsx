import React, { useContext, useEffect, useState } from 'react';
import { MessageHolder } from '../../components';
import financeDataApi from '../../utils/finance-data-api';
import UserContext from '../../context/UserContext';
import { Button, Form } from 'react-bootstrap';

const EconomicIndexesMaintainance = () => {

    const [reloaded, setReloaded] = useState(false);
    const [economicIndexes, setEconomicIndexes] = useState([])
    const userContext = useContext(UserContext);

    const [economicIndexItem, setEconomicIndexItem] = useState({
        id: '',
        symbol: '',
        country: ''
    });

    useEffect(() => {
        if(!reloaded) {
            setReloaded(true);
            financeDataApi.getEconomicIndexes({}, userContext.integrationToken).then((assetData) => {
                setEconomicIndexes([...assetData])
            });
        }
    })

    function handleChangeEconomicIndexItem(event) {
        let valueKey = event.target.id?.replace("input","")?.toLowerCase();
        let currentEconomicIndexItem = economicIndexItem;
        currentEconomicIndexItem[valueKey] = event.target.value
        setEconomicIndexItem({
            ...currentEconomicIndexItem,
        });
    }

    function handleSaveEconomicIndex(event) {
        financeDataApi.saveEconomicIndex(economicIndexItem, userContext.integrationToken).then((data) => {
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

    function handleEdit(event) {
        let economicIndexId = event.target.id
        let selectedEconomicIndex = economicIndexes.find((economicIndexItem, index) => (economicIndexItem.id == economicIndexId));
        setEconomicIndexItem({
            id: selectedEconomicIndex.id,
            symbol: selectedEconomicIndex.symbol,
            country: selectedEconomicIndex.country?.name
        })
    }

    function handleImportSeries(event){
        let indexId = event.target.id
        let selectedIndex = economicIndexes.find((indexItem, index) => (indexItem.id == indexId));
        console.log(selectedIndex)
        financeDataApi.importEconomicIndexSeries({ symbol: selectedIndex?.symbol }, userContext.integrationToken).then((data) => {
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

    return (
        <div className='control'>
            <MessageHolder/>
            <div className='card asset-header'>
                <div>Economic Indexes</div>
                <div className="asset-form">
                    <Form.Label htmlFor="inputId">
                        Id
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputId"
                        onChange={handleChangeEconomicIndexItem}
                        value={economicIndexItem.id}
                    />
                    <Form.Label htmlFor="inputSymbol">
                        Symbol
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputSymbol"
                        onChange={handleChangeEconomicIndexItem}
                        value={economicIndexItem.symbol}
                    />
                    <Form.Label htmlFor="inputCountry">
                        Country
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="inputCountry"
                        onChange={handleChangeEconomicIndexItem}
                        value={economicIndexItem.country}
                    />
                    <div className="assets-buttons">
                        <Button variant='outline-primary' onClick={handleSaveEconomicIndex}>
                            Create Asset
                        </Button>
                        <Button variant='outline-primary' onClick={() => { setReloaded(false); }}>
                            Reload
                        </Button>
                    </div>
                </div>
            </div>
            <div className='card asset-list'>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Symbol</th>
                                <th>Country</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { economicIndexes.map((economicIndex, index) => {
                                return (
                                    <tr key={'economic-item-'+index}>
                                        <td>{economicIndex.id}</td>
                                        <td>{economicIndex.symbol}</td>
                                        <td>{economicIndex.country?.name}</td>
                                        <td>
                                            <Button variant="outline-primary" id={economicIndex.id} onClick={handleImportSeries}>
                                                Import Series
                                            </Button>
                                        </td>
                                        <td>
                                            <Button variant="outline-primary" id={economicIndex.id} onClick={handleEdit}>
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            }) }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default EconomicIndexesMaintainance;