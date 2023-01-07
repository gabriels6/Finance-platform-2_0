import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';

const CrudPage = ({model = "", fields = {}}) => {

    const [reloaded, setReloaded] = useState(false);
    const userContext = useContext(UserContext);

    const [item, setItem] = useState({
        ...fields
    });

    const [existingItems, setExistingItems] = useState([]);

    useEffect(() => {
        if(!reloaded) {
            setReloaded(true);
            financeDataApi.apiGet("/api/"+model,{},userContext.integrationToken).then((data) => {
                setExistingItems([...data]);
            });
        }
    })

    function handleChangeitem(event) {
        let valueKey = event.target.id?.replace("input","")?.toLowerCase();
        let currentitem = item;
        currentitem[valueKey] = event.target.value
        setItem({
            ...currentitem,
        });
    }

    function handleSave(event) {
        financeDataApi.apiPost("/api/"+model, item, userContext.integrationToken).then((data) => {
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

    function handleDeleteAsset(event) {
        let id = event.target.id;
        financeDataApi.apiDelete("/api/"+model,{
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

    function handleEdit(event) {
        let assetId = event.target.id
        let selectedAsset = existingItems.find((item, index) => ((item.id || item._id?.$oid) == assetId));
        setItem(Object.fromEntries(Object.entries(selectedAsset).map((value, index) => [value[0], value[1] || ""])))
    }

    return (
        <div className='control'>
            <MessageHolder/>
            <div className="card asset-header">
                <div>
                    {model.replace("_"," ")?.toUpperCase()}
                </div>
                <div className="asset-form">
                    {
                        Object.entries(item).map((value, index) => (
                            <>
                                <Form.Label htmlFor={"input"+value[0]}>
                                    {value[0]}
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    id={"input"+value[0]}
                                    onChange={handleChangeitem}
                                    value={value[1]}
                                />
                            </>
                        ))
                    }
                    <div className="assets-buttons">
                        <Button variant='outline-primary' onClick={handleSave}>
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
                                {Object.keys(fields).map((field, index) => (
                                    <td>{field.replaceAll("_"," ")?.toUpperCase()}</td>
                                ))}
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { existingItems.map((item,index) => {
                                return (
                                    <tr key={'asset-item-'+index}>
                                        {Object.keys(fields).map((field, fieldIndex) => (
                                            <td key={index+fieldIndex}>{item[field]}</td>
                                        ))}
                                        <td>
                                            <Button variant="outline-primary" id={item.id || item._id.$oid} onClick={handleEdit}>
                                                Edit
                                            </Button>
                                        </td>
                                        <td>
                                            <Button variant="outline-danger" id={item.id || item._id.$oid} onClick={handleDeleteAsset}>
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

export default CrudPage;