import * as req from 'tiny_request';
import * as express from 'express';
import * as cheerio from 'cheerio';
import { appConfig } from './config/app_config';

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
        console.log('starting');
        this.requestHackerNews((body) => {
            let $ = cheerio.load(body);
            let links = [];

            $('.storylink').each( function () {
                var link = $(this).attr('href');
                links.push(link);
             });

            res.json(links);
        });  
     }

     processView = (body, callback) => {
        
     }

    requestHackerNews = (callback) => {
        this.context.req.get('https://news.ycombinator.com', function(body, response, err) {
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
};

const app = new App(context);
app.main();