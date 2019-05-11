const Production = require('./src/production')
const Regular = require('./src/regular')

function testeGRAfnd() {
    let nonTerminal = ["S","A","B","C","D"]
    let terminal = ["a","b","c"]
    let productions = [
        new Production("S","a S"),
        new Production("S","b A"),
        new Production("S","c B"),
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
    let regular = new Regular(nonTerminal,terminal,productions,initial)
    console.log(regular.transformRegularToAutomato())
}
testeGRAfnd()