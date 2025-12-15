import React from "react"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Home(){
    const navigate = useNavigate();
    return (
    <div>
        <h2>
            Hi, Welcome to EventSphere.
        </h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur eveniet corrupti iste vero, cum quasi quae laudantium. Commodi ullam ex aliquam repellendus. Tenetur animi non dicta porro nesciunt? Sapiente, nihil!</p>
        <button onClick={()=> navigate("/register")}>Go to Register</button>
        <button onClick={()=> navigate("/login")}>Go to Login</button>
    </div>  
);
}


export default Home;