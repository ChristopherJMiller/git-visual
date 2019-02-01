const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'pug')
app.use('/gitgraph/', express.static('node_modules/gitgraph.js/build/'))

const gitlog = require('gitlog')

app.get('/*', function (req, res) {
  if (req.path === "/favicon.ico" || req.path === "/chart.js" || req.path === "/node_modules/gitgraph.js/build/gitgraph.min.js")
    return
  const options =
    { repo: __dirname + req.path
    , number: 20
    , fields:
      [ 'hash'
      , 'abbrevHash'
      , 'subject'
      , 'authorName'
      , 'authorDateRel'
      ]
    , execOptions:
      { maxBuffer: 1000 * 1024
      }
    };
  console.log(__dirname + req.path)
  let commits = gitlog(options);
  res.render('index', { title: __dirname + req.path, data: commits })
})

app.listen(port)