const express = require("express");
const router = express.Router();
const Notification = require('../models/notification');

// Get ALL
router.get('/', async(req, res, next) => {
  if(req.user.role === 'admin') {
    await Notification.find(

          {
            $and: [
              {
                $or: [
                  { type: 'admin' },
                  { type: 'global' },
                  {
                   $and: [
                    { type: 'private' },
                    { "recieverId": { $in: req.user._id } }
                  ]
                }
                ]
              },
              { "read_by.readerId": { $ne: req.user._id } }
            ]
          },
          // {
          //   $and: [
          //     { type: 'private' },
          //     { "recieverId": { $in: req.user._id } }
          //   ]
          // }
        
      
    )
    .then(documents => {
      if(documents) {
        documents.sort((a,b) => {
          return b.created_at - a.created_at;
        })
        res.status(200).json({
          message: 'notifications succesfully loaded for admin',
          notifs: documents
        });
      } else {
        res.status(404).json({message: 'no notifications found!'});
      }
    });
  }

  else if(req.user.role === 'user') {
    await Notification.find(
      {
        $or: [
          {
            $and: [
              { type: 'global' },
              { 'read_by.readerId': { $ne: req.user._id } }
            ]
          },
          {
            $and: [
              { type: 'private' },
              { 'recieverId': { $in: req.user._id } },
              { 'read_by.readerId': { $ne: req.user._id } }
            ]
          }
        ]
      }
    ).then(documents => {
      if(documents) {
        documents.sort((a,b) => {
          return b.created_at - a.created_at;
        })
        res.status(200).json({
          message: 'notifications succesfully loaded for user',
          notifs: documents
        });
      } else {
        res.status(404).json({message: 'no notifications found!'});
      }
    });
  }
});

// Mark as read by ID
router.post('/read/:id', async (req, res, next) => {
await Notification.findOneAndUpdate({ _id: req.params.id },
{
  '$push':
  { "read_by": {'readerId': req.user._id }}
})
.then(read => {
  console.log('user added', req.user._id, 'to list of readers')
  res.status(200).json({
    message: 'readerId succesfully updated',
    notifs: read
  });
  });
});

// Mark database notif as read by socketRef
router.post('/socketread/:id', async (req, res, next) => {
  await Notification.findOneAndUpdate({ socketRef: req.params.id },
    {
      '$push':
      { "read_by": {'readerId': req.user._id }}
    })
  .then(read => {
    console.log('user added', req.user._id, 'to list of readers')
    res.status(200).json({
      message: 'readerId succesfully updated',
      notifs: read
    });
  });
});

module.exports = router;

