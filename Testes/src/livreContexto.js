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
                    this.nonTerminal.push(newFrom)
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
                        return new Production(production.from, symbol + ' ' + newFrom)
                    })
                    let newProductions3 = productionsSymbol.map(production => {
                        let toArray = production.to.split(' ')
                        if(toArray.length > 1) {
                            return new Production(newFrom,production.to.replace(symbol + ' ',''))
                        } else {
                            if(this.terminal.indexOf("&") === -1)
                                this.terminal.push("&")
                            return new Production(newFrom,"&")
                        }
                        
                    })
                    newProductions2.forEach(production => {
                        let temp = newProductions.filter(newproduction => newproduction.to === production.to && newproduction.from === production.from)
                        if(temp.length === 0)
                            newProductions.push(production)
                        })
                    newProductions3.forEach(production => newProductions.push(production))
                    this.productions = newProductions
                }
            })
        })
        return new LivreContexto(this.nonTerminal,this.terminal,this.productions,this.initial)
    }

    recursaoEsquerda() {
        this.nonTerminal.forEach(nonTerminalTemp => {
            const productionsNonTerminal = this.productions.filter(production => production.from === nonTerminalTemp)   
            let alpha = []
            let beta = ''
            let recursao = false
            productionsNonTerminal.forEach(production => {
                if(production.to.substring(0,1) === nonTerminalTemp) {
                    recursao = true
                }
            })
            productionsNonTerminal.forEach(production => {
                if(recursao && production.to.substring(0,1) === nonTerminalTemp) {
                    alpha.push(production.to.replace(nonTerminalTemp,''))
                } else if(recursao && !production.to.includes(nonTerminalTemp)) {
                    beta = production.to
                }
            })
            if(recursao) {
                let productionsWithoutNonTerminalTemp = this.productions.filter(production => production.from !== nonTerminalTemp)
                let newFrom = nonTerminalTemp + '`'
                productionsWithoutNonTerminalTemp.push(new Production( nonTerminalTemp, beta + ' ' + newFrom ))
                alpha.forEach( newTo => {
                    productionsWithoutNonTerminalTemp.push(new Production( newFrom, newTo + ' ' + newFrom))
                })
                productionsWithoutNonTerminalTemp.push(new Production( newFrom, "&"))
                this.terminal.push("&")
                this.nonTerminal.push(newFrom)
                this.productions = productionsWithoutNonTerminalTemp
            }
        })
        return new LivreContexto(this.nonTerminal,this.terminal,this.productions,this.initial)
    }

    getTotalProduction() {
        let temp = []
        this.nonTerminal.forEach((nTerminal,index) => {
            let newProduction = this.productions.filter(production => production.from === nTerminal)
            newProduction.forEach(production => {
                let tempProduction = production.to.split(' ')
                if(temp[index]) temp[index][1] = temp[index][1] + '|' + tempProduction.join('')
                else temp[index] = [nTerminal,tempProduction.join('')]
            })
        })
        return temp
    }

    setProductions(from,transitions) {
        let newProduction = this.productions.filter(production=> production.from !== from)
        let newTransitions = transitions.split('|')
        newTransitions.forEach(transitions => {
            let temp = []
            for (let i = 0 ; i < transitions.length ; ++i) {
                if(transitions.substring(i,i+1).search(/[a-z]/i) !== -1)
                    temp.push(transitions.substring(i,i+1))
            }
            newProduction.push(new Production(from,temp.join(' ')))
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
            if(production.to) {
            let temp = production.to.match(/[a-z]/g)
                if(temp) {
                    temp.forEach(terminal => {
                        if(newTerminal.indexOf(terminal) === -1 ) { 
                            newTerminal.push(terminal)
                        }
                    })
                }
            }

        })
        return new LivreContexto(this.nonTerminal,newTerminal,newProductionOrdened,this.initial)
    }
}