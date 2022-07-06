import React, { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { InputButton, InputText, MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import './styles.css'

const OrdersPage = () => {

    const userContext = useContext(UserContext);

    const [asset, setAsset] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [date, setDate] = useState("");

    function handleAsset(event) {
        setAsset(event.target.value);
    }

    function handleQuantity(event) {
        setQuantity(event.target.value);
    }

    function handleDate(event) {
        setDate(event.target.value);
    }

    function handleCreateOrder(event) {
        financeDataApi.createOrder(asset, quantity, date, userContext.integrationToken).then((result) => {
            userContext.setMessages([...userContext.messages,{
                type: "success",
                value: "Order created successfully!"
            }]);
        }).catch((ex) => {
            userContext.setMessages([...userContext.messages,{
                type: "error",
                value: "Error: " + ex
            }]);
        }).finally(() => {
            reloadOrders();
        });
        
    }

    function reloadOrders() {
        financeDataApi.apiGet('/api/orders', {}, userContext.integrationToken).then((data) => {
            userContext.setOrders(data);
        });
    }

    function handleRemoveOrder(event) {
        let id = event.target.id.split("-")[1];
        financeDataApi.apiDelete('/api/orders', {
            id: id,
        }, userContext.integrationToken).then((data) => {
            userContext.setMessages([...userContext.messages,{
                type: "success",
                value: "Order deleted successfully!",
            }]);
        }).catch((ex) => {
            userContext.setMessages([...userContext.messages,{
                type: "error",
                value: "Error: " + ex
            }]);
        }).finally(() => {
            reloadOrders();
        })
    }

    return (
        <div className='control'>
            <MessageHolder/>
            <div className="title">
                Orders
            </div>
            <div className="card input-order">
                <Form.Label htmlFor="inputAsset">
                    Asset
                </Form.Label>
                <Form.Control
                    type="text"
                    id="inputAsset"
                    onChange={handleAsset}
                />
                <Form.Label htmlFor="inputQuantity">
                    Quantity
                </Form.Label>
                <Form.Control
                    type="text"
                    id="inputQuantity"
                    onChange={handleQuantity}
                />
                <Form.Label htmlFor="inputDate">
                    Date
                </Form.Label>
                <Form.Control
                    type="date"
                    id="inputDate"
                    onChange={handleDate}
                />
                <div className="orders-buttons">
                    <button onClick={handleCreateOrder}>
                        Create Orders
                    </button>
                    <button onClick={reloadOrders}>
                        Reload
                    </button>
                </div>
                
            </div>
            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Asset</th>
                            <th>Quantity</th>
                            <th>Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {userContext.orders.map((item, index) => (
                            <tr key={'asset-'+index}>
                                <td>{item.id}</td>
                                <td>{item.asset.symbol}</td>
                                <td>{item.quantity}</td>
                                <td>{item.date}</td>
                                <td>
                                    <Button id={'order-'+item.id} variant='danger' onClick={handleRemoveOrder}>
                                        Delete Order
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

export default OrdersPage;