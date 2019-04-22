module.exports = class Automato {
    
    constructor(states,alphabet,transitions,initial,finals) {
        this.states = states
        this.alphabet = alphabet
        this.transitions = transitions
        this.initial = initial
        this.finals = finals
    }

    isDeterministic() {
        for(let i = 0; i < this.transitions.length ; ++i) {
            if(this.transitions[i].to.includes(',')) return false
        }
        return true
    }

    determinize() {
        if(isDeterministic()) {
            
        }
    }

}