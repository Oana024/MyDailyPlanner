import {useState} from "react";

const Login = () => {
    const [email, emailChange] = useState("");
    const [password, passwordChange] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        let loginCredentials = {
            "email": email,
            "password": password,
        }

        await fetch('http://localhost:2426/api/auth/login', {
            method: "POST",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(loginCredentials)
        }).then(async (response) => {
            if (response.status === 200) {
                const token = await response.json();
                console.log(token.token)
                console.log(token.userId);
                localStorage.setItem("jwt", token.token);
                localStorage.setItem("userId", token.userId);
                localStorage.setItem("email", loginCredentials.email);
                window.location.href = "http://localhost:3000";
            } else {
                alert("Error");
            }
        }).catch((err) => {
            console.log(err.message());
        });
    }

    return (
        <div className="container">
            <div className="card text-center justify-content-center align-items-center">
                <div className="card-title">
                    <h2>Login</h2>
                </div>
                <div className="card-body">
                    <form className="book-form" onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input name="email" type="email" className="form-control"
                                   placeholder="Email" value={email}
                                   onChange={e => emailChange(e.target.value)}/>
                            <label>Email</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input name="password" type="password" className="form-control" placeholder="Password"
                                   value={password} onChange={e => passwordChange(e.target.value)}/>
                            <label>Password</label>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;