module.exports = class Automato {
    
    constructor(states,alphabet,transitions,initial,finals) {
        this.states = states
        this.alphabet = alphabet
        this.transitions = transitions
        this.initial = initial
        this.finals = finals
    }

    isDeterministic() {
        if(this.alphabet.includes('&')) return false
        for(let i = 0; i < this.transitions.length ; ++i) {
            if(this.transitions[i].to.split(',').length > 1) {
                return false
            }
        }
        return true
    }

    determinize() {
        
    }

}