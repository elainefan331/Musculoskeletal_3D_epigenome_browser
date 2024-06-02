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
            <h1>Musculoskeletal 3D Epigenome Browser</h1>
            <div>Search</div>
            <input 
                placeholder='search for ...'
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button
                onClick={() => search()}
            >
                Search
            </button>
        </div>
    )
}

export default Home;