import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./home.css"


const Home = () => {
    const [text, setText] = useState("");
    const navigate = useNavigate();
    let api_url = `/variants/${text}`;

    const search = async() => {
        const res = await fetch(`http://localhost:5555${api_url}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if(res.ok) {
            const data = await res.json();
            console.log("data", data);
            navigate(api_url)
        }
    }

    return (
        <div>
            <section className='home-page-section'>
                <h1 className='home-page-h1'>Musculoskeletal 3D Epigenome Browser</h1>
                <div>
                    <img className='dna-img'src='../public/dna_whitesmoke_background.png' />
                </div>
                <div className='home-page-search-container'>
                    <input className='search-input'
                        placeholder='Search by rsID, Gene or Disease trait'
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <select className='home-page-select-container' defaultValue="">
                        <option value="" disabled hidden>Select Cell-Type</option>
                        <option value="a">a</option>
                        <option value="b">b</option>
                        <option value="c">c</option>
                    </select>
                    <button className='home-page-search-button'
                        onClick={() => search()}
                    >
                        Search
                    </button>
                </div>

            </section>
        </div>
    )
}

export default Home;