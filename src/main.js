const { exit } = require('process');
const { crawlPage } = require('./crawler.js');
const { reportToCSV } = require('./report.js')

async function main() {
    const args = process.argv;
    let baseURL = '';
    if (args.length > 3) {
        console.log('Error: Too many arguments...');
        console.log(args.length);
        exit();
    }
    if (args.length < 3) {
        console.log('Error: Too few arguments...');
        exit();
    }
    baseURL = args[2];
    
    console.log(`baseURL set as ${args[2]}`);
    
    pages = await crawlPage(baseURL, baseURL, {});
    await reportToCSV(pages);
}

main();
