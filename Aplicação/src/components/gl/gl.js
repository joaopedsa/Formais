import React, { Component } from 'react'
import './gl.css'
import Swal from 'sweetalert2';

import Production from '../../models/production'
import { newGramatica, fatoracao, recursao } from '../../actions/glActions'

import { connect } from 'react-redux'
import LivreContexto from '../../models/livreContexto';

class gl extends Component {

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
      let livreContexto = new LivreContexto(['S'],[],[],'S')
      livreContexto.productions.push(new Production('S',''))
      for(let i = 0 ; i < size-1 ; ++i) {
        livreContexto.nonTerminal.push(String.fromCharCode('a'.charCodeAt(0)+i).toUpperCase())
        livreContexto.productions.push(new Production(String.fromCharCode('a'.charCodeAt(0)+i).toUpperCase(),''))
      }
      this.props.newGramatica(livreContexto)
  }

  readSingleFileLivre = (e) => {
      let newLivre = {}
      const file = e.target.files[0];
      if (!file) {
          return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
          const contents = JSON.parse(e.target.result)
          if(contents.nonTerminal) {
              newLivre = new LivreContexto(contents.nonTerminal,contents.terminal,contents.productions,contents.initial)
              this.props.newGramatica(newLivre)
          }
      }
      reader.readAsText(file)
  }

  handleChangeSentenca = (e,from) => {
    this.props.newGramatica(this.props.livreContexto.setProductions(from,e.target.value))
  }

  writeSingleFile = () => {
    if(this.props.livreContexto) {
      const a = document.createElement("a")
      const file = new Blob([JSON.stringify(this.props.livreContexto)], {type: 'application/json'})
      a.href = URL.createObjectURL(file)
      a.download = 'livreContexto.json'
      a.click()
    }
  }

  render() {
    return (
        <div className="container-gr">
          <div className="container-buttons-menu-af">
            <button onClick={this.handleCreateSentenças}>Criar Produções</button>
            <button onClick={this.props.fatoracao} >Fatoração</button>
            <button onClick={this.props.recursao} >Recursão à esquerda</button>
            <button onClick={this.writeSingleFile}>Exportar</button>
            <label htmlFor='selecao-arquivo-livre'>Importar</label>
            <input id='selecao-arquivo-livre' type="file" onChange={this.readSingleFileLivre}/>
          </div>
          <div className="container-gramatica">
            <div>  
              {this.props.livreContexto.getTotalProduction().map((sentenca,key) => (
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
    livreContexto: state.structProps.livreContexto
  }
}

export default connect(mapStateToProps,{ newGramatica, fatoracao, recursao })(gl)
