const mongoose = require('mongoose');
const { Schema } = mongoose;

const githubRequestSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    html_url: String,
    homepage: String,
    description: String,
    stargazers_count: Number,
}, {
    timestamps: true,
});

const GithubRequest = mongoose.model('GithubRequest', githubRequestSchema);

module.exports = GithubRequest;