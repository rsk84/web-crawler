const fs = require('fs');

async function reportToCSV(pages) {
    console.log(`Generating CSV report...`);
    let sortedPages = sortPages(pages);
    const rows = ['URL, Count'];
    for (let [_, count] of Object.entries(sortedPages)) {
        rows.push([count[0], count[1]].join(', '));
    }
    const out = fs.createWriteStream('../report.csv');
    out.on('error', (err) => console.log(`Error generating CSV report: ${err.message}`));
    rows.forEach(row => out.write(`${row}\n`));
    out.on('finish', () => console.log('Finished creating CSV report...'));
    out.end();
}

const sortPages = (pages) => {
    let sortablePages = []
    for (let url in pages) {
        sortablePages.push([url, pages[url]]);
    }
    sortablePages.sort((a, b) => b[1] - a[1]);
    return sortablePages;
};

module.exports = {
    reportToCSV
};
