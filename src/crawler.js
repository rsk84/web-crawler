const { URL } = require('url');
const { JSDOM } = require('jsdom');

/**
* 
* @param {string} url
* @returns {URL}  
*/
const normalizeURL = (url) => {
    const urlCopy = new URL(url);
    let path = `${urlCopy.host}${urlCopy.pathname}`;
    if (path.length > 0 && path.slice(-1) === '/') {
        path = path.slice(0, -1);
    }
    return path;
};

/**
 * 
 * @param {string} html
 * @param {string} baseURL
 * @returns {Array} 
*/
const getsURLsFromHTML = (html, baseURL) => {
    const urls = [];
    const dom = new JSDOM(html);
    const aTags = dom.window.document.querySelectorAll('a');
    for (const aTag of aTags) {
        if (aTag.href.slice(0, 1) === '/') {
            try {
                urls.push(new URL(aTag.href, baseURL).href);
            } catch (err) {
                console.log(`${err.message}: ${aTag.href}`);
            }
        } else {
            try {
                urls.push(new URL(aTag.href).href);
            } catch (err) {
                console.log(`${err.message}: ${aTag.href}`);
            }
        }
    }
    return urls;
};

/**
 * 
 * @param {string} baseURL 
 * @param {string} currentURL 
 * @param {Object} pages 
 * @returns {Object}
 */
let crawlPage = async (baseURL, currentURL, pages) => {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }
    const url = normalizeURL(currentURL);
    if (pages[url] > 0) {
        pages[url] += 1;
        return pages;
    }
    if (currentURL === baseURL) {
        pages[url] = 0;
    } else {
        pages[url] = 1;
    }

    let htmlBody = '';
    try {
        const res = await fetch(currentURL);
        if (res.status > 399) {
            console.log(`HTTP Error ${res.status}`);
            return pages;
        }
        const contentType = res.headers.get('content-type');
        if (!contentType.includes('text/html')) {
            console.log(`Non-HTML response: ${contentType}`);
            return pages;
        }
        htmlBody = await res.text();
    } catch (err) {
        console.log(err.message);
    }
    const links = getsURLsFromHTML(htmlBody, baseURL);
    for (const link of links) {
        pages = await crawlPage(baseURL, link, pages);
    }
    return pages;
};

module.exports = {
    normalizeURL,
    getsURLsFromHTML,
    crawlPage
};
