import React, { useContext, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import { MessageHolder } from '../../components';

const SyncInvtoolsOrdersPage = () => {
    const userContext = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    function formatDateToISO(date) {
        // Format: 2025-11-14T00:00:00.0Z
        const d = new Date(date);
        return d.toISOString().replace('Z', '').replace(/\.\d{3}$/, '.0') + 'Z';
    }

    function getNextDay(date) {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        return d;
    }

    async function handleSync() {
        try {
            setLoading(true);
            const fromDate = formatDateToISO(userContext.date);
            const toDate = formatDateToISO(getNextDay(userContext.date));

            const data = await financeDataApi.syncInvtoolsOrders(fromDate, toDate, userContext.integrationToken);
            setResult(data);
            userContext.setMessages([...(userContext.messages || []), { type: 'success', value: 'Orders synced successfully' }]);
        } catch (err) {
            userContext.setMessages([...(userContext.messages || []), { type: 'error', value: err?.error || 'Error syncing orders' }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="control">
            <div className="title">Sync InvTools Orders</div>

            <div className={"card " + ( userContext.mobileSize() ? "value-header" : "" )}>
                <div className="value-section">
                    <div className="info-text">Date Range</div>
                    <div className="value-text">
                        {userContext.date} to {new Date(new Date(userContext.date).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    </div>
                </div>
                <div className="value-section">
                    <div className="info-text">Sync Action</div>
                    <div>
                        <Button onClick={handleSync} disabled={loading}>
                            {loading ? (<><Spinner animation="border" size="sm" /> Syncing</>) : 'Sync Orders'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="card vertical-align">
                <MessageHolder />
            </div>

            {result && (
                <>
                    <div className="card vertical-align">
                        <div className={"card " + ( userContext.mobileSize() ? "value-header" : "" )}>
                            <div className="value-section">
                                <div className="info-text">Created Orders</div>
                                <div className="value-text">{result.created_orders_count}</div>
                            </div>
                            <div className="value-section">
                                <div className="info-text">Failed Orders</div>
                                <div className="value-text">{result.failed_orders_count}</div>
                            </div>
                        </div>
                    </div>

                    {result.created_orders && result.created_orders.length > 0 && (
                        <div className="card vertical-align">
                            <div className="title">Created Orders</div>
                            <table className={ userContext.mobileSize() ? "small" : "" }>
                                <thead>
                                    <tr>
                                        <td>Asset</td>
                                        <td>Quantity</td>
                                        <td>Price</td>
                                        <td>Date</td>
                                        <td>Portfolio</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.created_orders.map((order, index) => (
                                        <tr key={index}>
                                            <td>{order.asset || 'N/A'}</td>
                                            <td>{order.quantity || 'N/A'}</td>
                                            <td>{order.price || 'N/A'}</td>
                                            <td>{order.date || 'N/A'}</td>
                                            <td>{order.portfolio_name || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {result.failed_orders && result.failed_orders.length > 0 && (
                        <div className="card vertical-align">
                            <div className="title">Failed Orders</div>
                            <table className={ userContext.mobileSize() ? "small" : "" }>
                                <thead>
                                    <tr>
                                        <td>Asset</td>
                                        <td>Quantity</td>
                                        <td>Price</td>
                                        <td>Date</td>
                                        <td>Error</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.failed_orders.map((order, index) => (
                                        <tr key={index}>
                                            <td>{order.asset || 'N/A'}</td>
                                            <td>{order.quantity || 'N/A'}</td>
                                            <td>{order.price || 'N/A'}</td>
                                            <td>{order.date || 'N/A'}</td>
                                            <td>{order.error || 'Unknown error'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default SyncInvtoolsOrdersPage;
