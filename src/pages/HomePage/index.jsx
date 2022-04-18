import React, { useContext, useEffect } from 'react';
import { MessageHolder } from '../../components';
import UserContext from '../../context/UserContext';

const HomePage = () => {

    const userContext = useContext(UserContext);

    useEffect(() => {
        if (userContext.showHeader == false) userContext.setShowHeader(true);
    });

    return (
        <>
            <MessageHolder/>
        </>
    )

}

export default HomePage;