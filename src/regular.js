module.exports =  class Regular {

    constructor(nonTerminal, terminal, productions, initial) {
        this.nonTerminal = nonTerminal
        this.terminal = terminal
        this.productions = productions
        this.initial = initial
    }
}