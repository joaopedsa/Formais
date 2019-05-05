import React, { Component } from 'react';
import './gr.css';
// import { Container } from './styles';

export default class gr extends Component {

  writeSingleFile = () => {
    if(this.props.regular) {
      const a = document.createElement("a")
      const file = new Blob([JSON.stringify(this.props.regular)], {type: 'application/json'})
      a.href = URL.createObjectURL(file)
      a.download = 'automato.json'
      a.click()
    }
  }

  render() {
    return (
        <div className="container-gr">
          <div className="container-buttons-menu-af">
            <button>Transformar para Automato Finito</button>
            <button>Exportar</button>
            <div>
              <label htmlFor='selecao-arquivo'>Importar</label>
              <input id='selecao-arquivo' type="file"/>
            </div>
          </div>
          <div className="container-gramatica">
            <div>  
              {this.props.regular.getTotalProduction().map((sentenca,key) => (
                <div key={key}>
                  <input className="sentenca" value={sentenca} onChange={this.props.main.handleChangeSentenca}/>
                </div>                
              ))}
            </div>
          </div>
        </div>
    )
  }
}
