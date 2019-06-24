import Transition from './transition'
import Production from './production'
import Regular from './regular'

export default class Automato {
    
    constructor(states,alphabet,transitions,initial,finals) {
        this.states = states
        this.alphabet = alphabet
        this.transitions = transitions
        this.initial = initial
        this.finals = finals
    }

    uniaoAutomato(automato2) {
        let A1 = this.transformToGramatica()
        let A2 = automato2.transformToGramatica()
        A1.nonTerminal = A1.nonTerminal.map(nTerminal => {
            return nTerminal + "1"
        })
        A1.productions.map(production => {
            production.from = production.from + '1'
            let productionArray = production.to.split(' ') 
            if(productionArray.length === 2)
                production.to = productionArray[0] + ' ' + productionArray[1] + '1';
            return production
        })
        A2.nonTerminal = A2.nonTerminal.map(nTerminal => {
            return nTerminal + "2"
        })
        A2.productions.map(production => {
            production.from = production.from + '2'
            let productionArray = production.to.split(' ') 
            if(productionArray.length === 2)
                production.to = productionArray[0] + ' ' + productionArray[1] + '2';
            return production
        })
        let initial = 'S'
        let initialProductionsS1 = A1.productions.filter(production => production.from === 'S1')
        let initialProductionsS2 = A2.productions.filter(production => production.from === 'S2')
        let productions = []
        for(let i = 0; i < initialProductionsS1.length; ++i ) {
            productions.push(new Production(initial,initialProductionsS1[i].to))
        }
        for(let i = 0; i < initialProductionsS2.length; ++i ) {
            productions.push(new Production(initial,initialProductionsS2[i].to))
        }
        let newNonTerminal = [initial]
        let newTerminal = A1.terminal
        for(let i = 0 ; i < A1.nonTerminal.length; ++i) {
            newNonTerminal.push(A1.nonTerminal[i])
        }
        for(let i = 0 ; i < A2.nonTerminal.length; ++i) {
            newNonTerminal.push(A2.nonTerminal[i])
        }
        for(let i = 0 ; i < A2.terminal.length; ++i) {
            if(newTerminal.indexOf(A2.terminal[i]) === -1)
                newTerminal.push(A2.terminal[i])
        }
        A1.productions.forEach(production => {
            productions.push(production)
        })
        A2.productions.forEach(production => {
            productions.push(production)
        })

        let numberNonTerminal = 0;
        newNonTerminal = newNonTerminal.map(nonTerminal => {
            if(nonTerminal.search(/[0-9]/) !== -1) {
                productions = productions.map(production => {
                    if(production.from.search(nonTerminal) !== -1) {
                        production.from = String.fromCharCode('a'.charCodeAt(0)+numberNonTerminal).toUpperCase()
                    }
                    if(production.to.search(nonTerminal) !== -1) {
                        let productionArray = production.to.split(' ')
                        production.to = productionArray[0] + ' ' + String.fromCharCode('a'.charCodeAt(0)+numberNonTerminal).toUpperCase()
                    }
                    return production
                })
                numberNonTerminal++;
                return String.fromCharCode('a'.charCodeAt(0) + (numberNonTerminal-1) ).toUpperCase();
            }
            return nonTerminal
        })

        let regular = new Regular(newNonTerminal,newTerminal,productions,initial)
        let automatoObject = regular.transformRegularToAutomato();
        let automato = new Automato(automatoObject.states,automatoObject.alphabet,automatoObject.transitions,automatoObject.initial,automatoObject.finals)
        automato.transitions = automato.transitions.map( transition => {
            transition.to = automato.organizaOrdemStates(transition.to.split(',')).join(',')
            return transition;
        })
        return automato
    }


    /*
        Minimização com 3 passos
        1 passo seria a verificação dos estados inalcançaveis e retirando-os
        2 passo verificar os estados mortos e retirando-os
        3 passo construir classe de equivalencia
    */
    minimizacao() {
        let nonDeadAndReachableStates = this.nonDeadStates(this.reachableStates())
        this.transitions = this.transitions.filter(transition => nonDeadAndReachableStates.indexOf(transition.from) !== -1)
        this.states = this.states.filter(state => nonDeadAndReachableStates.indexOf(state) !== -1)
        this.finals = this.finals.filter(final => nonDeadAndReachableStates.indexOf(final) !== -1)
        this.equivalenceClass()
    }

