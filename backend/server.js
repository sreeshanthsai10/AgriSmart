const dns = require('dns');
dns.setServers(["1.1.1.1", "8.8.8.8"]);

process.on('uncaughtException', (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    process.exit(1);
});

require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');

// Connect DB
connectDB()
    .then(() => {
        console.log("✅ Database Connected");

        const PORT = process.env.PORT || 5000;

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
        });

        process.on('unhandledRejection', (err) => {
            console.error(`❌ Unhandled Rejection: ${err.message}`);
            server.close(() => process.exit(1));
        });
    })
    .catch(err => {
        console.error("❌ DB Connection Failed:", err.message);
        process.exit(1);
    });