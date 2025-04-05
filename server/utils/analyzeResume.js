const { PythonShell } = require('python-shell');

const analyzeResume = (text) => {
    return new Promise((resolve, reject) => {
        const options = {
            mode: 'text',
            pythonOptions: ['-u'], // Unbuffered output
            scriptPath: './utils', // Relative to /server
            args: [text],          // Pass resume text to Python
        };

        // @ts-ignore
        PythonShell.run('bert_analyze.py', options, (err, results) => {
            if (err) {
                console.error('Error running BERT analysis:', err);
                return resolve({
                    wordCount: text.split(/\s+/).length,
                    keywords: [],
                    readability: 'Unknown',
                    actionVerbs: [],
                    error: 'Analysis failed',
                });
            }

            try {
                const analysis = JSON.parse(results[0]); // Parse Python’s JSON output
                resolve(analysis);
            } catch (parseError) {
                console.error('Error parsing BERT results:', parseError);
                resolve({
                    wordCount: text.split(/\s+/).length,
                    keywords: [],
                    readability: 'Unknown',
                    actionVerbs: [],
                    error: 'Invalid analysis result',
                });
            }
        });
    });
};

module.exports = analyzeResume;