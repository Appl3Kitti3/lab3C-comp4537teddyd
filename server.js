const http = require('http'); // Get HTTP Module
const url = require('url'); // Get URL Module
const fs = require('fs'); // Get File System Module
const text = require('./lang/en/en.js'); // Get user texts module

const SUCCESS = 200; // Successful Status Code
const NOTFOUND = 404; // Not Found Status Code
const MYPORT = 8888; // My Port to use locally 
const port = process.env.PORT || MYPORT; // port variable is determined by Azure / GitHubs port or my port

// Server Class
// This class handles the server requests
class Server
{
    // Handles whenever the url is called
    handleRequest(req, res)
    {
        let q = url.parse(req.url, true); // get the url information as string
        if (!q.query['text']) // If there is no ?text= in the url then read file
        {
            fs.readFile(text.MYFILENAME, function(err, data) { // try to read file
                let statusCode = SUCCESS; // automatically set status code
                let endResult = ""; // automatically set end result

                if (err) { // if error create file with blank data
                    MyFile.writeToFile(text.MYFILENAME, ""); // create file
                    statusCode = NOTFOUND; // set status code to not found
                    endResult = `${q.pathname} ${text.NOTFOUNDMESSAGE}`; // set end result to not found message 
                }
                else
                    endResult = data; // set end result to data if there is a file
    
                res.writeHead(statusCode, {'Content-Type': 'text/html'}); // set the response header
                res.end(endResult); // send the response
            });
        }
        else
        {
            MyFile.writeToFile(text.MYFILENAME, `${q.query['text']}${text.NEWLINE}`); // append the text to the file
            res.end(); // send the response
        }
        
    }

    // start server 
    start()
    {
        http.createServer(this.handleRequest.bind(this)).listen(port);
    }
}

// MyFile, Helps writing to file specified
class MyFile
{
    // write to file
    static writeToFile(filename, data)
    {
        // append the data to the file
        fs.appendFile(filename, data, function (err) {
            if (err) throw err;
        });
    }
}

// Start the server
const server = new Server();
server.start();