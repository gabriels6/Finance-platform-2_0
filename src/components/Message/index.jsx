import './styles.css';

const Message = ({ type, value, onClick }) => {

    return (
        <div className={"message message-" + type} id={value} onClick={onClick}>
            {value}
        </div>
    )
}

export default Message;