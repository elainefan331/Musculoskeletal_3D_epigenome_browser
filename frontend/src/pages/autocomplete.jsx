import React, { useState, useEffect } from 'react';
import "./autocomplete.css"

const Autocomplete = ({ query, onSelect, setParentSuggestions }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query || query.length < 4) {
            setSuggestions([]);
            setParentSuggestions([]);  // Update parent state
            return;
        }
        

        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_EXPRESS_URL}/variants/autocomplete?query=${query}`);
                const data = await res.json();
                console.log(data)
                setSuggestions(data);
                setParentSuggestions(data);  // Update parent state

                if (data.length === 1) {
                    onSelect(data[0].name, data[0].category)
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const debounceFetch = setTimeout(fetchSuggestions, 300);

        return () => clearTimeout(debounceFetch);
    }, [query]);

    return (
        <div className="autocomplete-container">
            {loading && <div>Loading...</div>}
            <ul className="autocomplete-list">
                {suggestions.map((suggestion) => (
                    <li key={suggestion._id} onClick={() => onSelect(suggestion.name, suggestion.category)}>
                        {suggestion.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Autocomplete;
