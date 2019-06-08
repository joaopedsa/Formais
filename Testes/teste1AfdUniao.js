const Automato = require('./src/automato')
const Transition = require('./src/transition')

function testUniao () {
    let automato = null
    const states1 = [ 'q0', 'q1', 'q2' ]
    const alphabet1 = [ 'a', 'b', 'c', '&' ]
    const transitions1 = [
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
    const start1 = 'q0'
    const final1 = [ 'q2' ]
    automato = new Automato(states1, alphabet1, transitions1, start1, final1)

    let automato2 = null
    const states2 = [ 'q0', 'q1', 'q2' ]
    const alphabet2 = [ 'a', 'b', 'c', '&' ]
    const transitions2 = [
    new Transition('q0', '', '&'),
    new Transition('q0', 'q0', 'a'),
    new Transition('q0', 'q1', 'b'),
    new Transition('q0', 'q2', 'c'),
    new Transition('q1', 'q0', '&'),
    new Transition('q1', 'q1', 'a'),
    new Transition('q1', 'q2', 'b'),
    new Transition('q1', '', 'c'),
    new Transition('q2', 'q1', '&'),
    new Transition('q2', 'q2', 'a'),
    new Transition('q2', '', 'b'),
    new Transition('q2', 'q0', 'c')
    ]
    const start2= 'q0'
    const final2 = [ 'q2' ]
    automato2 = new Automato(states2, alphabet2, transitions2, start2, final2)
    automato.uniaoAutomato(automato2)
}
testUniao()
