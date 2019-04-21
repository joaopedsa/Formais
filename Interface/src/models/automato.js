module.exports = class Automato {
    
    constructor(states,alphabet,transitions,initial,finals) {
        this.states = states
        this.alphabet = alphabet
        this.transitions = transitions
        this.initial = initial
        this.finals = finals
    }

    isDeterministic() {
        this.transitions.forEach(element => {
            console.log(element)
        });
    }

}