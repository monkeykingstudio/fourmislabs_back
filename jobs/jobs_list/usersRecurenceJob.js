const User = require('../../models/user');
module.exports = (agenda) => {

  agenda.define("logout old users", async (job) => {
    console.log('job user start');
    // const logout = await User.find({ lastLogin: { $gte: oneHourAgo } })
    const logout = await User.find({ isConnected: true})

    .exec(async (err, users) => {
      for(let user of users) {
        const lastLogin = user.lastLogin;
        const hours = (new Date(Date.now()) - lastLogin) / 36e5;
        // console.log('last login', user.pseudo, ' ', user.lastLogin);
        // console.log('user connecté depuis', hours);

        if(hours >= 1) {
          console.log('user', user.pseudo, 'have to be disconnect');
          const userToLogout = await User.findOneAndUpdate({ _id: user._id }, {isConnected: false});
        }
      }
    });
  });
}
