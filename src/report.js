function printReport(pages) {
    console.log(`Report is starting...`);
    sortPages(pages);
    for (let [url, value] of Object.entries(pages)) {
        console.log(`Found ${value} internal links ${url}`);
    }
}

const sortPages = (pages) => {
    let sortablePages = []
    for (let url in pages) {
        sortablePages.push([url, pages[url]]);
    }
    sortablePages.sort((a, b) => a[1] - b[1]);
    return sortablePages;
};

module.exports = {
    printReport
};
