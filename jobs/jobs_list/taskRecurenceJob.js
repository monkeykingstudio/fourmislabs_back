const Task = require('../../models/task');
const mongoose = require('mongoose');
module.exports = (agenda) => {

  
  agenda.define("set task recurence", async (job) => {
    console.log("Setting task recurence ...")
    let recurentTask = new Task();
    let parentId = job.attrs.data.taskId;
    console.log('parent ID before bug --> ', parentId);

      await Task.findOneAndUpdate({_id: job.attrs.data.taskId}, {
        "$set": {
          "cloned": true
          }
      })
      .exec((err, task) => {

        recurentTask = task;
        console.log('task to be cloned', recurentTask); // cloned task

        recurentTask._doc._id = mongoose.Types.ObjectId();
        recurentTask.isNew = true;
        recurentTask.save()
        .then(async (clonedTask) => {
          console.log('NEW ID TASK IS', clonedTask._id); // cloned task ID
          await Task.findOneAndUpdate({ _id: clonedTask._id },
            { "$set": {
              "toDo": true,
              "recurent": false,
              "parentId": parentId,
              }
            })
          
          // await Task.findByIdAndUpdate({ _id: clonedTask._id }, {toDo : true})
          .then(result => {
            console.log('DEBUG result clone', result);
            console.log('this is done successfull!!!!!!!!!!')
          });
        });
      });
  });

}
