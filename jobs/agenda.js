const Agenda = require("agenda");
const mongoose = require('mongoose');

const agenda = new Agenda({
  defaultLockLifetime: 500,
  mongo: mongoose.connection,
  db: { collection: 'agendaJobs' },
  processEvery: '5 seconds'
});

const jobTypes = ["diapauseStatusJob", "taskRecurenceJob", "usersRecurenceJob"];

jobTypes.forEach((type) => {
  require('./jobs_list/'+ type)(agenda);
});

if(jobTypes.length) {
  agenda.on('ready', async () =>
  {
    await agenda.start();
    await agenda.every("30 seconds", "logout old users");
    await agenda.every("45 seconds", "set diapause status");
  });
}

async function graceful() {
  await agenda.stop();
  process.exit(0);
}

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

module.exports = agenda;
