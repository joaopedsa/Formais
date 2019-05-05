import Automato from './automato'

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
                if(sentenca[index]) sentenca[index] = sentenca[index] + '|' + production.to.replace(' ','')
                else sentenca[index] = nTerminal + ' -> '+ production.to.replace(' ','')
            })
        })
        return sentenca
    }

    transformRegularToAutomato() {
        let newAutomato = new Automato([],[],[],'',[])
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
        })
        console.log(newAutomato)
    }
}