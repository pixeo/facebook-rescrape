#!/usr/bin/env node

"use strict";
const request = require("request-promise");
const commander = require("commander");
const parser = require("xml2json");
const fs = require("fs");
const pkg = require(__dirname + "/package.json");

const FACEBOOK_SCRAPE_URL = "https://graph.facebook.com/";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const filterSiteMap = (sitemap, filter) => {
    const regex = new RegExp(filter, "i");
    return sitemap.filter(item => {
        if (regex.test(item.loc)) return item;
    });
};

const replaceStringOnLinks = (sitemap, replace, regex) => {
    regex = new RegExp(regex, "i");

    return sitemap.map(item => {
        item.loc = item.loc.replace(regex, replace);
        return item;
    });
};

//load the xml sitemap, convert it to JS object
const processSiteMap = async url => {
    let response = await request(url);

    response = parser.toJson(response, { object: true });
    response = response.urlset.url;

    if (commander.filter) response = filterSiteMap(response, commander.filter);

    if (commander.regex && commander.replace)
        response = replaceStringOnLinks(
            response,
            commander.replace,
            commander.regex
        );

    response = response.map(item => {
        return item.loc;
    });

    console.dir(response, { depth: null, colors: true });
    return response;
};

const run = async () => {
    let urls = [];
    let currentUrlIndex = 0;
    let lastCalledIndex = 0;

    if (!commander.type) commander.type == "url";

    if (
        (commander.regex && !commander.replace) ||
        (!commander.regex && commander.replace)
    )
        return console.log("ERROR: Regex or Replace not set");

    if (commander.type === "sitemap")
        urls = urls.concat(await processSiteMap(commander.url));
    else urls.push(commander.url);

    let total = urls.length;

    const interval = () => {
        let timer = 0;

        if (commander.type != "url") {
            timer = 30000;
            console.info("WAITING FOR 30 SECONDS TO AVOID OVERLOAD…");
        }

        setTimeout(async () => {
            let count = commander.type == "url" ? 1 : lastCalledIndex + 30;
            for (currentUrlIndex; currentUrlIndex < count; currentUrlIndex++) {
                console.log(
                    "PROCESSING URL " + (currentUrlIndex + 1) + " FROM " + total
                );

                try {
                    let response = await request.post(
                        FACEBOOK_SCRAPE_URL +
                            "?id=" +
                            urls[currentUrlIndex] +
                            "&scrape=true&access_token=" +
                            ACCESS_TOKEN
                    );
                    console.dir(
                        { url: urls[currentUrlIndex], scraped: true },
                        { depth: null, colors: true }
                    );
                    if (commander.show)
                        console.dir(JSON.parse(response), {
                            depth: null,
                            colors: true
                        });
                } catch (err) {
                    let errorObject = {
                        status: err.statusCode,
                        url: urls[currentUrlIndex],
                        message: err.error
                    };

                    fs.appendFile(
                        "error.log",
                        JSON.stringify(errorObject) + "\n",
                        err => {
                            if (err) throw err;
                        }
                    );

                    console.error(errorObject, { depth: null, colors: true });

                    if (commander.show)
                        console.dir(err, { depth: null, colors: true });
                }
            }

            lastCalledIndex = currentUrlIndex;

            if (currentUrlIndex >= total - 1) {
                clearTimeout(interval);
                return true;
            }

            interval();
        }, timer);
    };

    interval();
};

commander
    .version(pkg.version)
    .usage("[options] <file ...>")
    .option(
        "-t, --type <type>",
        'The type of url that will be processed can be "sitemap" or "url"',
        /^(sitemap|url)$/i,
        "url"
    )
    .option("-u, --url <url>", "The Url to be processed")
    .option("-r, --replace <replace>", "A regex to replace some value")
    .option("-g, --regex   <regexp>", "The value to be replaced")
    .option(
        "-f, --filter  <filter>",
        "Filter urls from a sitemap by this filter value"
    )
    .option("-s, --show", "Shows the Facebook response")
    .parse(process.argv);

run();
