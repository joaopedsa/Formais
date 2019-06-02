const Production = require('./production')

module.exports =  class LivreContexto {

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
            newProduction.push(new Production(from,transitions))
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
        return new LivreContexto(this.nonTerminal,newTerminal,newProductionOrdened,this.initial)
    }
}