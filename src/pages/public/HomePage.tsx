import Header from "../public/common/Header";
import {Outlet} from "react-router-dom";
import Footer from "../public/common/Footer";

const HomePage = () => {
    return (
        <>
            <div>
                <Header/>
                <Outlet/>
                <Footer/>
            </div>
        </>
    )
}

export default HomePage;