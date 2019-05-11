module.exports =  class Production {

    constructor(from, to) {
        this.from = from
        this.to = to
    }

    getProduction() {
        return [this.from,this.to]
    }
}