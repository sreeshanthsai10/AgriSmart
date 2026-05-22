const axios = require('axios');
const FormData = require('form-data');

exports.predictDisease = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname);

        const response = await axios.post(
            'http://localhost:8000/predict/disease',
            formData,
            {
                headers: formData.getHeaders()
            }
        );

        res.status(200).json({
            success: true,
            result: response.data.data
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            success: false,
            message: "Prediction failed"
        });
    }
};