import React, { useContext, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import UserContext from '../../context/UserContext';
import financeDataApi from '../../utils/finance-data-api';
import './styles.css';

const MonthlyAssetPrices = () => {
    const userContext = useContext(UserContext);
    const API_KEY = userContext.integrationToken;
    const [prices, setPrices] = useState([]);
    const [symbol, setSymbol] = useState('');

    const fetchPrices = () => {
        const startOfMonth = new Date(userContext.date);
        startOfMonth.setDate(1);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);

        financeDataApi.getAssetPriceHist(
            symbol,
            startOfMonth.toISOString().split('T')[0],
            endOfMonth.toISOString().split('T')[0],
            'USD',
            API_KEY
        ).then((data) => {
            setPrices(data);
        });
    };

    const renderCalendar = () => {
        const startOfMonth = new Date(userContext.date);
        startOfMonth.setDate(1);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);

        const daysInMonth = endOfMonth.getDate();
        const firstDay = startOfMonth.getDay();

        const calendar = [];
        let week = [];

        // Fill initial empty days
        for (let i = 0; i < firstDay; i++) {
            week.push(<td key={`empty-${i}`}></td>);
        }

        // Fill days with prices
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(startOfMonth);
            date.setDate(day);
            const priceData = prices.find(p => {
                const priceDate = new Date(p.date);
                priceDate.setDate(priceDate.getDate() + 1); // Adjusting the date to match the correct day
                return priceDate.toISOString().split('T')[0] === date.toISOString().split('T')[0];
            });
            week.push(
                <td key={day}>
                    <div>{day}</div>
                    <div>{priceData ? `${(priceData.price * 1.0).format({ decimalPlaces: 2, currency: priceData.currency.symbol })}` : ''}</div>
                </td>
            );

            if (week.length === 7 || day === daysInMonth) {
                calendar.push(<tr key={`week-${calendar.length}`}>{week}</tr>);
                week = [];
            }
        }

        return calendar;
    };

    return (
        <div className="control">
            <div className="card header-monthly-asset-prices">
                <div className="title">Monthly Asset Prices</div>
                <div className='horizontal-align'>
                    <input
                        type="text"
                        placeholder="Enter Asset Symbol"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                    />
                    <Button onClick={fetchPrices}>Fetch Prices</Button>
                </div>
            </div>
            {prices.length > 0 && (
                <div className="card">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Sun</th>
                                <th>Mon</th>
                                <th>Tue</th>
                                <th>Wed</th>
                                <th>Thu</th>
                                <th>Fri</th>
                                <th>Sat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderCalendar()}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default MonthlyAssetPrices;