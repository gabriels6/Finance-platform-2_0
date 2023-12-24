import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import './styles.css';
import logo from '../../finance_logo.png'
import { InputButton, InputText, MessageHolder } from '../../components';
import { useNavigate } from 'react-router';
import userApi from '../../utils/user-api';

const LoginPage = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (userContext.showHeader) hideHeader();
        if (userContext.cookies.token != null) {
            userContext.setToken(userContext.cookies.token);
            userContext.setUser(userContext.cookies.user);
            navigate('/home');
            return;
        }
    })

    const userContext = useContext(UserContext);

    function enableHeader() {
        userContext.setShowHeader(true);
    }

    function hideHeader() {
        userContext.setShowHeader(false);
    }

    function signIn() {
        userApi.authUser(username, password).then((data) => {
            userContext.setUser(data.name);
            userContext.setToken(data.token);
            userContext.setCookies("user",data.name);
            userContext.setCookies("token",data.token);
            userContext.setCookies("integrationToken",data.integration_token);
            navigate('/home');
        }).catch((err) => {
            let messages = [...userContext.messages]
            messages.push({
                type:"error",
                value: err.message
            });
            userContext.setMessages(messages);
        });
    }

    function handleUsername(event) {
        setUsername(event.target.value)
    }

    function handlePassword(event) {
        setPassword(event.target.value);
    }

    return (
        <div className="main">
            <div className={'login-wrapper' + ( userContext.mobileSize() ? "-mobile" : "" )}>
                <div className='login-img'>
                    <div>
                        <img
                            alt=""
                            src={logo}
                            width="334"
                            height="134"
                            className="d-inline-block align-top"
                        />{' '}
                    </div>
                </div>
                <div className='login-form'>
                    <MessageHolder/>
                    <InputText type="text" label="Username" placeholder="Type your username..." onChange={handleUsername}  marginBottom={58}/>
                    <InputText type="password" label="Password" placeholder="Type your password..." onChange={handlePassword}/>
                    <div className='login-space'/>
                    <InputButton label="Sign in" onClick={signIn} marginTop={58}/>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;