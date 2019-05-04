import React, { Component } from 'react';
import './main.css';

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

    handleChangeState = (e) => {
        if(e.target.value == 1) this.setState({af : true, gr: false, ef: false})
        if(e.target.value == 2) this.setState({af : false, gr: true, ef: false})
        if(e.target.value == 3) this.setState({af : false, gr: false, ef: true})
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
            </div>
        )
    }
}
