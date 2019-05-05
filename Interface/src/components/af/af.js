import React, { Component } from 'react'
import './af.css'

export default class af extends Component {

  writeSingleFile = () => {
    if(this.props.automato) {
      const a = document.createElement("a")
      const file = new Blob([JSON.stringify(this.props.automato)], {type: 'application/json'})
      a.href = URL.createObjectURL(file)
      a.download = 'automato.json'
      a.click()
    }
  }

  render() {
    return (
      <div>
        <div className="container-buttons-menu-af">
          <button onClick={this.props.main.handleDeterminize}>Determinize</button>
          <button onClick={this.props.main.handleCreateTable}>Criar Tabela de Transição</button>
          <div>
            <label htmlFor='selecao-arquivo'>Importar</label>
            <input id='selecao-arquivo' type="file" onChange={this.props.main.readSingleFile}/>
          </div>
          <button onClick={this.writeSingleFile}>Exportar</button>
          <button onClick={this.props.main.handleTransformAutomatoToRegular}>Tranformar para GR</button>
        </div>
        <div className="container">
          <div className="table">
            <div className="headerTable">
              <div className="cellTable">*</div>
              {this.props.automato.alphabet.map((symbol,key) => (
                <input className="cellTable" key={key} value={symbol} onClick={this.props.main.handleChangeSymbol}/>
              ))}
            </div>
            <div className="bodyTable">
                {this.props.automato.states.map((state,linha) => (
                  <div className="lineTable" key={linha}>
                    <div className="cellTable" value={state} onClick={this.props.main.handleFinalState}>
                    {this.props.automato.initial.indexOf(state) !== -1 ? '->' : ''}
                    {this.props.automato.finals.indexOf(state) !== -1 ? '*' + state : state}
                    </div>
                    {this.props.automato.alphabet.map((symbol,coluna) => (
                      <input className="cellTable" onChange={(e) => this.props.main.handleChangeCell(e,symbol,state)}
                       key={coluna} value={this.props.automato.getTransition(state,symbol)}/>
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