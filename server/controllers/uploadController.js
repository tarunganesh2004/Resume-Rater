const pdfParse = require('pdf-parse');
const fs = require('fs');
const Resume = require('../models/Resume');
const analyzeResume = require('../utils/analyzeResume');

const uploadResume = async (req, res) => {
    const userId = req.user.id; // From JWT middleware
    const filePath = req.file.path;

    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        const analysis = await analyzeResume(data.text);

        const resume = await Resume.create({
            user_id: userId,
            file_path: filePath,
            analysis_data: analysis,
        });

        res.json({ message: 'Resume uploaded', analysis });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
    }
};

module.exports = { uploadResume };