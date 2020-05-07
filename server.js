const express = require('express');
const server = express();
server.use(express.json());
const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});



//custom middleware

const logger = (req, res, next) => {
  console.log(`${req.method}  ${req.url} [${new Date().toISOString()}]`);
  next();
}

server.use(logger);
server.use('/users', userRouter);
server.use('/posts', postRouter);



server.use(function(req, res){
  res.status(404).send('<h2>404 This page could not be found</h2>');
  
});

module.exports = server;
