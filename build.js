// build.js
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'

const __dirname = path.resolve()

const templatePath = path.join(__dirname, 'templates', 'login.hbs')
const dataDir = path.join(__dirname, 'data')
const partialsDir = path.join(__dirname, 'partials')
const outputDir = path.join(__dirname, 'dist')

// Register partials
fs.readdirSync(partialsDir).forEach(file => {
  const partial = fs.readFileSync(path.join(partialsDir, file), 'utf8')
  handlebars.registerPartial(path.parse(file).name, partial)
})

// Compile and render
const templateSource = fs.readFileSync(templatePath, 'utf8')
const template = handlebars.compile(templateSource)

// Compile each data file
fs.readdirSync(dataDir).forEach(dataFile => {
  const name = path.parse(dataFile).name // e.g. 'index', 'about'
  if (!name.match(/^\_/)) {
    const dataPath = path.join(dataDir, `${name}.json`)
    const globalPath = path.join(dataDir, `_global.json`)
  
    let data = {}
    if (fs.existsSync(dataPath)) {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    }
    if (fs.existsSync(globalPath)) {
      data = { ...data, ...JSON.parse(fs.readFileSync(globalPath, 'utf8')) }
    }
  
    const html = template(data)
  
    const outputPath = path.join(outputDir, name === 'index' ? 'index.html' : `${name}.html`)
    fs.mkdirSync(outputDir, { recursive: true })
    fs.writeFileSync(outputPath, html)
  }
})

// const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
// const result = template(data)

// Ensure output directory exists
// fs.mkdirSync(outputDir, { recursive: true })
// fs.writeFileSync(path.join(outputDir, 'index.html'), result)

