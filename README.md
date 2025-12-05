# Shopping

Simple Shopping app with feature like adding to cart , removing from cart , checkout and at last receipt of payment.
---

## 🛠 Backend (Node + Express)

- **Uses DummyJSON API:** 
- GET https://dummyjson.com/products?limit=100 
- GET https://dummyjson.com/products/categories
  
- Caches products & categories in memory.
- Exposes REST endpoints under /api/* (products, categories, cart, checkout)


## 🛠️ Tech Stack

| Category      | Technology                                                                      |
| ------------- | ------------------------------------------------------------------------------- |
| Frontend      | React, Vite, Tailwind CSS                                                       |
| Backend       | NodeJS , Expressjs , REST-APIs                                                  |
| Deployment    | Vercel , Render                                                                 |
                                                      

---

## Backend Setup and Installation

### Prerequisites

- Node.js (v16+) and npm/yarn/pnpm 
- Git

### Steps

####  **Clone the repo**

   ```bash
   git clone <your-repository-url>
   cd <project-folder>

   ```

#### **Backend Setup**

   ```bash
   #Navigate to the backend folder
   cd backend
   npm install
   npm start
   # runs on http://localhost:5000

   ```

##  **Frontend Setup**

- Simple shopping UI: product list, product details, cart, checkout.
- Talks to backend via **VITE_API_BASE**:

  **.env file**
    ```bash
   # For development
   VITE_API_BASE=http://localhost:5000

   # For production
   VITE_API_BASE=https://<your-backend-url>

   ```
**Run in development**
   ```bash
   cd frontend
   npm install
   npm run dev
   # runs on http://localhost:5173

   ```
 **build for production**
   ```bash
   npm run build

   ```
   
##  **Deployment**

 **Backend (Render)**
  - New → Web Service → Connect GitHub → root: backend
  - Build: npm install
  - Start: npm start
  - Ensure package.json has:

   ```bash
  "engines": { "node": "24.x" }
   ```

 **Frontend (Netlify / Vercel)**
  - Build command: npm run build
  - Publish directory: dist
  - Add your render backend url in env var: VITE_API_BASE 


