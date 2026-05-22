# AgriSmart – AI Powered Smart Agriculture Platform

AgriSmart is a complete, production-ready full-stack web application designed for farmers, buyers, and administrators. It features farm management, crop and yield predictions using Machine Learning, a live market dashboard, an offline store locator using geospatial queries, and multilingual AI chat capabilities.

## Architecture

*   **Frontend**: React (Vite), Tailwind CSS, React-Leaflet, Axios.
*   **Backend**: Node.js, Express, MongoDB (Mongoose), JWT.
*   **ML Microservice**: Python, FastAPI.

## Directory Structure

*   `frontend/` - React frontend application.
*   `backend/` - Node.js Express API.
*   `ml-service/` - FastAPI Python ML prediction service.
*   `scripts/` - Database seed script and other utilities.

## Requirements

*   Node.js (v16+)
*   Python (3.9+)
*   MongoDB (v5.0+ running locally or in Cloud via Atlas)

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure Environment Variables:
Copy `../.env.example` to `backend/.env` and update the `MONGO_URI` and `JWT_SECRET`.

Start the backend (Development mode):
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start the Vite development frontend:
```bash
npm run dev
```

### 3. ML Microservice Setup

```bash
cd ml-service
python -m venv venv
# Windows: venv\\Scripts\\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Start the FastAPI ML Server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Seeding the Database (Optional)

You can run the mock seeder script to initialize some mock user/store data (make sure MongoDB is running!).

```bash
cd scripts
npm install mongoose dotenv
node seed.js
```

## Features Demonstrated

*   **Authentication**: JWT-based secure login, with Role-Based Access Control (Farmer, Admin, Buyer).
*   **Geo-Spatial Queries**: The `Store` location is indexed with a `2dsphere` index to locate offline stores using `$near` and `$geoWithin`.
*   **Microservices**: Separation of concerns between normal CRUD operations (Node/Express) and CPU-intensive ML tasks (FastAPI).
*   **Scalability**: Well-structured MVC for the backend. Clean context/router setup for frontend.

## Deployment Notes

*   **Frontend**: Can be built perfectly with `npm run build` and pushed to Vercel, Netlify, or any static hosting (S3/CloudFront).
*   **Backend**: Can run on Heroku, Render, AWS Beanstalk, or as a Docker container (Cloud Run, ECS). Set `NODE_ENV=production`.
*   **ML Service**: Needs proper handling of the Python environment, often deployed separately to services specifically for APIs (like Render or AWS Fargate) given that models can be quite large. Consider Gunicorn as a production server to handle process management.
*   **Database**: MongoDB Atlas creates a great cloud environment for MongoDB instances with GeoSpatial indexing built right in.
