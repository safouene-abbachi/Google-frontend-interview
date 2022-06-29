const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/questions', async (req, res) => {
  try {
    const questions = await axios.get(
      'https://www.algoexpert.io/api/fe/questions'
    );

    return res.status(200).send(questions.data);
  } catch (error) {
    console.log(error);
  }
});

app.get('/submissions', async (req, res) => {
  var config = {
    method: 'get',
    url: 'https://www.algoexpert.io/api/fe/submissions',
    headers: {},
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      res.status(200).send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(PORT, () => {
  console.log('Server is running on port 5000');
});
