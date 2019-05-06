import React, { Component } from 'react';
import './gr.css';
// import { Container } from './styles';

export default class gr extends Component {

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
            <button onClick={this.props.main.transformGramaticaToAutomato}>Transformar para Automato Finito</button>
            <button onClick={this.writeSingleFile}>Exportar</button>
            <div>
              <label htmlFor='selecao-arquivo-regular'>Importar</label>
              <input id='selecao-arquivo-regular' type="file" onChange={this.props.main.readSingleFileRegular}/>
            </div>
          </div>
          <div className="container-gramatica">
            <div>  
              {this.props.regular.getTotalProduction().map((sentenca,key) => (
                <div key={key}>
                  <input className="sentenca" defaultValue={sentenca} onChange={this.props.main.handleChangeSentenca}/>
                </div>                
              ))}
            </div>
          </div>
        </div>
    )
  }
}
