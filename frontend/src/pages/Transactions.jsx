// src/pages/Transactions.js
import React, { useEffect, useState } from "react";
import API from "../services/api";

function Transactions() {
    const [items, setItems] = useState([]);
    const [labs, setLabs] = useState([]);
    const [itemId, setItemId] = useState("");
    const [labId, setLabId] = useState("");
    const [quantity, setQuantity] = useState("");

    useEffect(() => {

        // eslint-disable-next-line react-hooks/immutability
        fetchData();
    }, []);

    const fetchData = async () => {
        const itemRes = await API.get("/items");
        const labRes = await API.get("/labs");

        setItems(itemRes.data);
        setLabs(labRes.data);
    };

    const issueItem = async () => {
        await API.post("/transactions/issue", {
            itemId,
            labId,
            quantity
        });
        alert("Item Issued");
    };

    const returnItem = async () => {
        await API.post("/transactions/return", {
            itemId,
            labId,
            quantity
        });
        alert("Item Returned");
    };

    return (
        <div>
            <h2>Issue / Return</h2>

            <select onChange={(e) => setItemId(e.target.value)}>
                <option>Select Item</option>
                {items.map((i) => (
                    <option value={i._id} key={i._id}>
                        {i.name}
                    </option>
                ))}
            </select>

            <select onChange={(e) => setLabId(e.target.value)}>
                <option>Select Lab</option>
                {labs.map((l) => (
                    <option value={l._id} key={l._id}>
                        {l.name}
                    </option>
                ))}
            </select>

            <input
                placeholder="Quantity"
                onChange={(e) => setQuantity(e.target.value)}
            />

            <button onClick={issueItem}>Issue</button>
            <button onClick={returnItem}>Return</button>
        </div>
    );
}

export default Transactions;