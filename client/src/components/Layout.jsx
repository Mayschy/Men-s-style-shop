import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <main
        style={{
          flexGrow: 1,
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
