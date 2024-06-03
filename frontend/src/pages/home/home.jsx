import axios from 'axios';
import { useState } from 'react';
import "./home.css"


const Home = () => {
    const [text, setText] = useState("");
    let api_url = `/variants/${text}`;

    const search = async() => {
        console.log("hi")
        const res = await fetch(`http://localhost:5555${api_url}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        // const res = await axios.get(api_url)
        // let data = await res.data
        if(res.ok) {
            const data = await res.json();
            console.log("data", data)
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
                        placeholder=' search by rsID, Gene or Disease trait'
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
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