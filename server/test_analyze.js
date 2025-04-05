const analyzeResume = require('./utils/analyzeResume');

async function test() {
    const text = "John Doe Developed projects with a team. Manage";
    console.log('Starting analysis...');
    const result = await analyzeResume(text);
    console.log('Result:', result);
}

test();