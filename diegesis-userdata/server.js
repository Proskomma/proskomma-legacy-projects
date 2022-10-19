const express = require('express')
const cors = require('cors')
const multer = require('multer')
const fse = require('fs-extra')
const path = require('path')

const upload = multer({limits: {fieldSize: 1000 * 1024 * 1024}})
const port = 8088

const app = express()
app.use(cors())
app.use(express.static('static'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/freeze', upload.single('frozen'), (req, res) => {
  fse.writeFileSync(path.join(__dirname, 'static', 'archives', 'archive.pkzip'), req.body.frozen)
  res.send(`Received and stored archive of ${req.body.frozen.length} bytes`)
})

app.post('/bibleHtml', upload.single('bibleHtml'), (req, res) => {
    fse.writeFileSync(path.join(__dirname, 'static', 'html', 'bible.html'), req.body.bibleHtml)
    res.send(`Received and stored HTML of ${req.body.bibleHtml.length} bytes`)
})

app.listen(port, () => {
  console.log(`Diegesis userdata server listening on port ${port}`)
})
