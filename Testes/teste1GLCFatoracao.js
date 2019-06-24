const Production = require('./src/production')
const LivreContexto = require('./src/livreContexto')

function testeGRAfnd() {
    let nonTerminal = ["S","B","D"]
    let terminal = ["b","c","d"]
    let productions = [
        new Production("S","b c D"),
        new Production("S","B c d"),
        new Production("B","b B"),
        new Production("B","b"),
        new Production("D","d D"),
        new Production("D","d"),
    ]
    let initial = "S"
    let livreContexto = new LivreContexto(nonTerminal,terminal,productions,initial)
    console.log(livreContexto.fatoracao())
}
testeGRAfnd()