const express = require('express');
const morgan = require('morgan'); /* logger */
const helmet = require('helmet'); /* protection */
const cors = require('cors');
const middlewares = require('./middlewares');
const github = require('./api/github');

require('dotenv').config();

/* mongoose */
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(cors());
app.use(express.json());

/* routes */
app.get('/', (req, res) => {
    res.json({
        message: "👌",
    });
});

app.use('/api/github', github);

/* errorHandler middlerware */
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});