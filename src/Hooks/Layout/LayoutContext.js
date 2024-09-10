import React, { createContext, useContext, useState } from 'react'

const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext)


export const LayoutProvider = ({ children }) => {
    const [layout, setLayout] = useState("main")
    const value = {
        layout,
        setLayout
    }
    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    )
}

