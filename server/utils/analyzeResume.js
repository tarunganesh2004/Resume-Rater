const { PythonShell } = require('python-shell');

const analyzeResume = (text) => {
    return new Promise((resolve, reject) => {
        const options = {
            mode: 'text',
            pythonPath: 'python', // Change to 'python3' if needed
            pythonOptions: ['-u'],
            scriptPath: './utils',
            args: [text],
        };

        console.log('Starting Python BERT analysis...');
        console.log('Text sent to Python:', text.slice(0, 50));

        const shell = new PythonShell('bert_analyze.py', options);

        let output = '';
        shell.on('message', (message) => {
            output += message; // Collect output
        });

        shell.on('error', (err) => {
            console.error('Python error:', err);
            resolve({
                wordCount: text.split(/\s+/).length,
                keywords: [],
                readability: 'Unknown',
                actionVerbs: [],
                error: 'BERT analysis failed: ' + err.message,
            });
        });

        shell.on('close', () => {
            console.log('Python script closed, output:', output);
            try {
                const analysis = JSON.parse(output);
                console.log('Parsed analysis:', analysis);
                resolve(analysis);
            } catch (parseError) {
                console.error('Error parsing Python output:', parseError);
                resolve({
                    wordCount: text.split(/\s+/).length,
                    keywords: [],
                    readability: 'Unknown',
                    actionVerbs: [],
                    error: 'Invalid BERT output',
                });
            }
        });

        // Timeout after 10 seconds
        setTimeout(() => {
            shell.terminate();
            console.log('Python script timed out');
            resolve({
                wordCount: text.split(/\s+/).length,
                keywords: [],
                readability: 'Unknown',
                actionVerbs: [],
                error: 'BERT analysis timed out',
            });
        }, 10000);
    });
};

module.exports = analyzeResume;