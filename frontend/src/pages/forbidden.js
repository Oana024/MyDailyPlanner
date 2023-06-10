import "../css/forbidden.css"
import {useWindowSize} from "./useWindowSize";
const Forbidden = () => {
    const [width, height] = useWindowSize();
    return (
            <div className="content" style={{minHeight: height, minWidth: width}}>
                <h1 className="h403">403</h1>
                <h2>Access forbidden! Please authenticate!</h2>
            </div>
    )
}

export default Forbidden;