const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'pug')
app.use('/gitgraph/', express.static('node_modules/gitgraph.js/build/'))

app.get('/*', function (req, res) {
  if (req.path === "/favicon.ico" || req.path === "/chart.js" || req.path === "/node_modules/gitgraph.js/build/gitgraph.min.js")
    return


  const git = require('simple-git')(__dirname + '/..' + req.path)
  const gitlog = require('gitlog');

  git.branch((err,branches) => {
    let branchData = {};
    for (let i = 0; i < branches.all.length; i++) {
      let branchName = branches.all[i]

      const options = {
        repo: __dirname + '/..' + req.path,
        number: 50,
        branch: branchName !== 'master' ? branchName + ' --not master' : 'master',
        fields: [
          'abbrevHash',
          'abbrevParentHashes',
          'subject',
          'authorName'
        ],
        execOptions: {
          maxBuffer: 1000 * 1024
        }
      }
      let commits = gitlog(options)
      if (commits.length > 0) {
        branchData[branchName] = commits;
      }
    }
    res.render('index', { title: __dirname + req.path, data: branchData })
  })

})

app.listen(port)