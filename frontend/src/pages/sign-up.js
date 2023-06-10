import {useState} from "react";

const SignUp = () => {
    const [firstname, firstnameChange] = useState("");
    const [lastname, lastnameChange] = useState("");
    const [email, emailChange] = useState("");
    const [password, passwordChange] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        let user = {
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "password": password,
        }

        await fetch('http://localhost:2426/api/auth/register', {
           method: "POST",
           headers: {'content-type': 'application/json'},
           body: JSON.stringify(user)
        }).then(async (response) => {
            if (response.status === 200) {
                const token = await response.json();
                console.log(token.token);
                console.log(token.userId);
                localStorage.setItem("jwt", token.token);
                localStorage.setItem("userId", token.userId);
                localStorage.setItem("email", user.email);
                window.location.href = "http://localhost:3000";
            } else {
                alert("Error");
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }

    return (
        <div className="container">
            <div className="card text-center justify-content-center align-items-center">
                <div className="card-title">
                    <h2>Create Account</h2>
                </div>
                <div className="card-body">
                    <form className="book-form" onSubmit={handleSubmit}>
                        <div className="form-floating mb-3">
                            <input type="text" name="firstname" className="form-control" placeholder="First Name"
                                   value={firstname} onChange={e => firstnameChange(e.target.value)}/>
                            <label>First Name</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input name="lastname" type="text" className="form-control" placeholder="Last Name"
                                   value={lastname} onChange={e => lastnameChange(e.target.value)}/>
                            <label>Last Name</label>
                        </div>
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

export default SignUp;