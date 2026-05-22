// const express = require('express');
// const axios = require('axios');

// const router = express.Router();

// const API_KEY = process.env.MARKET_API_KEY;
// const BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

// router.get('/', async (req, res) => {
//     try {
//         const { limit = 30, offset = 0 } = req.query;

//         //  Build proxy query
//         const params = new URLSearchParams({
//             "api-key": API_KEY,
//             format: "json",
//             limit,
//             offset
//         });

//         // forward filters
//         if (req.query.state) params.append("filters[state]", req.query.state);
//         if (req.query.district) params.append("filters[district]", req.query.district);
//         if (req.query.market) params.append("filters[market]", req.query.market);
//         if (req.query.commodity) params.append("filters[commodity]", req.query.commodity);

//         const url = `${BASE_URL}?${params.toString()}`;

//         console.log(" PROXY REQUEST →", url);

//         const response = await axios.get(url);

//         res.json({
//             success: true,
//             records: response.data.records || [],
//             total: response.data.total || 0
//         });

//     } catch (err) {
//         console.error(" Proxy Error:", err.message);

//         res.status(500).json({
//             success: false,
//             records: [],
//             total: 0
//         });
//     }
// });

// module.exports = router;