"use strict";
const request = require('request-promise');



const run = async () => {
  const url = escape("http://cl.tuhistory.com/hoy-en-la-historia/himmler-comienza-experimentar-con-prisioneros-de-un-campo-de-concentracion");
  const facebookScrapeUrl = 'https://graph.facebook.com/';
  const token = "EAABlQNZBNQJEBAI1KXndE37rmTn7GEiIt8NuMmgF2zWGpWJyWtKFKfodOjf5fsYv8UYb25ZA5DnK5YTcj5bNMJrVAKGOYpI0W1CGOvBCiH7fwdKdZB8tFTigafw3wMAedMgQNegCcsAihe5k6npoS5KkIZA5DosNbcpg9gRLCFEZBGZA6TuFsJ7WyhEYWZCQ2oZD";

  try {
    let response = await request.post(facebookScrapeUrl + '?id=' + url + '&scrape=true&access_token=' + token );
    // console.log(response);
    console.dir(JSON.parse(response), {depth: null, colors: true})
  } catch(err) {
    console.log(err);
  }
}

run();