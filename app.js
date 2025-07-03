// app.js
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('自動デプロイ大成功、GitHub Actions と Cloud Run の世界へ！');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});