const Transition = require('./transition');

module.exports = class Automato {
    
    constructor(states,alphabet,transitions,initial,finals) {
        this.states = states
        this.alphabet = alphabet
        this.transitions = transitions
        this.initial = initial
        this.finals = finals
    }

    determinize() {
        const fecho = this.fechoTransitivo()
        // Verifica se o automato é deterministico
        if(!this.isDeterministic()) {
            const posEpsilon = this.alphabet.indexOf('&')
            if(posEpsilon !== -1) {
                let newAlphabet = this.alphabet;
                newAlphabet.splice(posEpsilon,1)
                let newAutomato = new Automato([fecho[0]],newAlphabet,[],fecho[0],)
                newAutomato.states.forEach(state => {
                    let states = state.split(',')
                    fecho.forEach(caminho => {
                        /*Falta coisa pra caralho amanha é um novo dia*/
                    })
                })
                

            } else {

            }

        }
    }

    isDeterministic() {
        if(this.alphabet.indexOf('&') > -1)
            return false
        for(let i = 0; i < this.transitions.length - 1; ++i)
            if(this.transitions[i].to.includes(','))
                return false
        return true
    }

    fechoTransitivo() {
        let fecho = []
        if(this.alphabet.indexOf('&') === -1) {
            this.transitions.forEach(transition => {
                if(fecho.indexOf(transition.from) === -1)
                    fecho = [...fecho, transition.from]
            })
        } else {
            let newTransitions = this.transitions.filter(transition => transition.symbol === '&')
            newTransitions.forEach((transition, index) => {
                if(transition.to.includes(transition.from)) {
                    fecho = [...fecho, transition.to]
                } else {
                    let newTransition = transition.to.split(',')
                    newTransition.splice(index,0,transition.from)
                    fecho = [...fecho,newTransition.join(',')]
                }
            })
        }
        fecho = this.organizaOrdem(fecho)
        return fecho
    }

    organizaOrdem(states) {
        states = states.map(state => {
            let newState = ''
            let stateSplit = state.split(',')
            for(let i = 0; i < this.states.length; i++) {
                if(stateSplit.indexOf('q' + i) !== -1 ) {
                    if(newState) newState = newState +','+ stateSplit[stateSplit.indexOf('q' + i)]
                    else newState = stateSplit[stateSplit.indexOf('q' + i)]
                }
            }
            return newState
        }) 
        return states;
    }
}
