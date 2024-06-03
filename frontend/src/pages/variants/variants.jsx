import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Variants = () => {
    const { Id } = useParams();
    const[data, setData] = useState(null);
    console.log('Id============', Id)

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`http://localhost:5555/variants/${Id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            if(res.ok) {
                const result = await res.json();
                setData(result);
                console.log("result", result);
            } else {
                console.log(res.status)
            }
        }
        fetchData();
    }, [Id])

    return (
        <div>
            <h1>hello, variants</h1>
            {data?.map((variant) => {
                return (
                    <p key={variant._id}>{variant._id}</p>
                )
            })}
        </div>
    )
}

export default Variants;