# E-Commerce App

Production-ready, minimal full-stack e-commerce demo with:
- Backend: Node.js + Express, PostgreSQL (orders/users), MongoDB Atlas (products), JWT auth (bcrypt), role-based access.
- Frontend: Next.js App Router, server-side product listing with **server-controlled sort override**.
- Deployments: Vercel (frontend) + Render (backend).

> **Repository (public):** https://github.com/xuniquepatel/unique_patel_202411013  
> **Frontend (public URL):** https://unique-patel-202411013.vercel.app  
> **Backend (API base):** https://unique-patel-202411013.onrender.com

---

## 1) Overview & Key Features

- Authentication: Register/Login, JWT (Bearer), passwords hashed with bcrypt.
- Roles: `admin` and `customer`; admin-only product CRUD and reports.
- Products: stored in MongoDB; search, category filter, pagination; default **price DESC**.
- **Evaluator override:** when request carries `X-Eval-Sort: asc`, products are returned **price ASC** (server-side).
- Cart & Checkout: totals computed **on the server**; orders + order_items stored in PostgreSQL.
- Reports:
  - SQL: Daily revenue (`SUM(total)` grouped by date)
  - Mongo: Category aggregation (count and sumPrice)
- Input validation, pagination, CORS, env-based configuration.
- One-step deploys on Vercel (frontend) and Render (backend).

---

## 2) Tech Stack & Dependencies

**Backend**
- Node.js, Express
- PostgreSQL (`pg`)
- MongoDB Atlas (`mongodb@6.x`)
- JWT (`jsonwebtoken`), bcrypt (`bcryptjs`)
- Jest + Supertest (tests)

**Frontend**
- Next.js 14 (App Router)
- React 18

---

## 3) Project Structure

```
unique_patel_202411013/
  backend/
    config/        # env + DB clients
    controllers/   # route handlers
    middleware/    # auth, roles, validation
    models/        # SQL and Mongo data access
    routes/        # express routers
    tests/         # jest + supertest
    server.js
    package.json
  frontend/
    app/           # Next.js routes
    components/
    lib/
    next.config.js
    tsconfig.json
    package.json
  .gitignore
  README.md
```

---

## 4) Environment Variables

Create `backend/.env` 

| Key            | Notes                                                    |
|----------------|----------------------------------------------------------|
| `PORT`         | API port (Render will set its own in production)         |
| `JWT_SECRET`   | Required                                                 |
| `SQL_URL`      | URL-encode special chars in password                     |
| `MONGO_URL`    | Use Atlas “Drivers → Node.js” string, password encoded   |
| `CORS_ORIGIN`  | Frontend origin (set to Vercel URL in prod)              |

Create Vercel env in `frontend`:

| Key                    | Example                                              | Notes             |
|------------------------|------------------------------------------------------|-------------------|
| `NEXT_PUBLIC_API_BASE` | `http://localhost:8080` or your Render API base URL  | Public at runtime |

> **URL-encoding:** `@`→`%40`, `#`→`%23`, `&`→`%26`, spaces→`%20`, `:`→`%3A`, `/`→`%2F`.

---

## 5) Database Configuration & Migrations

### PostgreSQL (Orders & Users)

Create DB `ecom` locally (Windows example via SQL Shell/psql):
```sql
CREATE DATABASE ecom;
```

Tables are auto-created on server start, but for reference:

```sql
CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passwordhash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  createdat TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS orders(
  id SERIAL PRIMARY KEY,
  userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total NUMERIC(10,2) NOT NULL,
  createdat TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS order_items(
  id SERIAL PRIMARY KEY,
  orderid INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  productid TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  priceatpurchase NUMERIC(10,2) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_userid_createdat ON orders(userid,createdat);
CREATE INDEX IF NOT EXISTS idx_order_items_orderid ON order_items(orderid);
```

### MongoDB Atlas (Products)

- Create free cluster (M0), user, and allow your IP (or 0.0.0.0/0 while testing).
- DB name: `ecomdb`
- Collection: `products`
- Indexes are created by the backend on boot: `sku` (unique), `category`, `updatedAt`.

**Seed sample products (via Atlas UI → Insert Document):**
```json
{ "_id": "p1", "sku": "SKU1", "name": "Alpha Chair", "price": 99,  "category": "Furniture", "updatedAt": { "$date": "2025-01-01T00:00:00Z" } }
{ "_id": "p2", "sku": "SKU2", "name": "Beta Lamp",   "price": 49,  "category": "Lighting",  "updatedAt": { "$date": "2025-01-01T00:00:00Z" } }
{ "_id": "p3", "sku": "SKU3", "name": "Gamma Desk",   "price": 149, "category": "Furniture", "updatedAt": { "$date": "2025-01-01T00:00:00Z" } }
```

---

## 6) Local Development

### Backend
```bash
cd backend
npm i
npm run dev
# Health check:
# http://localhost:8080/health  -> { "ok": true }
```

### Frontend
```bash
cd frontend
npm i
# for local dev:
# PowerShell: $env:NEXT_PUBLIC_API_BASE="http://localhost:8080"
# bash/cmd: export NEXT_PUBLIC_API_BASE="http://localhost:8080"
npm run dev
# http://localhost:3000/products
```

---

## 7) Testing Instructions (Backend)

```bash
cd backend
npm test
```

Included test: verifies **product default sort (DESC)** and **override (ASC)** via header `X-Eval-Sort: asc`.

---

## 8) Frontend Route Summary (Next.js)

- `/` — Home
- `/register` — Register
- `/login` — Login
- `/products` — Product listing (server fetch)
  - Optional query `?evalSort=asc` to forward server override header
- `/cart` — Client cart + server preview/checkout
- `/orders` — User orders (basic)
- `/reports` — Admin reports (basic tables)

**Frontend base URL (prod):** `https://unique-patel-202411013.vercel.app`

---

## 9) Deployment URLs

- **Frontend (Vercel):** `https://unique-patel-202411013.vercel.app`
- **Backend (Render):** `https://unique-patel-202411013.onrender.com`

> After first deploy, set backend `CORS_ORIGIN` to your Vercel domain and redeploy the backend.

---

## 11) Admin Login Credentials

Use these for evaluation (create them yourself in DB or via UI):

```
Email: admin@example.com
Password: <your-strong-password>
Role: admin
```

To promote a user to admin (PostgreSQL):
```sql
UPDATE users SET role='admin' WHERE email='admin@example.com';
```

---

## 10) Scripts

**Backend**
- `npm run dev` — start API (dev)
- `npm start` — start API (prod)
- `npm test` — run tests

**Frontend**
- `npm run dev` — start Next.js dev server
- `npm run build && npm start` — production build & serve

---

