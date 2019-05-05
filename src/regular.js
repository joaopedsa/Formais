const Automato = require('./automato')
const Transition = require('./transition')

module.exports =  class Regular {

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
                if(sentenca[index]) sentenca[index] = sentenca[index] + '|' + production.to.replace(' ','')
                else sentenca[index] = nTerminal + ' -> '+ production.to.replace(' ','')
            })
        })
        return sentenca
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
            if(newAutomato.states) {
                newAutomato.initial = 'q' + index
                newAutomato.states.push('q'+ index)
            } else {
                newAutomato.states.push('q'+ index)
            } 
        })
        newAutomato.alphabet = this.terminal
        this.nonTerminal.forEach( (state,index) => {
            let newProduction
            newProduction = this.productions.filter(production => production.from === state)
            console.log(newProduction)
            newProduction.forEach(production => {
                const toSymbol = production.to.split(' ')
                const symbol = toSymbol[0]
                const to = toSymbol[1]
                if(!to)
                    
                newAutomato.transitions.push(new Transition('q' + index, to ? to : '', symbol))
            })
        })
        console.log(newAutomato)
    }
}