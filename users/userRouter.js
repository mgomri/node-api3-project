const express = require('express');
const router = express.Router();
const users = require('./userDb');
const posts = require('../posts/postDb');

/************** GET USERS ******************/ 
router.get('/', (req, res) => {
  users
  .get(req.params.id)
  .then(usr => {
      if(usr){
          res.status(200).json(usr);
      }else{
          res.status(404).json({
              message:'The post with the specified ID does not exist.'
          });
      };
  })
  .catch(err => {
      res.status(500).json({
          error: 'The post information could not be retrieved.'
      });
  })
});


/************** GET USERS BY ID ******************/ 
router.get('/:id', validateUserId, (req, res) => {
  users.getById(req.params.id)
       .then(us => res.status(200).json(us))
      .catch(err => {
        res.status(500).json('the user info could not be retrieved')
      });
});


/************** GET USER POSTS ******************/ 
router.get('/:id/posts', validateUserId, (req, res) => {
  users
  .getUserPosts(req.params.id)
  .then(ps => {
    if(ps){res.status(200).json(ps);}
    else{res.status(404).json('this user has no posts')}
  })
  .catch(err => {
    res.status(500).json('The information couldn\'t be retrieved');
  });
});

/************** ADD USERS ******************/ 
router.post('/', validateUser, (req, res) => {
  users
  .insert(req.body)
  .then(us => {
    res.status(201).json(us);
  })
  .catch(err => {
    res.status(500).json('An error occured while saving the user')
  })
});


/*************** ADD A POST FOR A USER ******************/
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  let newPost = {text: req.body.text, user_id: req.params.id}
  
  users.getById(req.params.id)
  .then(us => {
    posts.insert(newPost)
    .then(post => res.status(201).json('post added successfully'))
    .catch(err => console.log(err));
  })
  .catch(err => {
    res.status(500).json('An error occured while trying to save the new post');
  })

});



/********** DELETE USERS **************/
router.delete('/:id', validateUserId, (req, res) => {
  users
  .remove(req.params.id)
  .then(us => {
    res.status(200).json(us);
  })
  .catch(err => {
    res.status(500)
      .json('An error occured while removing that user')
  });
});


/***********UPDATE USERS INFO ******************************/
router.put('/:id', validateUserId, validateUser, (req, res) => {
  users
    .update(req.params.id, req.body)
    .then(us => {
      res.status(200).json(us)
    })
    .catch(res =>{
        res.status(500).json('The user info couldn\'t be changed')
    })
});

/******************* custom middleware **********************/
function validateUserId(req, res, next) {
  users.getById(req.params.id)
       .then(us => {
         if(us){
           req.user = us;
         }else{
           res.status(400).json('MiddleWare validateUserId says: invalid user id');
         }
       });  
  next();
}

function validateUser(req, res, next) {
  if(!req.body){res.status(400).json('MiddleWare validateUser says: missing user data')}
  else if(!req.body.name){res.status(400).json('middleWare validateUser says: missing required name field')};
  next();
}

function validatePost(req, res, next) {
  if(!req.body){res.status(400).json('missing post data')}
  else if(!req.body.text){res.status(400).json('missing required text field')};
  next();
}

module.exports = router;
