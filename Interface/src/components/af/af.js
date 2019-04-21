import React, { Component } from 'react';
import Swal from 'sweetalert2';
import './af.css'


export default class af extends Component {
  
  state = {
    estados: [],
    entradas: [],
    transicoes: []
  };

  atualizaTabela = () => {
    let transicoes = []
    let linha = []
    this.state.estados.forEach( estado => {
      this.state.entradas.forEach( entrada => {
        linha.push('')
      })
      transicoes.push(linha)
      linha = []
    })
    this.setState({
      transicoes: transicoes
    })
  }

  componentDidMount() {
    this.atualizaTabela();
  }

  popUp = async (tipo) => {
    const {value: conjunto} = await Swal.fire({
      title: `Insira o conjunto de ${tipo}`,
      input: 'text',
      inputPlaceholder: 'a,b,c,d,e,f,g',
      inputValidator: (value) => {
        if(!value) return "Insira um valor referente"
      }
    })
    if(conjunto) {
      if(tipo === 'Entradas') {
        this.setState({
          entradas: conjunto.split(',')
        })
      } else {
        this.setState({
          estados: conjunto.split(',')
        })
      }
    }
    this.atualizaTabela()
  }

  render() {
    return (
      <div>
        <button onClick={() => this.popUp('Entradas')}>Entradas</button>
        <button onClick={() => this.popUp('Estados')}>Estados</button>
          <table>
            <thead>
              <td></td>
              {this.state.entradas.map( (entrada, key) => (
                <td key={key}>
                  {entrada}
                </td>
              ))}
            </thead>
            <tbody>
              {!this.state.transicoes ? null : this.state.transicoes.map( (transicao, index,key) => (
                <tr key={key}>
                  <th>
                    {this.state.estados[index]}
                  </th>
                  {transicao.map( (linha, key) => (
                    <td key={key}><div>{linha}</div></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    )
  }
}
