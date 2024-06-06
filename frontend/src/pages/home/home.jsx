import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '../autocomplete';
import "./home.css"


const Home = () => {
    const [text, setText] = useState("");
    const [celltype, setCelltype] = useState("");
    const [prompt, setPrompt] = useState("");
    const navigate = useNavigate();
    
    let ui_url = `/variants/${text}?celltype=${celltype}`

    const search = () => {
        if(celltype === "") {
            setPrompt("Please select a cell type")
        } else {
            setPrompt("")
            navigate(ui_url)
        }
    }

    const handleSelect = (value) => {
        setText(value)
    }

    

    return (
        <div>
            <section className='home-page-section'>
                <h1 className='home-page-h1'>Musculoskeletal 3D Epigenome Browser</h1>
                <div>
                    <img className='dna-img' src='/dna_whitesmoke_background.png' />
                </div>
                <div>
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
                    <button
                        className='home-page-search-button' 
                        onClick={() => search()}
                    >
                        Search
                    </button>
                </div>
                {prompt && <div className='prompt-message'>{prompt}</div>}
                <Autocomplete query={text} onSelect={handleSelect}/>
                </div>
            </section>
        </div>
    )
}

export default Home;