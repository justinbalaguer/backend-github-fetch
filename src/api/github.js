const { Router } = require('express');
const https = require('https');
const cron = require('node-cron');

const GithubRequest = require('../models/githubRequest');

const router = Router();

// cron job every hour
cron.schedule("0 * * * *", () => {
    const options = {
        hostname: "api.github.com",
        path: "/users/justinbalaguer/repos",
        method: 'GET',
        headers: {
          'User-Agent': 'justinbalaguer',
        }
      };
    
      const req =  https.request(options, (res) => {
        res.setEncoding('utf8');
    
        let data = '';
    
        res.on('data', (chunk) => {
          data = data + chunk;
        });
    
        res.on('end', async () => {
            try {
                let json_data = JSON.parse(data);
                let json_length = Object.keys(json_data).length;
                let new_data = [];
                for(x=0;x<json_length;x++) {
                    if(json_data[x].stargazers_count>0) {
                        new_data.push({
                            "name": json_data[x].name,
                            "html_url": json_data[x].html_url,
                            "homepage": json_data[x].homepage,
                            "description": json_data[x].description,
                            "stargazers_count": json_data[x].stargazers_count
                        });
                    }
                }
                /* remove all the data first */
                await GithubRequest.deleteMany({});
                /* save data */
                let new_data_len = new_data.length;
                for(i=0;i<new_data_len;i++) {
                    const githubRequest = new GithubRequest(new_data[i]);
                    const requested = await githubRequest.save();
                }
                console.log("saved");
            } catch (error) {
                if(error.name === "ValidationError") {
                    console.log(error.name);
                }
                next(error);
            }
        });
    
      });
    
      req.on('error', (e) => {
        console.log(req.statusCode);
      });
    
      req.end();
});

/* main route */

router.get('/', async (req, res) => {
    const repos = await GithubRequest.find();
    res.json(repos);
});

module.exports = router;