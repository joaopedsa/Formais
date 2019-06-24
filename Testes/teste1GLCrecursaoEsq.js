const Production = require('./src/production')
const LivreContexto = require('./src/livreContexto')

function testeGRAfnd() {
    let nonTerminal = ["S","T","F","P"]
    let terminal = ["+","-","*","/","(",")","id","cte"]
    let productions = [
        new Production("S","S + T"),
        new Production("S","S - T"),
        new Production("S","T"),
        new Production("T","T * F"),
        new Production("T","F"),
        new Production("T","T / F"),
        new Production("F","F * * P"),
        new Production("F","P"),
        new Production("P","( E )"),
        new Production("P","id"),
        new Production("P","cte"),
    ]
    let initial = "S"
    let livreContexto = new LivreContexto(nonTerminal,terminal,productions,initial)
    console.log(livreContexto.recursaoEsquerda())
}
testeGRAfnd()