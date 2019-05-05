module.exports =  class Production {

    contructor(from, to) {
        this.from = from
        this.to = to
    }

    getProduction() {
        return [this.from,this.to]
    }
}