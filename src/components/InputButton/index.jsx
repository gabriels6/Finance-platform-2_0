import React from 'react';
import './styles.css'

const InputButton = ({ onClick = () => {}, label = "Insert", marginTop = 0, marginBottom = 0}) => {

    return (
        <div className='button-main' style={{
            marginTop: marginTop,
            marginBottom: marginBottom
        }}>
            <button onClick={onClick}>
                {label}
            </button>
        </div>
    );

}

export default InputButton;