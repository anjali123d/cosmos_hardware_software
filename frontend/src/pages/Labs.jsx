// src/pages/Labs.js
import React, { useEffect, useState } from "react";
import API from "../services/api";

function Labs() {
    const [labs, setLabs] = useState([]);
    const [name, setName] = useState("");

    const fetchLabs = async () => {
        const res = await API.get("/labs");
        setLabs(res.data);
    };

    const addLab = async () => {
        await API.post("/labs", { name });
        setName("");
        fetchLabs();
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLabs();
    }, []);

    return (
        <div>
            <h2>Labs</h2>

            <input
                placeholder="Lab Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={addLab}>Add</button>

            <ul>
                {labs.map((lab) => (
                    <li key={lab._id}>{lab.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Labs;