    /*Constroi estados por classe de equivalencia*/
    equivalenceClass() {
        //primeiro passo separar em duas classes de equivalencia de finais e de não finais
        let classesEquivalencia = [this.states.filter(state => this.finals.indexOf(state) === -1),this.finals]
        this.alphabet.forEach(symbol => {
            for (let i = 0; i < classesEquivalencia.length; ++i) {
                let newClasseEquivalencia = []
                for (let j = 0; j < classesEquivalencia[i].length; ++j) {
                    if(newClasseEquivalencia.length === 0) {
                        newClasseEquivalencia.push([classesEquivalencia[i][j]])
                    } else {
                        newClasseEquivalencia.forEach(classe => {
                            classe.forEach(state => {
                                let transitionClasse = this.transitions.filter(transition => transition.symbol === symbol && transition.from === state)
                                let transitionPossivelClasse = this.transitions.filter(transition => transition.symbol === symbol && transition.from === classesEquivalencia[i][j])
                                if(classesEquivalencia[i].indexOf(transitionClasse.to) === classesEquivalencia[i].indexOf(transitionPossivelClasse.to)) {
                                    classe.push(classesEquivalencia[i][j])
                                } else {
                                    newClasseEquivalencia.push([classesEquivalencia[i][j]])
                                }
                            })
                        })
                        console.log(newClasseEquivalencia)
                    }
                    
                }
            }
        })
    }

    /*retorna os estados alcançaveis*/
    reachableStates() {
        let reachebleStates = [this.initial]
        for(let i = 0 ; i < reachebleStates.length; i++) {
            let transitionsReach = this.transitions.filter(transition => reachebleStates[i] === transition.from)
            transitionsReach.forEach(transition => {
                if(reachebleStates.indexOf(transition.to) === -1)
                    reachebleStates.push(transition.to)
            })
        }
        return reachebleStates
    }

    /*retorna os estados que não são mortos*/
    nonDeadStates(reachebleStates) {
        let nonDeadStates = reachebleStates.filter(state => this.finals.indexOf(state) !== -1)
        const possibleDeadStates = reachebleStates.filter(state => this.finals.indexOf(state) === -1)
        for(let i = 0 ; i < possibleDeadStates.length ; ++i) {
            const transitions = this.transitions.filter(transition => transition.from === possibleDeadStates[i])
            let nonDead = false;
            transitions.forEach(transition => {
                if(nonDeadStates.indexOf(transition.to) !== -1 && nonDeadStates.indexOf(possibleDeadStates[i]) === -1)
                    nonDead = true
            })
            if(nonDead) {
                nonDeadStates.push(possibleDeadStates[i])
            } else {
                transitions.forEach(transition => {
                    let states = this.checkDeadState(possibleDeadStates[i],nonDeadStates,transition.to,0)
                    if(states)
                        nonDeadStates = states
                })
            }
        }
        return nonDeadStates
    }

    /*Verifica se o suposto estado é um estado morto com recursão caso falhe na primeira tentativa*/
    checkDeadState(possibleState,nonDeadStates,state,index) {
        if(index < this.states.length)  { 
            const transitions = this.transitions.filter(transition => transition.from === state)
            transitions.forEach(transition => {
                if(nonDeadStates.indexOf(transition.to) !== -1 && nonDeadStates.indexOf(possibleState) === -1) {
                    return nonDeadStates.push(possibleState)
                } else {
                    index++
                    this.checkDeadState(possibleState,nonDeadStates,transition.to,index)
                }
            })
        } 
        return
    }


