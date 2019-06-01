import React, { Component } from 'react'
import './gr.css'
import Regular from '../../models/regular';
import Swal from 'sweetalert2';

import Production from '../../models/production'
import { newGramatica, transformGraticaToAutomato } from '../../actions/grActions'

import { connect } from 'react-redux'

class gr extends Component {

  handleCreateSentenças = async () => {
      let {value: size} = await Swal.fire({
          title: 'insira número de sentenças',
          input: 'number',
          showCancelButton: true,
          inputValidator: (value) => {
          if (!value ) {
              return 'Insira um valor para sentença'
          }
          }
      })
      if(size) {
          this.createSentenças(size)
      }
  }

  createSentenças = (size) => {
      let regular = new Regular(['S'],[],[],'S')
      regular.productions.push(new Production('S',''))
      for(let i = 0 ; i < size-1 ; ++i) {
          regular.nonTerminal.push(String.fromCharCode('a'.charCodeAt(0)+i).toUpperCase())
          regular.productions.push(new Production(String.fromCharCode('a'.charCodeAt(0)+i).toUpperCase(),''))
      }
      this.props.newGramatica(regular)
  }

  readSingleFileRegular = (e) => {
      let newRegular = {}
      const file = e.target.files[0];
      if (!file) {
          return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
          const contents = JSON.parse(e.target.result)
          if(contents.nonTerminal) {
              newRegular = new Regular(contents.nonTerminal,contents.terminal,contents.productions,contents.initial)
              this.props.newGramatica(newRegular)
          }
      }
      reader.readAsText(file)
  }

  handleChangeSentenca = (e,from) => {
    this.props.newGramatica(this.props.regular.setProductions(from,e.target.value))
  }

  writeSingleFile = () => {
    if(this.props.regular) {
      const a = document.createElement("a")
      const file = new Blob([JSON.stringify(this.props.regular)], {type: 'application/json'})
      a.href = URL.createObjectURL(file)
      a.download = 'regular.json'
      a.click()
    }
  }

  render() {
    return (
        <div className="container-gr">
          <div className="container-buttons-menu-af">
            <button onClick={this.handleCreateSentenças}>Criar Sentença</button>
            <button onClick={this.props.transformGraticaToAutomato}>Transformar para Automato Finito</button>
            <button onClick={this.writeSingleFile}>Exportar</button>
            <label htmlFor='selecao-arquivo-regular'>Importar</label>
            <input id='selecao-arquivo-regular' type="file" onChange={this.readSingleFileRegular}/>
          </div>
          <div className="container-gramatica">
            <div>  
              {this.props.regular.getTotalProduction().map((sentenca,key) => (
                <div key={key} className="sentenca-container">
                  <span>{sentenca[0]} -> </span>
                  <input className="sentenca" value={sentenca[1]} onChange={(e) => this.handleChangeSentenca(e,sentenca[0])}/>
                </div>                
              ))}
            </div>
          </div>
        </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    regular: state.structProps.regular
  }
}

export default connect(mapStateToProps,{ newGramatica, transformGraticaToAutomato })(gr)
