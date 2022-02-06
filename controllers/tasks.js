const express = require("express");
const Task = require("../models/task");
const router = express.Router();
const agenda = require('../jobs/agenda');

// Get all tasks for the colony
router.get('/:id', (req, res, next) => {
    Task.find({colonyId: req.params.id})
    .sort({creationDate: -1})
    .then(tasks => {
      res.status(200).json({
        message: 'tasks fetched!',
        tasks: tasks
      });
    });
});

// Create a task
router.post('', async (req, res, next) => {
    const task = new Task({
      colonyId: req.body.colonyId,
      creationDate: req.body.creationDate,
      title: req.body.title,
      recurent: req.body.recurent,
      description: req.body.description,
      duration: req.body.duration,
      every: req.body.every,
      toDo: req.body.toDo,
    });


    task.save()
    .then(async (createdTask) => {
      let recurence = '';
      switch (createdTask.every) {
        case '45 seconds':
          recurence = '45 seconds';
          console.log('recurence set to', recurence);
          break;
        case 'day':
          recurence = '1 day';
          console.log('recurence set to', recurence);
          break;
        case 'week':
          recurence = '1 week';
          console.log('recurence set to', recurence);
          break;
        case '15 days':
          recurence = '15 days';
          console.log('recurence set to', recurence);
          break;
        case 'month':
          recurence = '1 month';
          console.log('recurence set to', recurence);
          break;
        case 'year':
          recurence = '1 year';
          console.log('recurence set to', recurence);
          break;
        default:
          console.log('default');
      }
      if (createdTask.recurent) {
        console.log('task with recurence, job is being created with task ID: ', createdTask._id);
        const agendaCreate = agenda.create("set task recurence", { taskId: createdTask._id});
        agendaCreate.repeatEvery(recurence,  { skipImmediate: true });
        await agendaCreate.save();
        console.log('done...');
      }
      res.status(200).json({
        message: "task created with success",
        taskId: createdTask._id
      })
    });
});


// Delete a task by ID
router.delete('/:id', async (req, res, next) => {

  // get all jobs with 'set task recurence'
  const jobs = await agenda.jobs(
    { name: 'set task recurence' },
    { data: -1 }
  );

  const taskToDelete = await Task.find({_id: req.params.id})
  .then(async (task) => {

  // if recurence job or not
  if(task.recurent) {
    const currentJob = await jobs.find(job => job.attrs.data.taskId = req.params.id);
    await currentJob.remove({ name: 'set task recurence' });
  }
  await Task.deleteOne({ _id: req.params.id })
  .then(result => {
    res.status(200).json({
      message: 'task deleted!'
    });
  })
});
  })


// Set task to completed
router.post('/:id', (req, res, next) => {
  const completeTask = Task.findOneAndUpdate({ _id: req.params.id }, {toDo : req.body.toDo})
  .then(result => {
    res.status(200).json({
      message: 'task sets to completed!'
    });
  });
});

// Remove task recurence
router.post('/job/:id', async (req, res, next) => {
  const jobs = await agenda.jobs(
    { name: 'set task recurence' },
    { data: -1 }
  );
  const currentJob = jobs.find(job => job.attrs.data.taskId  == req.params.id);
  await currentJob.remove({ name: 'set task recurence' });
  // console.log('MY CURRENT JOB', currentJob);
  const recurentTask = Task.findOneAndUpdate({ _id: req.params.id }, {recurent : req.body.recurent})
  .then(result => {
    res.status(200).json({
      message: 'task sets to completed!'
    });
  });
});

module.exports = router;

