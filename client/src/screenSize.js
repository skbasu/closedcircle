import { useState, useEffect } from "react";

const WindowSize = () => {
    const [size, setSize] = useState([window.innerWidth]);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setSize([window.innerWidth])
        })

        return () => {
            window.removeEventListener("resize", () => {
                setSize([window.innerWidth])
            })
        }
    }, []);

    return size;
}

export default WindowSize;