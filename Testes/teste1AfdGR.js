const Automato = require('./src/automato')
const Transition = require('./src/transition')

function testAfdGR () {
    let automato = null
    const states = [ 'q0', 'q1', 'q2' ]
    const alphabet = [ 'a', 'b', 'c', '&' ]
    const transitions = [
        new Transition('q0', 'q0,q1', '&'),
        new Transition('q0', '', 'a'),
        new Transition('q0', 'q1', 'b'),
        new Transition('q0', 'q2', 'c'),
        new Transition('q1', '', '&'),
        new Transition('q1', 'q0', 'a'),
        new Transition('q1', 'q2', 'b'),
        new Transition('q1', 'q0,q1', 'c'),
        new Transition('q2', '', '&'),
        new Transition('q2', '', 'a'),
        new Transition('q2', '', 'b'),
        new Transition('q2', '', 'c')
    ]
    const start = 'q0'
    const final = [ 'q2' ]
    automato = new Automato(states, alphabet, transitions, start, final)
    console.log(automato.transformToGramatica());
}
testAfdGR()