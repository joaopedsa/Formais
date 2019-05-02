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
            let newAutomato
            if(posEpsilon !== -1) {
                let newAlphabet = this.alphabet;
                newAlphabet.splice(posEpsilon,1)
                newAutomato = new Automato([fecho[0]],newAlphabet,[],fecho[0],[])
            } else {
                newAutomato = new Automato(this.states,this.alphabet,[],this.initial,this.finals)
            }
                for(let i = 0; i < newAutomato.states.length; i++) {
                    console.log(newAutomato.states)
                    const state = newAutomato.states[i]
                    let states = state.split(',')
                    let compareTransitions = []
                    compareTransitions = this.transitions.filter(transition => {
                        return states.indexOf(transition.from) > -1 && transition.symbol !== '&'
                    })
                    newAutomato.alphabet.forEach(symbol => {
                        let newTransitions = compareTransitions.filter(transition => transition.symbol === symbol)
                        let newTo = ''
                        newTransitions.forEach(transition => {
                            if(newTo) newTo = newTo + ',' + transition.to
                            else newTo = transition.to
                        })
                        newTo = this.findToFecho(fecho,newTo)
                        newAutomato.transitions = [...newAutomato.transitions,new Transition(state,newTo,symbol)]
                        if(!newAutomato.states.includes(newTo) && newTo)
                            newAutomato.states.push(newTo)
                    })
                }
                newAutomato.states.forEach(state => {
                    newAutomato.finals.forEach(final => {
                        if(state.includes(final) && newAutomato.finals.indexOf(state) === -1)
                            newAutomato.finals.push(state)
                    })
                })
            }
        }
    findState() {
        let state = []
        this.transitions.forEach(transition => {
            if(transition.to.includes(','))
                state.push(transition.to)
        })
    }

    findToFecho(fecho,to) {
        let newTo = ''
        let toArray = to.split(',')
        toArray = this.organizaOrdemStates(toArray)
        toArray.forEach(to => {
            let index = parseInt(to.replace('q',''))
            if(newTo) newTo = newTo + ',' + fecho[index]
            else newTo = fecho[index]
        })
        newTo = newTo.split(',')
        newTo = this.organizaOrdemStates(newTo)
        newTo = newTo.join(',')
        return newTo
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
        fecho = this.organizaOrdemFecho(fecho)
        return fecho
    }

    organizaOrdemFecho(states) {
        states = states.map(state => {
            let newState = ''
            let stateSplit = state.split(',')
            for(let i = 0; i < this.states.length; i++) {
                if(stateSplit.indexOf('q' + i) !== -1) {
                    if(newState) newState = newState + ',' + stateSplit[stateSplit.indexOf('q' + i)]
                    else newState = stateSplit[stateSplit.indexOf('q' + i)]
                }
            }
            return newState
        })
        return states;
    }
    organizaOrdemStates(state) {
        let newState = []
        this.states.forEach((to,index) => {
            if(state.indexOf('q' + index) !== -1) newState.push(state[state.indexOf('q' + index)])
        })
        return newState
    }
}
