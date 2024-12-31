import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";

const HomeAuthRoutes = () => {
    return (
        <Routes>
            <Route path="/:token" element={<Home />} />
        </Routes>

    )
}

export default HomeAuthRoutes