# 🛍️ ShopCo — E-Commerce Website

A modern and responsive e-commerce website built with React.js, focused on a clean user interface and smooth shopping experience.

## ✨ Features

- 🛒 E-commerce product browsing
- 📱 Responsive design
- 🎨 Modern and clean UI
- ⚡ React-based frontend
- 🔍 Product-focused interface
- 🧩 Reusable React components

## 🛠️ Tech Stack

- React.js
- JavaScript
- HTML5
- CSS3
- Tailwind CSS

## 📸 Preview

![ShopCo E-Commerce Preview](shopco-preview.png)

🌐 **Live Demo:** [ShopCo E-Commerce](https://shopco-e.netlify.app/)

## 👨‍💻 Developer

**Ahsan Raza**

Frontend Developer | JavaScript | React

- GitHub: [M-AHSAN-RAZA-125](https://github.com/M-AHSAN-RAZA-125)
- Instagram: [@ahsan.x.dev](https://www.instagram.com/ahsan.x.dev/)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/M-AHSAN-RAZA-125/ShopCo-Ecommerce.git


---

## Backend connection (Shop.Co)

This app uses the Shop.Co Express/MongoDB backend for products, login, cart, checkout and orders.

1. Start the backend (`npm run dev` in the backend folder) — it runs on `http://localhost:5000`.
2. Copy `.env.example` to `.env.local` and set `VITE_API_URL` (defaults to `http://localhost:5000` in development).
3. `npm install` then `npm run dev` here (opens on `http://localhost:5173`).

**Production:** set `VITE_API_URL` in Netlify/Vercel environment variables to the backend address and redeploy.
`public/_redirects` makes page refreshes on `/cart`, `/orders`, etc. work on Netlify.

**How the cart works:** guests keep their cart in the browser (localStorage). After login/sign-up it is merged into
the account's cart on the server, and from then on every cart change is saved on the server.
