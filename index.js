const axios = require('axios')
const cheerio = require('cheerio')
var http = require('http')
var fs = require('fs')

// parameter: body html of page
// returns: newly created html of the page
function buildHtml(body) {
  var header = ''

  return '<!DOCTYPE html>'
       + '<html><head>' + header + '</head><body>' + body + '</body></html>'
}

// parameter: chapter number, page number
// return: body html of a single chapter's page
async function getPageBody(currentChapter, currentPageNumber) { 
  // create link
  let firstPartOfLink = "http://programmedlessons.org/AssemblyTutorial/Chapter-"
  let thirdPartOfLink = "/ass"
  let lastPartOfLink = '.html'
  let newlyCreatedLink = firstPartOfLink.concat(currentChapter, thirdPartOfLink, currentChapter, 
    "_", currentPageNumber, lastPartOfLink)

  // wait for link to load
  try {
    // Your code here
    const response = await axios.get(newlyCreatedLink)
    // let us use $ like in jquery
    const $ = cheerio.load(response.data)

    if (response.data.search("go to next page") != -1) {
      let bodyHTML = $('body').html()
      return bodyHTML
    } else {
      return "End of the Chapter"
    }
  } catch (error) {
    // Handle rejection here
    console.log("failed to retrieve "+newlyCreatedLink)
  }
}

// parameter: chapter number
// return: promise containing HTML of all the chapter's pages
async function getAllPageBodies(currentChapter) {
  let allBodyHTML = []
  let endOfChapter = false
  let pageNumber = 1
  let currentPageBody
  while (endOfChapter == false) {
    if (pageNumber < 10) {
      currentPageBody = await getPageBody(currentChapter, '0'+pageNumber)
    } else {
      currentPageBody = await getPageBody(currentChapter, pageNumber)
    }
    if (currentPageBody != "End of the Chapter") {
      allBodyHTML.push(currentPageBody)
      ++pageNumber
    } else {
      endOfChapter = true
    }  
  }
  return Promise.resolve(allBodyHTML)
}

// parameter: body html
// creates a server
function createServer(body) {
  bodyHTML = buildHtml(body)
  // create server
  http.createServer(function (req, res) {
  // some specifications
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': bodyHTML.length,
    'Expires': new Date().toUTCString()
  })

  res.end(bodyHTML)
  }).listen(8080)
}


// execute code here
(async () => {
  let fileChapterNumbers = []
  
  // read file for chapter numbers separated by space
  // it prefixes them with leading zeroes if they're under 10
  fs.readFile('1. Chapter Numbers.txt', 'utf8', function (err,data) {
    if (err) {
      return console.log(err)
    }
    fileChapterNumbers = data.split(" ")
    for (let i=0; i<fileChapterNumbers.length; ++i) {
      let integer = parseInt(fileChapterNumbers[i])
      if (integer < 10)
        fileChapterNumbers[i] = "0"+integer
    }

    let promises = []

    // add promises based on our file chapter numbers
    for (let i=0; i<fileChapterNumbers.length; ++i) {
      promises.push(getAllPageBodies(fileChapterNumbers[i]))
    }

    // Promise.all resolves into an array of the returned values of each resolved promise
    // so I just join the array into a single string, and use that as the body for my created server
    Promise.all(promises).then((value) => {
      createServer(value.join(""))
    });
  })
})()

