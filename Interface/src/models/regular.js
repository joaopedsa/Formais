import Transition from './transition'
import Production from './production'

export default class Regular {

    constructor(nonTerminal, terminal, productions, initial) {
        this.nonTerminal = nonTerminal
        this.terminal = terminal
        this.productions = productions
        this.initial = initial
    }
    
    getTotalProduction() {
        let sentenca = []
        this.nonTerminal.forEach((nTerminal,index) => {
            let newProduction = this.productions.filter(production => production.from === nTerminal)
            newProduction.forEach(production => {
                if(sentenca[index]) sentenca[index][1] = sentenca[index][1] + '|' + production.to.replace(' ','')
                else sentenca[index] = [nTerminal,production.to.replace(' ','')]
            })
        })
        return sentenca
    }

    setProductions(from,transitions) {
        let newProduction = this.productions.filter(production=> production.from !== from)
        let newTransitions = transitions.split('|')
        newTransitions.forEach(transitions => {
            if(transitions.substring(1,2)) {
                newProduction.push(new Production(from,transitions.substring(0,1) + ' ' + transitions.substring(1,2)))
            } else {
                newProduction.push(new Production(from,transitions.substring(0,1)))
            }
        })
        let newProductionOrdened = []

        this.nonTerminal.forEach(nTerminal => {
            let temp = newProduction.filter(production => production.from === nTerminal)
            temp.forEach(production => {
                newProductionOrdened.push(production)
            })
        })
        let newTerminal = []
        newProductionOrdened.forEach(production => {
            if(production.to && newTerminal.indexOf(production.to.match(/[a-z]/).join()) === -1)
                newTerminal.push(production.to.match(/[a-z]/).join())
        })
        return new Regular(this.nonTerminal,newTerminal,newProductionOrdened,this.initial)
    }

    transformRegularToAutomato() {
        let newAutomato = {
            states: [],
            alphabet: [],
            transitions: [],
            initial: '',
            finals:[]
        }
        this.nonTerminal.forEach( (state,index) => {
            if(newAutomato.states.length === 0) {
                newAutomato.initial = 'q' + index
                newAutomato.states.push('q'+ index)
            } else {
                newAutomato.states.push('q'+ index)
            } 
        })
        newAutomato.states.push('q' + newAutomato.states.length)
        newAutomato.finals.push('q' + (newAutomato.states.length - 1))
        newAutomato.alphabet = this.terminal
        this.nonTerminal.forEach( (state,index) => {
            let newProduction
            newProduction = this.productions.filter(production => production.from === state)
            newProduction.forEach(production => {
                const toSymbol = production.to.split(' ')
                const symbol = toSymbol[0]
                let to = toSymbol[1]
                if(to) {
                    this.nonTerminal.forEach((state,index) => {
                        if(to === state) to = 'q' + index
                    })
                }
                newAutomato.transitions.push(new Transition('q' + index, to ? to : '', symbol))
                newAutomato.states.forEach(state => {

                    let newTransitions = newAutomato.transitions.filter(transition => transition.from === state)

                    for (let i = 0; i < newTransitions.length-1 ; ++i) {
                        for (let j = i + 1 ; j < newTransitions.length ; ++j) {
                            if (newTransitions[i].symbol === newTransitions[j].symbol) {
                                
                                if (newTransitions[i].to) {
                                    newTransitions[i].to = newTransitions[i].to + ',' + newAutomato.finals[0]
                                }
                                newAutomato.transitions = newAutomato.transitions.filter(transition => {
                                    if(newTransitions[j].symbol === transition.symbol && transition.from === newTransitions[j].from && !transition.to) 
                                        return false
                                    return true
                                })
                            }   
                        }
                    }
                })
            })
        })
        newAutomato.finals = newAutomato.finals.filter(final => final)
        newAutomato.states.forEach(state => {
            newAutomato.alphabet.forEach(symbol => {
                let achou = false
                for(let i = 0 ; i < newAutomato.transitions.length ; ++i) {
                    if(newAutomato.transitions[i].from === state && newAutomato.transitions[i].symbol === symbol)
                        achou = true
                }
                if(!achou)
                    newAutomato.transitions.push(new Transition(state,'',symbol))
            })  
        })
        newAutomato.transitions = newAutomato.transitions.filter(transition => transition.symbol)
        return newAutomato
    }
}