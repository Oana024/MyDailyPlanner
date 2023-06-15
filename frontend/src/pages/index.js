import {useEffect, useState} from "react";
import image from '../images/home-background.jpg'
import {useWindowSize} from "./useWindowSize";

const Home = () => {
    const [width, height] = useWindowSize();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {

        let token = localStorage.getItem('jwt');

        if (token != null) {
            const tokenInfo = JSON.parse(atob(token.split(".")[1]));
            if (tokenInfo.exp * 1000 > Date.now()) {
                setIsAuth(true);
            }
        }
        console.log('Bearer ' + token);

    }, []);

    return (
        <div style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: height - 60,
            width: width - 17,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}>
            {
                isAuth ? (
                    <div>
                        <h1 style={{fontSize: "100px"}}>Welcome!</h1>
                    </div>
                ) : (
                    <div>
                        <a href="/sign-up" style={{fontSize: "70px", color: "black"}}>You can create your account
                            here</a>
                    </div>
                )
            }
        </div>
    )
}

export default Home;