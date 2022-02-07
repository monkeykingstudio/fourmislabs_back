const Messor = require('../genres/messor');
class MessorBarbarus extends Messor {
    constructor(parameters)
    {
        this.polyGyne = parameters.polyGyne;
    }

    get polyGyne() {
        return this.polyGyne;
    }

    set polyGyne(value) {
        return this.polyGyne = value;
    }
}

module.exports = MessorBarbarus;