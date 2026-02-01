import React, { useContext, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { InputButton, InputText, MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import './styles.css'

const OrdersPage = () => {

    const userContext = useContext(UserContext);

    const [orderFormData, setOrderFormData] = useState({
        id: '',
        asset: '',
        quantity: 0,
        date: '',
        portfolioName: '',
        currency: '',
        price: 0
    });

    function handleFormData(key, value) {
        let currentFormData = {...orderFormData};
        currentFormData[key] = value;
        setOrderFormData({...currentFormData});
    }

    function handleId(event) {
        handleFormData('id', event.target.value);
    }

    function handleAsset(event) {
        handleFormData('asset',event.target.value);
    }

    function handleQuantity(event) {
        handleFormData('quantity',event.target.value);
    }

    function handleDate(event) {
        handleFormData('date',event.target.value);
    }

    function handlePortfolioName(event) {
        handleFormData('portfolioName',event.target.value);
    }

    function handleCurrency(event) {
        handleFormData('currency',event.target.value);
    }

    function handlePrice(event) {
        handleFormData('price',event.target.value);
    }

    function handleCreateOrder(event) {
        financeDataApi.createOrder(orderFormData.id, orderFormData.asset, orderFormData.quantity, orderFormData.price, orderFormData.date, orderFormData.portfolioName, orderFormData.currency, userContext.integrationToken).then((result) => {
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
        financeDataApi.apiGet('/api/orders', { date_for_year: userContext.date }, userContext.integrationToken).then((data) => {
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

    function handleEdit(event) {
        let orderId = event.target.id
        let selectedOrder = userContext.orders.find((orderItem, index) => (orderItem.id == orderId));
        setOrderFormData({
            id: selectedOrder.id,
            asset: selectedOrder.asset.external_id,
            quantity: selectedOrder.quantity,
            date: selectedOrder.date?.replace("T00:00:00.000Z",""),
            portfolioName: selectedOrder.financial_portfolio.name,
            currency: selectedOrder.financial_portfolio.currency.symbol,
            price: selectedOrder.price
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
                    Id
                </Form.Label>
                <Form.Control
                    type="text"
                    id="inputId"
                    onChange={handleId}
                    value={orderFormData.id}
                />
                <Form.Label htmlFor="inputAsset">
                    Asset
                </Form.Label>
                <Form.Control
                    type="text"
                    id="inputAsset"
                    onChange={handleAsset}
                    value={orderFormData.asset}
                />
                <Form.Label htmlFor="inputQuantity">
                    Quantity
                </Form.Label>
                <Form.Control
                    type="text"
                    id="inputQuantity"
                    onChange={handleQuantity}
                    value={orderFormData.quantity}
                />
                <Form.Label htmlFor="inputPrice">
                    Price
                </Form.Label>
                <Form.Control
                    type="text"
                    id="inputPrice"
                    onChange={handlePrice}
                    value={orderFormData.price}
                />
                <Form.Label htmlFor="inputDate">
                    Date
                </Form.Label>
                <Form.Control
                    type="date"
                    id="inputDate"
                    onChange={handleDate}
                    value={orderFormData.date}
                />
                <Form.Label htmlFor="inputPortfolio">
                    Portfolio name
                </Form.Label>
                <Form.Control
                    type="text"
                    id="inputPortfolio"
                    onChange={handlePortfolioName}
                    value={orderFormData.portfolioName}
                />
                <Form.Label htmlFor="inputCurrency">
                    Currency
                </Form.Label>
                <Form.Control
                    type="text"
                    id="inputCurrency"
                    onChange={handleCurrency}
                    value={orderFormData.currency}
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
                <table className={ userContext.mobileSize() && "small" }>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Asset</th>
                            <th>Quantity</th>
                            <th>Portfolio</th>
                            <th>Date</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {userContext.orders.map((item, index) => (
                            <tr key={'asset-'+index}>
                                <td>{item.id}</td>
                                <td>{item.asset.symbol}</td>
                                <td>{item.quantity}</td>
                                <td>{item.financial_portfolio?.name} - {item.financial_portfolio?.currency.symbol}</td>
                                <td>{item.date}</td>
                                <td>{item.price}</td>
                                <td>
                                    <Button id={item.id} variant='primary' onClick={handleEdit}>
                                        Edit
                                    </Button>
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