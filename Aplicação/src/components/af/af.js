import React, { Component } from 'react'
import './af.css'

import { connect } from 'react-redux'
import { determinize, transformToGramatica, newAutomato } from '../../actions/afActions'
import Swal from 'sweetalert2';
import Automato from '../../models/automato';
import Transition from '../../models/transition';

class af extends Component {

  handleCreateTable = async (type) => {
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
                return 'Insira valores corretamente!'
            }
        }
    })
    if(size)
        this.createTable(size[0],size[1],type)
  }

  createTable = (numStates,numInputs,type) => {
    let transitions = []
    let alphabet = []
    let states = []
    for(let i = 0 ; i < numStates; ++i) {
      for(let j = 0; j < numInputs; ++j) {
        transitions = [...transitions, new Transition('q'+ i,'',j.toString())]
        if(alphabet.indexOf(j.toString()) === -1)
            alphabet.push(j.toString())
        if(states.indexOf('q' + i) === -1)
            states.push('q' + i)
      }
    }
    let newAutomato = new Automato(states,alphabet,transitions,states[0],[])
    this.props.newAutomato(newAutomato,type)
  }

  handleChangeSymbol = async (e) => {
    const symbol = e.target.value
    let {value: input} = await Swal.fire({
        title: 'insira a nova Entrada',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
        if (!value || (this.props.automato.alphabet.indexOf(value) !== -1) ) {
            return 'Insira um valor para entrada ou valor que seja diferente'
        }
        }
    })
    if (input) {
        let newAutomato = this.props.automato.setSymbol(symbol,input)
        this.props.newAutomato(newAutomato)
    }
  }

  handleChangeCell = (e,symbol,state) => {
    this.props.newAutomato(this.props.automato.setTransition(state,symbol,e.target.value))
  }

  handleFinalState = (e) => {
    this.props.newAutomato(this.props.automato.setFinalState(e.target.getAttribute('value')))
  }

  readSingleFileAutomato = (e) => {
    let newAutomato = {}
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const contents = JSON.parse(e.target.result)
        if(contents.states) {
            newAutomato = new Automato(contents.states,contents.alphabet,contents.transitions,contents.initial,contents.finals)
            this.props.newAutomato(newAutomato)
        }
    }
    reader.readAsText(file)
}

  writeSingleFile = () => {
    if(this.props.automato) {
      const a = document.createElement("a")
      const file = new Blob([JSON.stringify(this.props.automato)], {type: 'application/json'})
      a.href = URL.createObjectURL(file)
      a.download = 'automato.json'
      a.click()
    }
  }
  
  /*métodos para manipulação do segundo automato*/
  handleChangeSymbol2 = async (e,type) => {
    const symbol = e.target.value
    let {value: input} = await Swal.fire({
        title: 'insira a nova Entrada',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
        if (!value || (this.props.automato2.alphabet.indexOf(value) !== -1) ) {
            return 'Insira um valor para entrada ou valor que seja diferente'
        }
        }
    })
    if (input) {
        let newAutomato = this.props.automato2.setSymbol(symbol,input)
        this.props.newAutomato(newAutomato,type)
    }
  }

  handleChangeCell2 = (e,symbol,state,type) => {
    this.props.newAutomato(this.props.automato2.setTransition(state,symbol,e.target.value),type)
  }

  handleFinalState2 = (e,type) => {
    this.props.newAutomato(this.props.automato2.setFinalState(e.target.getAttribute('value')),type)
  }

  handleUniao = () => {
    if(this.props.automato && this.props.automato2) {
      this.props.newAutomato(this.props.automato.uniaoAutomato(this.props.automato2))
      this.props.newAutomato(new Automato([],[],[],'',[]),2)
    }
  }


  render() {
    return (
      <div>
        <div className="container-buttons-menu-af">
          <button onClick={this.props.determinize}>Determinize</button>
          <button onClick={this.handleCreateTable}>Criar Tabela de Transição</button>
          <button onClick={() => this.handleCreateTable(2)}>Criar Tabela de Transição 2</button>
          <button onClick={this.handleCreateTable}>Minimização</button>
          <button onClick={this.handleUniao}>União</button>
          <button onClick={this.handleCreateTable}>Intersecção</button>
          <label htmlFor='selecao-arquivo'>Importar</label>
          <input id='selecao-arquivo' type="file" onChange={this.readSingleFileAutomato}/>
          <button onClick={this.writeSingleFile}>Exportar</button>
          <button onClick={this.props.transformToGramatica}>Tranformar para GR</button>
        </div>
        <div className="container">
          <div className="table">
            <div className="headerTable">
              {this.props.automato.states.length > 0 ? <div className="cellTable">*</div> : ''}
              {this.props.automato.alphabet.map((symbol,key) => (
                <input className="cellTable" key={key} value={symbol} onClick={this.handleChangeSymbol}/>
              ))}
            </div>
            <div className="bodyTable">
                {this.props.automato.states.map((state,linha) => (
                  <div className="lineTable" key={linha}>
                    <div className="cellTable" value={state} onClick={this.handleFinalState}>
                    {this.props.automato.initial.indexOf(state) !== -1 ? '->' : ''}
                    {this.props.automato.finals.indexOf(state) !== -1 ? '*' + state : state}
                    </div>
                    {this.props.automato.alphabet.map((symbol,coluna) => (
                      <input className="cellTable" onChange={(e) => this.handleChangeCell(e,symbol,state)}
                       key={coluna} value={this.props.automato.getTransition(state,symbol)}/>
                    ))}
                    </div>
                ))}
            </div>
          </div>

          <div className="table">
            <div className="headerTable">
              {this.props.automato2.states.length > 0 ? <div className="cellTable">*</div> : ''}
              {this.props.automato2.alphabet.map((symbol,key) => (
                <input className="cellTable" key={key} value={symbol} onClick={(e) => this.handleChangeSymbol2(e,2)}/>
              ))}
            </div>
            <div className="bodyTable">
                {this.props.automato2.states.map((state,linha) => (
                  <div className="lineTable" key={linha}>
                    <div className="cellTable" value={state} onClick={(e) => this.handleFinalState2(e,2)}>
                    {this.props.automato2.initial.indexOf(state) !== -1 ? '->' : ''}
                    {this.props.automato2.finals.indexOf(state) !== -1 ? '*' + state : state}
                    </div>
                    {this.props.automato2.alphabet.map((symbol,coluna) => (
                      <input className="cellTable" onChange={(e) => this.handleChangeCell2(e,symbol,state,2)}
                       key={coluna} value={this.props.automato2.getTransition(state,symbol)}/>
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

const mapStateToProps = (state) => {
  return {
    automato: state.structProps.automato,
    automato2: state.structProps.automato2
  }
}

export default connect(mapStateToProps, {determinize, transformToGramatica, newAutomato})(af)