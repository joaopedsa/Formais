import React, { Component, Fragment } from 'react'
import './af.css'
import Automato from '../../models/automato'
import Transition from '../../models/transition'
import Swal from 'sweetalert2'


export default class af extends Component {
  constructor(props) {
    super(props)
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
    this.state = {
      automato: new Automato(states,alphabet,transitions,start,final),
    }
  }

  handleDeterminize = () => {
    this.setState({automato:this.state.automato.determinize()})
  }

  filterTransitions = (state,symbol) => {
    const newState = this.state.automato.transitions.filter(transition => transition.state === state && transition.symbol === symbol)
    return newState
  }

    render() {
    return (
      <div>
        <button onClick={this.handleDeterminize}>determinize</button>
        <div className="table">
          <div className="headerTable">
            <div className="cellTable">*</div>
            {this.state.automato.alphabet.map((symbol,key) => (
              <input className="cellTable" key={key} value={symbol}></input>
            ))}
          </div>
          <div className="bodyTable">
              {this.state.automato.states.map((state,linha) => (
                <div className="lineTable" key={linha}>
                  <div className="cellTable">{state}</div>
                  {this.state.automato.alphabet.map((symbol,coluna) => (
                    <input className="cellTable" key={coluna} value=
                    {
                      this.state.automato.getTransition(state,symbol)
                    }>
                     </input>
                  ))}
                  </div>
              ))}
          </div>
        </div>
      </div>
    )
  }
}
