
import './styles.css'

const InputText = ({ type, value, placeholder, label, marginBottom = 0, onChange }) => {
    return (
        <div className="input-main" style={{
            marginBottom: marginBottom
        }}>
            <label htmlFor="input-text">
                {label}
            </label>
            <input id="input-text" type={type} onChange={onChange} placeholder={placeholder} value={value}/>
        </div>
    );
}

export default InputText;