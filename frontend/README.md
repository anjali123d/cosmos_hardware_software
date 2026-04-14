# Hardware Stock Management - Frontend

## Setup

1. **Install dependencies**
   ```bash
   npm install
Start the development server

bash
npm start
Backend URL
The frontend is configured to use: https://cosmos-hardware-software.onrender.com/api
(Change in src/services/api.js if needed)

Features
Dashboard – summary cards, low stock alerts, recent transactions.

Items / Stock – add new items, issue to labs, return from labs, restock using "Central Store" lab.

Labs – add labs, view each lab's current inventory (calculated from transaction history).

Transactions – full history of all issues and returns.

Notes
The "Restock" button creates a special lab called Central Store (if missing) and uses a return transaction to increase main stock.

Lab inventory is computed on the fly from all transactions.

text

---

## ✅ How to Run

1. Create a new folder `frontend`.
2. Copy all the files above into the correct structure.
3. Run `npm install` then `npm start`.
4. Your frontend will be available at `http://localhost:3000`.

The frontend is fully functional and communicates with your live backend. Enjoy managing your hardware stock!
