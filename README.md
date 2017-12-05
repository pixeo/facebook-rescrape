# Facebook Rescrape

### Install
    npm install -g facebook-rescrape

##Usage
Force the Facebook to scrape a page again

    ./rescrape -h

    Usage: rescrape [options] <file ...>


    Options:

    -V, --version            output the version number
    -t, --type <type>        The type of url that will be processed can be "sitemap" or "url" (default: url)
    -u, --url <url>          The Url to be processed
    -r, --replace <replace>  A regex to replace some value
    -g, --regex   <regexp>   The value to be replaced
    -f, --filter  <filter>   Filter urls from a sitemap by this filter value
    -s, --show               Shows the Facebook response for each url
    -h, --help               output usage information
  
### You can re-scrape a single url or a sitemap

    # eg for a single url:
    $ ./rescrape -u http://yoursite.com/url-path/if-exists
    
    # eg for a site map
    $ ./rescrape -u https://yoursite.com/sitemap.xml -t sitemap
    

### Some times you'd like to filter the sitemap by urls with a pattern

    # eg filtering a url by pattern
    $ ./rescrape -u https://yoursite.com/sitemap.xml -t sitemap -f only-urls-with-this
    # will re-scrape just urls like https://yoursite.com/only-urls-with-this

### Or maybe you'd like to replace part of the url

    # eg replacing part of url
    ./rescrape -u https://yoursite.com/sitemap.xml -t sitemap -f only-urls-with-this -g http:\/\/www -r https://mx
    # the http://www will be replaced by https://mx


    
