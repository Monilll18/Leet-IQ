# Leet IQ - Development Setup

## 🚀 Quick Start

Start both frontend and backend servers with a single command:

```bash
npm run dev
```

This will start:
- **Backend API** on `http://localhost:3000`
- **Frontend App** on `http://localhost:5173` (with API proxy to port 3000)

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Clerk account (for authentication)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Leet iq"
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

3. **Configure environment variables**

   **Backend** (`backend/.env`):
   ```bash
   PORT=3000
   DB_URL=your_mongodb_atlas_connection_string
   NODE_ENV=development
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
   ```

   **Frontend** (`frontend/.env`):
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=/api
   VITE_STREAM_API_KEY=your_stream_key
   ```

## 🎯 Available Scripts

### Development
```bash
npm run dev
```
Runs both backend and frontend in development mode concurrently.

### Build
```bash
npm run build
```
Installs dependencies and builds the frontend for production.

### Start (Production)
```bash
npm start
```
Starts the backend server in production mode.

## 🏗️ Project Structure

```
Leet iq/
├── backend/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── db.js          # MongoDB connection
│   │   │   └── env.js         # Environment variables
│   │   └── server.js          # Express server
│   ├── .env                   # Backend environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── main.jsx
│   ├── .env                   # Frontend environment variables
│   ├── vite.config.js         # Vite configuration
│   └── package.json
└── package.json               # Root package.json with dev script
```

## 🔌 API Endpoints

All API endpoints are prefixed with `/api`:

- `GET /api/health` - Health check endpoint
- `GET /api/books` - Example books endpoint

## 🌐 How It Works

1. **Backend** runs on port 3000 and handles all API requests
2. **Frontend** runs on port 5173 (Vite default) and proxies `/api/*` requests to the backend
3. In your browser, you access the frontend at `http://localhost:5173`
4. All API calls from frontend to `/api/*` are automatically forwarded to `http://localhost:3000/api/*`

## ✅ Verification

After running `npm run dev`, verify everything is working:

1. **Backend health check:**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Should return: `{"msg":"Server is healthy","status":"success"}`

2. **Frontend:** Open `http://localhost:5173` in your browser

3. **API proxy:** From frontend, API calls to `/api/*` will work automatically

## 📚 Additional Resources

- [Clerk Setup Guide](./clerk-setup.md) - Complete Clerk authentication setup
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database setup
- [Vite Documentation](https://vitejs.dev/) - Frontend build tool

## 🐛 Troubleshooting

### Port already in use
If port 3000 or 5173 is already in use, kill the process:
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### MongoDB connection failed
- Verify your MongoDB Atlas connection string in `backend/.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Check your database credentials

### Clerk authentication not working
- Verify Clerk keys in both `.env` files
- Ensure keys match between frontend and backend
- Check Clerk dashboard for application status
