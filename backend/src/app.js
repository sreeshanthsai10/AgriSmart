const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const errorHandler = require('./middleware/errorHandler');
const logger = require('./config/logger');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const farmRoutes = require('./routes/farmRoutes');
const blogRoutes = require('./routes/blogRoutes');
const storeRoutes = require('./routes/storeRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const serviceRequestRoutes = require('./routes/serviceRequestRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

const app = express();


// =========================
//  SECURITY
// =========================
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" } //  allow images
    })
);

app.use(xss());
app.use(mongoSanitize());


// =========================
//  PERFORMANCE
// =========================
app.use(compression());


// =========================
//  RATE LIMIT
// =========================
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, try again later'
});

app.use('/api/v1', limiter);


// =========================
//  CORS
// =========================
app.use(cors({
    origin: process.env.FRONTEND_URL || [
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}));


// =========================
//  BODY PARSER
// =========================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


// =========================
//  STATIC FILES (IMAGES)
// =========================
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/uploads', express.static('uploads'));


// =========================
//  LOGGER (after body parsing)
// =========================
app.use(logger);


// =========================
//  SWAGGER
// =========================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// =========================
//  HEALTH CHECK
// =========================
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'AgriSmart API is running',
        timestamp: new Date().toISOString()
    });
});


// =========================
//  ROUTES
// =========================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/farms', farmRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/stores', storeRoutes);
app.use('/api/v1/equipment', equipmentRoutes);
app.use('/api/v1/service-requests', serviceRequestRoutes);
app.use('/api/v1/predict', predictionRoutes);


// =========================
//  404 HANDLER
// =========================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});


// =========================
//  ERROR HANDLER
// =========================
app.use(errorHandler);

module.exports = app;