const express = require('express');

const posts = require('./postDb');
const router = express.Router();


//GET ALL POSTS OF ALL USERS
router.get('/', (req, res) => {
  posts
  .get(req.query)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    res.status(500).json('The posts could not be retrieved.')
  })

});

//GET POST BY ID
router.get('/:id', validatePostId, (req, res) => {
  posts
  .getById(req.params.id)
  .then(ps => res.status(200).json(ps))
  .catch(err => res.status(500).json('that post could not be found'));
});

//DELETE A POST
router.delete('/:id', validatePostId, (req, res) => {
  posts
  .remove(req.params.id)
  .then(ps => {
    res.status(200).json(ps);
  })
  .catch(err => {
    res.status(500)
      .json('An error occured while removing that post')
  });
});

//UPDATE A POST
router.put('/:id', validatePostId, validatePost, (req, res) => {
  posts
  .update(req.params.id, req.body)
    .then(ps => {
      res.status(200).json(ps)
    })
    .catch(res =>{
        res.status(500).json('The user info couldn\'t be changed')
    })
});

// custom middleware

function validatePostId(req, res, next) {
  posts.getById(req.params.id)
  .then(ps => {
    if(ps){req.post = ps;}
    else{res.status(400).json('MiddleWare validatePostId says: invalid post id');}
  });  
next();
}

function validatePost(req, res, next) {
  if(!req.body){res.status(400).json('missing post data')}
  else if(!req.body.text){res.status(400).json('missing required text field')};
  next();
}

module.exports = router;
