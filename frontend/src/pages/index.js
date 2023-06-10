import {useEffect, useState} from "react";

const Home = () => {
    const [msg, setMsg] = useState("");
    const [mail, setMail] = useState("");
    useEffect(() => {
        let token = localStorage.getItem('jwt');
        console.log('Bearer ' + token);

        async function fetchData() {
            await fetch('http://localhost:2426/api/demo', {
                method: "GET",
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            }).then(async (response) => {
                if (response.status === 200) {
                    let message = await response.text();
                    setMsg(message)
                    setMail(localStorage.getItem('email'));
                    console.log(mail);
                    console.log(message);
                } else if (response.status === 403) {
                    setMsg("You need to log in");
                } else {
                    setMsg("Big problem");
                }
            }).catch((err) => {
                setMsg(err.message)
                console.log(err.message)
            });
        }

        fetchData();

    }, [msg, mail]);

    return (
        <h1>{msg}, {mail}</h1>
    )
}

export default Home;