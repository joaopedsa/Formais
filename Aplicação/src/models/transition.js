export default class Transition {
    
    constructor(from, to, symbol) {
        this.from = from
        this.to = to
        this.symbol = symbol
    }

    getTransition() {
        return [this.from,this.to,this.symbol]
    }

}