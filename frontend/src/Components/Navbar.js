import React from 'react';
import '../App.css'
import logo from '../img/logo.svg';
import { Link } from 'react-router-dom';
const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset"
  ];

function Navbar() {
    return (

        <div className="navbar">
            <div className="flex-1">
            <Link to="/" className='btn btn-ghost text-2xl font-bold'> Jarvis AI</Link>
            </div>
            <div className="flex-none mr-10 font-bold">
                <Link to="/infra">Infra</Link>
            </div>

            <select className="select mr-10" data-choose-theme>
                    <option disabled selected>Theme</option>
                    {themes.map((theme, index) => (
                        <option key={index} value={theme}>{theme}</option>
                    ))}
                </select>
        </div>
    );
}

export default Navbar;
