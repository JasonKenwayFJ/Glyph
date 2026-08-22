import "./AuthInput.css";

type AuthInputProps = {
    icon: React.ReactNode;
    type?: string;
    placeholder: string;
    onChange: (value: string) => void
};

const AuthInput = ({ icon, type = "text", placeholder, onChange }: AuthInputProps) => {
    return (
        <div className="AuthInputWrap">
            <span className="AuthInputIcon">{icon}</span>
            <input
                className="AuthInputField"
                type={type}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default AuthInput;