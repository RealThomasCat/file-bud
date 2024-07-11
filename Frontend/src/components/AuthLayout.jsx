import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.user.user);
    const loading = useSelector((state) => state.user.isLoading);

    useEffect(() => {
        if (!loading) {
            if (authentication && !authStatus) {
                navigate("/login");
            } else if (!authentication && authStatus) {
                navigate("/home");
            }
        }
    }, [authStatus, loading, navigate, authentication]);

    return loading ? <h1>Loading...</h1> : <>{children}</>;
}
