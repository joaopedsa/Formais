const Production = require('./src/production')
const LivreContexto = require('./src/livreContexto')

function testeGRAfnd() {
    let nonTerminal = ["S","A","B","C","D"]
    let terminal = ["a","b","c"]
    let productions = [
        new Production("S","a S"),
        new Production("S","b A"),
        new Production("S","a B"),
        new Production("A","a S"),
        new Production("A","b S"),
        new Production("A","c S"),
        new Production("B","a S"),
        new Production("B","b A"),
        new Production("B","c B"),
        new Production("C","c C"),
        new Production("C","c"),
        new Production("C","a D"),
        new Production("D","a S"),
        new Production("D","a"),
    ]
    let initial = "S"
    let livreContexto = new LivreContexto(nonTerminal,terminal,productions,initial)
    console.log(livreContexto.fatoracao())
}
testeGRAfnd()