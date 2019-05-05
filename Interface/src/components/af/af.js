import React, { Component } from 'react'
import './af.css'
import Automato from '../../models/automato'
import Transition from '../../models/transition'
import Swal from 'sweetalert2'

export default class af extends Component {
  constructor(props) {
    super(props)
    const states = []
    const alphabet = []
    const transitions = []
    const start = ''
    const final = []
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

  handleCreateTable = async () => {
    let {value : size } = await Swal.fire({
      title: 'Insira os Estados e Entradas',
      html:
        `
        <div style="display: flex;flex-direction: row; justify-content: space-around">
          <input id="swal-input1" max="20" min="1" type="number" placeholder="Estados" class="swal2-input"> 
          <input id="swal-input2" max="20" min="1" type="number" placeholder="Entradas" class="swal2-input">
        <div>
        `,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ]
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Insira valores corretor!'
        }
      }
    })
    if(size)
      this.createTable(size[0],size[1])
  }

  createTable = (numStates,numInputs) => {
    let transitions = []
    let alphabet = []
    let states = []
    for(let i = 0 ; i < numStates; ++i) {
      for(let j = 0; j < numInputs; ++j) {
        transitions = [...transitions, new Transition('q'+ i,'',j)]
        if(alphabet.indexOf(j.toString()) === -1)
          alphabet.push(j.toString())
        if(states.indexOf('q' + i) === -1)
          states.push('q' + i)
      }
    }
    let newAutomato = new Automato(states,alphabet,transitions,states[0],[])
    this.setState({automato: newAutomato})
  }

  handleChangeCell = (e,symbol,state) => {
    this.setState({automato: this.state.automato.setTransition(state,symbol,e.target.value)})
  }
  
  handleFinalState = (e) => {
    this.setState({automato: this.state.automato.setFinalState(e.target.getAttribute('value'))})
  }

  readSingleFile = (e) => {
      let newAutomato = {}
      const file = e.target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = JSON.parse(e.target.result)
        newAutomato = new Automato(contents.states,contents.alphabet,contents.transitions,contents.initial,contents.finals)
        this.setState({automato: newAutomato})
      }
      reader.readAsText(file)
  }

  writeSingleFile = () => {
    if(this.state.automato) {
      const a = document.createElement("a")
      const file = new Blob([JSON.stringify(this.state.automato)], {type: 'application/json'})
      a.href = URL.createObjectURL(file)
      a.download = 'automato.json'
      a.click()
    }
  }

  handleChangeSymbol = async (e) => {
    const symbol = e.target.value
    let {value: input} = await Swal.fire({
      title: 'insira a nova Entrada',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || (this.state.automato.alphabet.indexOf(value) !== -1) ) {
          return 'Insira um valor para entrada ou valor que seja diferente'
        }
      }
    })
    if (input) {
      let newAutomato = this.state.automato.setSymbol(symbol,input)
      this.setState({automato: newAutomato})
    }
  }

  render() {
    return (
      <div>
        <div className="container-buttons-menu-af">
          <button onClick={this.handleDeterminize}>Determinize</button>
          <button onClick={this.handleCreateTable}>Criar Tabela de Transição</button>
          <div>
            <label htmlFor='selecao-arquivo'>Importar</label>
            <input id='selecao-arquivo' type="file" onChange={this.readSingleFile}/>
          </div>
          <button onClick={this.writeSingleFile}>Exportar</button>
        </div>
        <div className="container">
          <div className="table">
            <div className="headerTable">
              <div className="cellTable">*</div>
              {this.state.automato.alphabet.map((symbol,key) => (
                <input className="cellTable" key={key} value={symbol} onClick={this.handleChangeSymbol}/>
              ))}
            </div>
            <div className="bodyTable">
                {this.state.automato.states.map((state,linha) => (
                  <div className="lineTable" key={linha}>
                    <div className="cellTable" value={state} onClick={this.handleFinalState}>
                    {this.state.automato.initial.indexOf(state) !== -1 ? '->' : ''}
                    {this.state.automato.finals.indexOf(state) !== -1 ? '*' + state : state}
                    </div>
                    {this.state.automato.alphabet.map((symbol,coluna) => (
                      <input className="cellTable" onChange={(e) => this.handleChangeCell(e,symbol,state)}
                       key={coluna} value={this.state.automato.getTransition(state,symbol)}/>
                    ))}
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

/*
Swal.fire({
  title: 'Custom width, padding, background.',
  width: 600,
  padding: '3em',
  background: '#fff url(/images/trees.png)',
  backdrop: `
    rgba(0,0,123,0.4)
    url("/images/nyan-cat.gif")
    center left
    no-repeat
  `
})
*/