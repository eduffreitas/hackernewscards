import * as req from 'tiny_request';
import * as express from 'express';
import * as cheerio from 'cheerio';
import { appConfig } from './config/app_config';
import * as crypto from 'crypto';

class App 
{
    context: any;

    constructor(context) {
        this.context = context;
    }

    main = () => {
        let port = this.context.config.port;
        this.registerRoutes();
        this.context.app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        })
    }

    registerRoutes = () => {
        this.context.app.get('/', this.index);
    }

    index = (req, res, next) => {
        let page: number = 1;

        if (req.query.page) {
            page = req.query.page;
        }

        this.requestHackerNews(page, (body) => {
            let $ = cheerio.load(body);
            let links = [];

            $('.storylink').each(function () {
                var link = $(this).attr('href');
                links.push(link);
             });

             console.log(this.context.crypto.createHash('md5').update(JSON.stringify(links)).digest("hex"));

            res.json(links);
        });  
     }

    requestHackerNews = (page: number, callback) => {
        this.context.req.get(`https://news.ycombinator.com/news?page=${page}`, function(body, response, err) {
            if (!err && response.statusCode == 200) {
                callback(body) 
            } 
         });
    }
}

const express_app = express();
// Run
let context = {
    req: req, 
    app: express_app,
    config: appConfig,
    crypto: crypto
};

const app = new App(context);
app.main();