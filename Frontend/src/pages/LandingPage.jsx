import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, PrimaryButton } from "../components/index.js";
import { Link } from "react-router-dom";
import heroImage from "../assets/HeroImage.png";

function LandingPage() {
    return (
        <Container>
            <div className="flex justify-between items-center my-20">
                {/* Hero Content */}
                <div className="h-128 flex flex-col w-1/2 gap-8">
                    <h1 className="text-7xl uppercase font-bold text-textCol">
                        <span className="">Powerful</span>
                        <br />
                        Storage For
                        <br />
                        <span className="">Your Files</span>
                    </h1>

                    <div className="flex gap-8 text-2xl font-light uppercase">
                        <p className="text-primary">Store</p>
                        <p className="text-primary">Stream</p>
                        <p className="text-primary">Download</p>
                    </div>

                    <Link to="/home" className="h-12 rounded-full w-fit mt-3">
                        <PrimaryButton title="Start Using" />
                    </Link>
                </div>

                {/* Hero Image */}
                <div className="h-full flex justify-center items-center">
                    <img
                        className="h-96 pt-4 px-12"
                        src={heroImage}
                        alt="Hero Image"
                    />
                </div>
            </div>
        </Container>
    );
}

export default LandingPage;
