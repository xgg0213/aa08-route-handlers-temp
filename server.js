const http = require('http');

let nextDogId = 1;

function getNewDogId() {
  const newDogId = nextDogId;
  nextDogId++;
  return newDogId;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  // When the request is finished processing the entire body
  req.on("end", () => {
    // Parsing the body of the request
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      console.log(req.body);
    }
    // Do not edit above this line

    // define route handlers here
    if (req.url === '/' && req.method ==='GET') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Dog Club');
    }

    if (req.url === '/dogs' && req.method ==='GET') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Dog index');
    }

    // /dogs/new
    if (req.url === ('/dogs/new') && req.method==='GET') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Dog create form page')
    }

    // POST /dogs question: why put it here?
    if (req.url === ('/dogs') && req.method==='POST') {
      const newDogId = getNewDogId();
      
      res.statusCode = 302;
      res.setHeader('Location', `/dogs/${newDogId}`);
      return res.end();
      
    }

    // POST /dogs/:dogId
    if (req.url.startsWith('/dogs') && req.method==='POST') {
      const parsedUrl = req.url.split('/'); 
      // ['','dogs,'1']
      if (parsedUrl.length === 3) {
        const dogId = parsedUrl[2];
        res.statusCode= 302;
        res.setHeader('Location', `/dogs/${dogId}`);
        return res.end();
      }
      
    }

    // GET /dogs/1
    if (req.url.startsWith('/dogs') && req.method==='GET') {
      const parsedUrl = req.url.split('/'); 
      // ['','dogs,'1']
      if (parsedUrl.length === 3) {
        const dogId = parsedUrl[2];
        res.statusCode= 200;
        res.setHeader('Content-Type', 'text/plain');
        return res.end(`Dog details for dogid: ${dogId}`)
      }
    }

    // GET /dogs/dogId/edit
    if (req.url.startsWith('/dogs') && req.method==='GET') {
      const parsedUrl = req.url.split('/'); 
      // ['','dogs,'1']
      if (parsedUrl.length === 4) {
        const dogId = parsedUrl[2];
        res.statusCode= 200;
        res.setHeader('Content-Type', 'text/plain');
        return res.end(`Dog edit form page for dogId: ${dogId}`)
      }
    }


    

    

    // Do not edit below this line
    // Return a 404 response when there is no matching route handler
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('No matching route handler found for this endpoint');
  });
});

const port = 8000;

server.listen(port, () => console.log('Server is listening on port', port));