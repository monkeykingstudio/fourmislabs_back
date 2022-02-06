class messor {
    constructor(parameters)
    {
        this.trophalaxy = parameters.trophalaxy;
    }

    get trophalaxy() {
        return this.trophalaxy;
    }

    set trophalaxy(value) {
        return this.trophalaxy = value;
    }
}

module.exports = messor;