    transformToGramatica() {
        let regular = new Regular(['S'],this.alphabet,[],'S')
        if(!this.isDeterministic()) {
            let newAutomato = this.determinize()
            this.states = newAutomato.states
            this.transitions = newAutomato.transitions
            this.finals = newAutomato.finals
        }
        const newStates = this.states.filter(state => {
            return state !== this.initial
        })
        newStates.forEach((state,index) => {
            regular.nonTerminal.push(String.fromCharCode('a'.charCodeAt(0)+index).toUpperCase())
        })
        this.transitions.forEach(transition => {
            if(transition.to)
                if(this.finals.indexOf(transition.to) !== -1) {
                    regular.productions.push(new Production(regular.nonTerminal[ this.states.indexOf(transition.from) ], transition.symbol +' '+ regular.nonTerminal[ this.states.indexOf(transition.to) ]))
                    regular.productions.push(new Production(regular.nonTerminal[ this.states.indexOf(transition.from) ], transition.symbol))
                } else {
                    regular.productions.push(new Production(regular.nonTerminal[ this.states.indexOf(transition.from) ], transition.symbol +' '+ regular.nonTerminal[ this.states.indexOf(transition.to) ]))
                }
        })
        regular.nonTerminal.forEach(nTerminal => {
            let exist = false
            regular.productions.forEach(production => {
                if(production.from === nTerminal)
                    exist = true
            })
            if(!exist) regular.productions.push(new Production(nTerminal,''))
        })
        return regular
    }

    reconhecimentoSentenca(sentenca) {
        let sentencaArray = []
        for (let i = 0; i < sentenca.length; ++i) {
            sentencaArray.push(sentenca.substring(i,i+1))
        }
        let pertence = true
        let stateAtual = this.initial
        sentencaArray.forEach(terminal => {
            let find = false
            let transitionsStateAtual = this.transitions.filter(transition => transition.from === stateAtual)
            transitionsStateAtual.forEach(transition => {
                if(transition.symbol === terminal) {
                    find = true
                    stateAtual = transition.to
                }
            })
            if(!find) {
                pertence = false
            }
        })
        return pertence
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
                return newAutomato
            }
            return this
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
        for(let i = 0; i < this.transitions.length; ++i) {
            if(this.states.indexOf(this.transitions[i].to) === -1 && this.transitions[i].to !== '')
                return false
        }
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
                    let newTo = this.reach(transition.to,newTransitions)
                    fecho = [...fecho, newTo]
                } else {
                    let newTransition = transition.to.split(',')
                    newTransition.splice(index,0,transition.from)
                    let newTo = this.reach(newTransition.join(','),newTransitions)
                    fecho = [...fecho, newTo]
                }
            })
        }
        fecho = this.organizaOrdemFecho(fecho)
        return fecho
    }

    reach(to, transitions) {
        for(let i = 0; i < this.states.length; ++i) {
            if(to && to.includes(this.states[i]))
                to = to + ',' + transitions[i].to
        }
        return to;
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

    getTransition(from, symbol) {
        let transition = []
        transition = this.transitions.filter(transition => transition.from === from && transition.symbol === symbol)
        return transition[0].to
    }
    setTransition(from, symbol, to) {
        let transitions = []
        let newAutomato = new Automato(this.states,this.alphabet,[],this.initial,this.finals)
        transitions = this.transitions.map(transition => {
            if(transition.from !== from || transition.symbol !== symbol){
                return transition
            }
            else {
                transition.to = to
                return transition
            }
        })
        newAutomato.transitions = transitions
        return newAutomato
    }
    setFinalState(state) {
        let newAutomato = new Automato(this.states,this.alphabet,this.transitions,this.initial,[])
        if(this.finals.indexOf(state) === -1) this.finals.push(state)
        else this.finals = this.finals.filter(final => final !== state)
        newAutomato.finals = this.finals
        return newAutomato;
    }
    setSymbol(lastSymbol, newSymbol) {
        let transitions = []
        let alphabet = []
        transitions = this.transitions.map(transition => {
            if(transition.symbol === lastSymbol) {
                return new Transition(transition.from,transition.to,newSymbol)
            }
            return transition
        })
        alphabet = this.alphabet.map(symbol => {
            if(symbol === lastSymbol) {
                return newSymbol
            } 
            return symbol
        })
        return new Automato(this.states,alphabet,transitions,this.initial,this.finals)
    }
}
