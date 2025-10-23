# unique_patel_202411013 — E-Commerce App

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
    next.config.ts
    package.json
  .gitignore
  README.md
```

---

## 4) Environment Variables

Create `backend/.env` (never commit it):

| Key            | Example                                                                                   | Notes                                                     |
|----------------|--------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| `PORT`         | `8080`                                                                                    | API port (Render will set its own in production)         |
| `JWT_SECRET`   | `change_this_to_a_long_random_string`                                                     | Required                                                 |
| `SQL_URL`      | `postgres://postgres:postgres@localhost:5432/ecom`                                        | URL-encode special chars in password                     |
| `MONGO_URL`    | `mongodb+srv://appuser:sp%40ce33Xy@cluster0.nbghsdm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` | Use Atlas “Drivers → Node.js” string, password encoded   |
| `CORS_ORIGIN`  | `http://localhost:3000`                                                                    | Frontend origin (set to Vercel URL in prod)              |

Create Vercel env in `frontend`:

| Key                    | Example                                              | Notes             |
|------------------------|------------------------------------------------------|-------------------|
| `NEXT_PUBLIC_API_BASE` | `http://localhost:8080` or your Render API base URL | Public at runtime |

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

## 8) API Summary

**Base URL (prod):** `https://unique-patel-202411013.onrender.com`

### Auth
- `POST /auth/register` → `{ name, email, password }` → `{ id, name, email, role }`
- `POST /auth/login` → `{ email, password }` → `{ token, user }`
- `GET /auth/me` (Bearer) → `{ id, name, email, role }`
- `POST /auth/logout` (Bearer) → `{ ok: true }`

**Example (login):**
```bash
curl -X POST -H "Content-Type: application/json"   -d '{"email":"user@example.com","password":"password123"}'   https://unique-patel-202411013.onrender.com/auth/login
```

### Products (Mongo)
- `GET /products?q=&category=&page=1&limit=12`  
  - Default server sort: **price DESC**
  - Override: header `X-Eval-Sort: asc` → **price ASC**
- `GET /products/:id`
- `POST /products` (admin)
- `PUT /products/:id` (admin)
- `DELETE /products/:id` (admin)

**Example (override ASC):**
```bash
curl -H "X-Eval-Sort: asc" https://unique-patel-202411013.onrender.com/products
```

### Checkout (PostgreSQL)
- `POST /checkout/preview` (Bearer)  
  Body: `{ "items":[{"productId":"p1","quantity":2}] }`
- `POST /checkout` (Bearer)  
  Same body; server recalculates prices and writes order.

### Reports (admin)
- `GET /reports/sql/daily-revenue` (Bearer admin)
- `GET /reports/mongo/category` (Bearer admin)

---

## 9) Frontend Route Summary (Next.js)

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

## 10) Deployment URLs

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

## 12) Submission Checklist

- [ ] Repo is public and named exactly: `unique_patel_202411013`
- [ ] Deployment names match repository name
- [ ] Frontend URL live and loads `/products`
- [ ] Backend URL live and returns `/health`
- [ ] Products default sort is **DESC** and override header works (**ASC**)
- [ ] Checkout writes SQL rows, totals computed on server
- [ ] Reports: SQL daily revenue + Mongo category
- [ ] README contains all required sections and **admin credentials**
- [ ] No banned names; no secrets committed; `.env` ignored

---

## 13) Troubleshooting

- **Mongo TLS error on Windows:** ensure you use the Atlas “Drivers → Node.js” SRV URI with query params; URL-encode password; allow your IP in Atlas; consider disabling HTTPS inspection in antivirus; verify system time; Node 20 LTS is recommended.
- **CORS blocked:** set `CORS_ORIGIN` to your exact frontend URL (including protocol).
- **Postgres password with `@` or spaces:** URL-encode in `SQL_URL` (e.g., `sp%40ce33Xy`).
- **Unauthorized (401):** pass `Authorization: Bearer <token>`; re-login if token expired.
- **Products empty:** seed documents in `ecomdb.products` and restart the API.

---

## 14) Scripts

**Backend**
- `npm run dev` — start API (dev)
- `npm start` — start API (prod)
- `npm test` — run tests

**Frontend**
- `npm run dev` — start Next.js dev server
- `npm run build && npm start` — production build & serve

---

## 15) Notes

- Secrets live only in environment variables; never commit `.env`.
- All monetary totals are computed on the server; client-sent prices are ignored.
- Server-side sort override uses request header `X-Eval-Sort: asc`.
