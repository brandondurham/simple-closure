const express = require('express');
const cors = require('cors');
const ProxycurlApi = require('proxycurl-js-linkedin-profile-scraper');

const defaultClient = ProxycurlApi.ApiClient.instance;
const BearerAuth = defaultClient.authentications['BearerAuth'];
BearerAuth.accessToken = '-YwY_8DuTic_0q8DqyLxAA';

const apiInstance = new ProxycurlApi.PeopleAPIApi();
const baseUrl = 'https://www.linkedin.com/in';
const fallbackToCache = 'on-error';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/get-profile', async (req, res) => {
  const { username } = req.query;
  const url = `${baseUrl}/${username}/`;

  // Request options
  const opts = {
    'extra': 'include',
    'facebookProfileId': 'include',
    'githubProfileId': 'include',
    'inferredSalary': 'include',
    'personalContactNumber': 'include',
    'personalEmail': 'include',
    'skills': 'include',
    'twitterProfileId': 'include',
    'useCache': 'if-recent',
  };

  apiInstance.personProfileEndpoint(url, fallbackToCache, opts, (error, data) => {
    if (error) {
      const { code, description } = error.response.body;
      res.status(code).json({ code, error: true, message: description });
    } else {
      res.json(data);
    }
  });
});

app.listen(3000, () => {
  console.log(`server running on 3000`);
});