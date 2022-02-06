const Diapause = require('../../models/diapause');
const Notification = require('../../models/notification');
const nodemailer = require("nodemailer");

const mongoose = require('mongoose');
const {
    diapauseEndedUser,
    IO,
  } = require("../../controllers/notification");

module.exports = (agenda) => {
agenda.define("set diapause status", async (job) => {
    console.log('job diapause start');

    async function sendDiapauseEndedMail(email, pseudo, species, callback) {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'fourmislabs@gmail.com',
                pass: 'hwptbtqecruplzsi'
            }
        });
        let mailOptions = {
            from: `fourmislabs@gmail.com`,
            to: email,
            subject: `Your diapause for species ${species} has come to and end!`,
            html: `
            <h1>Hi ${pseudo}</h1><br>
            Your diapause is done! Now is the time to heat them gradually, then to feed them. Also remember to check the water supply.
            Don't forget to click the 'archive' button if you want to share your diapause statistics with the community!`
        };
        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);
        callback(info);
    }

    const allDiapauses = await Diapause.find({$or: [{status: 'scheduled'}, {status: 'active'}]})
    .exec(async (err, diapauses) => {
        if(err) {
            await console.log(err);
        }
        for(let diapause of diapauses) {
            const dateNow = new Date().getTime();
            const startDate = new Date(diapause.period.startDate).getTime();
            const endDate = new Date(diapause.period.endDate).getTime();
            const status = diapause.status;

            // console.log(diapause.species)

            if(status === 'scheduled' && startDate < dateNow && endDate > dateNow) {
                console.log('schedule have to switch to active');
                const diapauseToUpdate = await Diapause.findOneAndUpdate({ _id: diapause._id }, {status: 'active'});
            }

            else if (status === 'active' && startDate < dateNow && endDate < dateNow) {
                const newNotification = new Notification({
                    senderId: 'backend',
                    senderPseudo: 'fourmislabs bot',
                    recieverId: diapause?.creatorId,
                    message: `a diapause for species ${diapause?.species} has come to an end at:  ${diapause?.period.endDate}`,
                    created_at: Date.now(),
                    type: 'private',
                    subType: 'diapause',
                    url: `/${diapause?.colonyId}/${diapause.species?.toLowerCase()}`,
                });
                console.log('active have to switch to ended');
                const diapauseToUpdate = await Diapause.findOneAndUpdate({ _id: diapause._id }, {status: 'ended'});

                // database notif
                await diapauseEndedUser(diapause, diapause.creatorId);
                await sendDiapauseEndedMail(diapause.creatorEmail, diapause.creatorPseudo, diapause.species, (err, info) => {
                    console.log('Diapause ending mail has been sent');
                });
            }
        }
    });
});
}
