const { Router } = require('express');
const GithubRequest = require('../models/githubRequest');

const router = Router();

/* main route */

router.get('/', async (req, res, next) => {
    try {
   	 const repos = await GithubRequest.find();
   	 res.json(repos);
    } catch(error) {
	next(error);
    }
});

module.exports = router;
