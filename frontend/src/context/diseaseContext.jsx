import { useState, useContext, createContext } from "react";

export const DiseaseContext = createContext();
export const useDisease = () => useContext(DiseaseContext);

export default function DiseaseProvider({children}) {
    const [disease, setDisease] = useState(null);

    return (
        <DiseaseContext.Provider
            value={{
                disease,
                setDisease
            }}
        >
            {children}
        </DiseaseContext.Provider>
    )
}