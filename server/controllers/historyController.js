const Resume = require('../models/Resume');

const getHistory = async (req, res) => {
    const userId = req.user.id;
    try {
        const resumes = await Resume.findAll({ where: { user_id: userId } });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};

module.exports = { getHistory };