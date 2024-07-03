import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "../components/index.js";

function LandingPage() {
    return (
        <Container>
            <h1 className="text-3xl text-white">Landing Page</h1>
        </Container>
    );
}

export default LandingPage;
