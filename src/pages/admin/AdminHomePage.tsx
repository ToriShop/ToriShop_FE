import Header from "./common/Header";
import { Outlet } from "react-router-dom";
import Footer from "./common/Footer";

const AdminHomePage = () => {
  return (
    <>
      <div>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default AdminHomePage;
