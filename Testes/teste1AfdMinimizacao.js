const Automato = require('./src/automato')
const Transition = require('./src/transition')

function testMinimizacao () {
    let automato = null
    /*
    q0 = A
    q1 = B
    q2 = C
    q3 = D
    q4 = E
    q5 = F
    q6 = G
    q7 = H
    */
    const states = [ 'q0', 'q1', 'q2' ,'q3','q4','q5','q6','q7']
    const alphabet = [ '0', '1' ]
    const transitions = [
    new Transition('q0', 'q6', '0'),
    new Transition('q0', 'q1', '1'),
    new Transition('q1', 'q5', '0'),
    new Transition('q1', 'q4', '1'),
    new Transition('q2', 'q2', '0'),
    new Transition('q2', 'q6', '1'),
    new Transition('q3', 'q0', '0'),
    new Transition('q3', 'q7', '1'),
    new Transition('q4', 'q4', '0'),
    new Transition('q4', 'q0', '1'),
    new Transition('q5', 'q1', '0'),
    new Transition('q5', 'q2', '1'),
    new Transition('q6', 'q6', '0'),
    new Transition('q6', 'q5', '1'),
    new Transition('q7', 'q7', '0'),
    new Transition('q7', 'q3', '1'),
    ]
    const start = 'q0'
    const final = ['q0','q3','q6']
    automato = new Automato(states, alphabet, transitions, start, final)
    console.log(automato.determinize())
}
testMinimizacao()
