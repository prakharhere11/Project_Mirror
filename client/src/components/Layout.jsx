import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
    return (
        <>
            <Navbar />

            <main
                style={{
                    maxWidth: "1000px",
                    margin: "0 auto",
                    padding: "20px",
                }}
            >
                <Outlet />
            </main>
        </>
    );
}

export default Layout;