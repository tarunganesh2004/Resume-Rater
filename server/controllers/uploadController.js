const pdfParse = require('pdf-parse');
const fs = require('fs');
const Resume = require('../models/Resume');
const analyzeResume = require('../utils/analyzeResume');

const uploadResume = async (req, res) => {
    const userId = req.user.id; // From JWT middleware
    const filePath = req.file.path;

    console.log('Starting upload for user:', userId);
    console.log('File path:', filePath);

    try {
        console.log('Reading PDF file...');
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        console.log('PDF text extracted:', data.text.slice(0, 50)); // First 50 chars

        console.log('Analyzing resume with BERT...');
        const analysis = await analyzeResume(data.text);
        console.log('Analysis complete:', analysis);

        console.log('Saving to database...');
        const resume = await Resume.create({
            user_id: userId,
            file_path: filePath,
            analysis_data: analysis,
        });

        console.log('Upload successful');
        res.json({ message: 'Resume uploaded', analysis });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
};

module.exports = { uploadResume };