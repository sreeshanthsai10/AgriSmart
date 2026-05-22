const express = require('express');
const multer = require('multer');
const { predictDisease } = require('../controllers/predictionController');

const router = express.Router();

// Store file in memory
const upload = multer();

router.post('/disease', upload.single('file'), predictDisease);

module.exports = router;