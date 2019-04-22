const Automato = require('../automato')
const Transition = require('../transition')


function test () {
    let automato = null
    const states = [ 'q0', 'q1', 'q2', 'q3', 'q4' ]
    const alphabet = [ 'a', 'b' ]
    const transitions = [
    new Transition('q0', 'q1', 'a'),
    new Transition('q0', 'q1', 'b'),
    new Transition('q2', 'q4', 'a'),
    new Transition('q2', 'q0', 'b')
    ]
    const start = 'q0'
    const final = [ 'q4' ]
    automato = new Automato(states, alphabet, transitions, start, final)
    console.log(automato.isDeterministic())
}
test()