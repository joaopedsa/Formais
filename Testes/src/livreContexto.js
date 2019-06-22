const Production = require('./production')

module.exports =  class LivreContexto {

    constructor(nonTerminal, terminal, productions, initial) {
        this.nonTerminal = nonTerminal
        this.terminal = terminal
        this.productions = productions
        this.initial = initial
    }

    fatoracao() {
        this.terminal.forEach(symbol => {
            this.nonTerminal.forEach(nonTerminalTemp => {
                const productionsNonTerminal = this.productions.filter(production => production.from === nonTerminalTemp)
                let productionsSymbol = productionsNonTerminal.filter(production => production.to.includes(symbol))
                if(productionsSymbol.length > 1) {
                    const newProductions = this.productions.filter(production => {
                        for(let i = 0 ; i < productionsSymbol.length; ++i) {
                            if(productionsSymbol[i].from === production.from && productionsSymbol[i].to === production.to)
                                return false
                        }
                        return true
                    })
                    const newFrom = productionsSymbol[0].from + '`'
                    let tempProductions = []
                    for(let i = 0; i < productionsSymbol.length ;++i) {
                        if(tempProductions.filter(production => production.to === symbol + ' ' + nonTerminalTemp).length === 0)
                            tempProductions.push(new Production(newFrom, symbol + ' ' + nonTerminalTemp))
                    }
                    let newProductions2 = this.productions.filter(production => {
                        for(let i = 0 ; i < productionsSymbol.length; ++i) {
                            if(productionsSymbol[i].from === production.from && productionsSymbol[i].to === production.to)
                                return true
                        }
                        return false
                    })
                    newProductions2 = newProductions2.map(production => {
                        let newTo = production.to.split(' ')
                        newTo = newTo.filter(to => this.nonTerminal.indexOf(to) !== -1)
                        return new Production(production.from, symbol + ' ' + newFrom)
                    })
                    let newProductions3 = productionsSymbol.map(production => {
                        return new Production(newFrom,production.to.replace(symbol + ' ',''))
                    })
                    newProductions2.forEach(production => newProductions.push(production))
                    newProductions3.forEach(production => newProductions.push(production))
                    this.productions = newProductions
                }
            })
        })
        console.log(this.productions)
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