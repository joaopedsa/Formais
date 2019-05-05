import React, { Component } from 'react';
import './main.css';
import Swal from 'sweetalert2';

import GR from '../../components/gr/gr';
import AF from '../../components/af/af';
import ER from '../../components/er/er';

export default class main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            af: true,
            gr: false,
            er: false
        }
    }
    handlePlostTwist= () => {
        Swal.fire({
          title: 'Em Desenvolvimento',
          width: 600,
          padding: '3em',
          background:' rgba(0,0,123,0.05)',
          backdrop: `
            rgba(0,0,123,0.4)
            url("https://thumbs.gfycat.com/ScaryMassiveGallowaycow-max-1mb.gif")
            center left
            no-repeat
          `,})
      }
    handleChangeState = (e) => {
        if(parseInt(e.target.value) === 1) this.setState({af : true, gr: false, ef: false})
        if(parseInt(e.target.value) === 2) this.setState({af : false, gr: true, ef: false})
        if(parseInt(e.target.value) === 3) this.setState({af : false, gr: false, ef: true})
    }
    render() {
        let state = ''
        if(this.state.af) state = <AF/>
        if(this.state.gr) state = <GR/>
        if(this.state.er) state = <ER/>
        return (
            <div>
                <div className="container-buttons-menu">
                    <button onClick={this.handleChangeState} value={1}>AUTOMATO FINITO</button>
                    <button onClick={this.handleChangeState} value={2}>GRAMATICA REGULAR</button>
                    <button onClick={this.handleChangeState} value={3}>EXPRESSAO REGULAR</button>
                </div>
                {state}
                <div className="container-desenvolvimento">
                    <button className="emDesenvolvimento" onClick={this.handlePlostTwist}>Não Clicar</button>
                </div>
            </div>
        )
    }
}
