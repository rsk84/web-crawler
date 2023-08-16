const { test, expect } = require('@jest/globals');
const { normalizeURL, getsURLsFromHTML } = require('../src/crawler');
const { JSDOM } = require('jsdom');

// normalizedURL tests

test('normalizeURL protocol', () => {
    const input = 'https://blog.boot.dev/path';
    const url = normalizeURL(input);
    expect(url).toEqual('blog.boot.dev/path');
});

test('normalizeURL slash', () => {
    const input = 'https://blog.boot.dev/path/';
    const url = normalizeURL(input);
    expect(url).toEqual('blog.boot.dev/path');
});

test('normalizeURL capitals', () => {
    const input = 'https://BLOG.boot.dev/path';
    const url = normalizeURL(input);
    expect(url).toEqual('blog.boot.dev/path');
});

test('normalizeURL http', () => {
    const input = 'http://blog.boot.dev/path';
    const url = normalizeURL(input);
    expect(url).toEqual('blog.boot.dev/path');
});

// getURLsFromHTML tests
test('getURLsFromHTML relative path', () => {
    const baseURL = 'https://example.com';
    const html = '<a href="/cat"></a><a href="/bird"></a><a href="/trex"></a>';
    const urls = getsURLsFromHTML(html, baseURL);
    expect(urls).toEqual([new URL('https://example.com/cat').href, new URL('https://example.com/bird').href, new URL('https://example.com/trex').href])
});

test('getURLsFromHTML absolute path', () => {
    const baseURL = 'https://example.com';
    const html = '<a href="https://example.com/cat"></a><a href="https://example.com/bird"></a><a href="https://example.com/trex"></a>';
    const urls = getsURLsFromHTML(html, baseURL);
    expect(urls).toEqual([new URL('https://example.com/cat').href, new URL('https://example.com/bird').href, new URL('https://example.com/trex').href])
});