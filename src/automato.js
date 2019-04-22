const Transition = require('./transition');

module.exports = class Automato {
    
    constructor(states,alphabet,transitions,initial,finals) {
        this.states = states
        this.alphabet = alphabet
        this.transitions = transitions
        this.initial = initial
        this.finals = finals
    }

    isDeterministic() {
        for(let i = 0; i < this.transitions.length - 1; ++i)
            if(this.transitions[i].to.includes(','))
                return false
        return true
    }

    determinize() {
        // Verifica se o automato é deterministico
        if(!this.isDeterministic())
            // percorro o laço em busca da transição não deterministica
            for(let i = 0; i < this.transitions.length; ++i) {
                if(!this.transitions[i].to.includes(','))
                    continue    
                // atribuindo valor da transição não deterministica na constante from    
                const from = this.transitions[i].to
                for(let j = 0 ; j < this.transitions.length; ++j) {
                    if(!from.includes(this.transitions[j].from))
                        continue
                    /*Criação das transições novas e agora no laço do alfabeto*/
                } 
            }
    }
}