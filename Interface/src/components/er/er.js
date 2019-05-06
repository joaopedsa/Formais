import React, { Component } from 'react';
import './er.css'

// import { Container } from './styles';

export default class er extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      er:'',
      text:''
    }
  }

  handleChangeText = (e) => {
    this.setState({text: e.target.value})
  }

  handleChangeEr = (e) => {
    this.setState({er: e.target.value})
  }
  
  readSingleFileExpression = (e) => {
    const file = e.target.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const contents = JSON.parse(e.target.result)
        if(contents.er) {
            this.setState({er: contents.er})
        }
    }
    reader.readAsText(file)
  }

  writeSingleFile = () => {
    if(this.state.er) {
      const a = document.createElement("a")
      const file = new Blob([JSON.stringify(this.state)], {type: 'application/json'})
      a.href = URL.createObjectURL(file)
      a.download = 'expressao.json'
      a.click()
    }
  }

  render() {
    return (
        <div>
        <div className="container-buttons-menu-af">
          <div>
            <label htmlFor='selecao-arquivo'>Importar</label>
            <input id='selecao-arquivo' type="file" onChange={this.readSingleFileExpression}/>
          </div>
          <button onClick={this.writeSingleFile}>Exportar</button>
        </div>
          <div className="container-inputs">
            <p>Expressão regular:</p>
            <input onChange={this.handleChangeEr} value={this.state.er} placeholder={'aaa'}></input>
          </div>
        </div>
    );
  }
}
