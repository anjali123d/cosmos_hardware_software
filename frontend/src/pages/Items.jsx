// src/pages/Items.js
import React, { useEffect, useState } from "react";
import API from "../services/api";

function Items() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");

    const fetchItems = async () => {
        const res = await API.get("/items");
        setItems(res.data);
    };

    const addItem = async () => {
        await API.post("/items", { name, quantity });
        setName("");
        setQuantity("");
        fetchItems();
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchItems();
    }, []);

    return (
        <div>
            <h2>Items</h2>

            <input
                placeholder="Item Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
            />
            <button onClick={addItem}>Add</button>

            <ul>
                {items.map((item) => (
                    <li key={item._id}>
                        {item.name} - {item.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Items;