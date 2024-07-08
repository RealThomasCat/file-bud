import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate();

    const [loader, setLoader] = useState(true);

    const authStatus = useSelector((state) => state.user.user);

    useEffect(() => {
        if (authentication && !authStatus) {
            navigate("/login");
        } else if (!authentication && authStatus) {
            navigate("/home");
        } else {
            setLoader(false);
        }
    }, [authStatus, navigate, authentication]);

    // useEffect(() => {
    //     if (authentication && authStatus !== authentication) {
    //         navigate("/login"); // TODO: change this to landing page
    //     } else if (!authentication && authStatus !== authentication) {
    //         navigate("/home");
    //     }
    //     setLoader(false);
    // }, [authStatus, navigate, authentication]);

    return loader ? <h1>Loading...</h1> : <>{children}</>;
}
