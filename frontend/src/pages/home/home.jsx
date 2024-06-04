import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./home.css"


const Home = () => {
    // console.log("vite info:", import.meta.env.VITE_EXPRESS_URL);
    const [text, setText] = useState("");
    const [celltype, setCelltype] = useState("");

    const navigate = useNavigate();
    let api_url = `/variants/${text}`;
    let ui_url = `/variants/${text}?celltype=${celltype}`

    const search = async() => {
        const res = await fetch(`${import.meta.env.VITE_EXPRESS_URL}${api_url}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if(res.ok) {
            const data = await res.json();
            console.log("data", data);
            navigate(ui_url)
        }
    }

    

    return (
        <div>
            <section className='home-page-section'>
                <h1 className='home-page-h1'>Musculoskeletal 3D Epigenome Browser</h1>
                <div>
                    <img className='dna-img' src='/dna_whitesmoke_background.png' />
                </div>
                <div className='home-page-search-container'>
                    <input className='search-input'
                        placeholder='Search by rsID, Gene or Disease trait'
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <select className='home-page-select-container' defaultValue="" onChange={(e) => setCelltype(e.target.value)}>
                        <option value="" disabled hidden>Select Cell-Type</option>
                        <option value="hMSC">hMSC</option>
                        <option value="Osteoblast">Osteoblast</option>
                        <option value="Osteocyte">Osteocyte</option>
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