import React, { Component } from 'react';
import './main.css';
import Swal from 'sweetalert2';

import GR from '../../components/gr/gr';
import AF from '../../components/af/af';
import ER from '../../components/er/er';
import Automato from '../../models/automato';
import Regular from '../../models/regular';
import Transition from '../../models/transition';
import Expression from '../../models/expression'
import Production from '../../models/production';

export default class main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            af: true,
            gr: false,
            er: false,
            automato: new Automato([],[],[],'',[]),
            regular: new Regular([],[],[],'S'),
            expression: new Expression()
        }
    }

    handleTransformAutomatoToRegular = () => {
        this.setState({regular :this.state.automato.transformToGramatica(),af:false,gr:true})
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
        if(parseInt(e.target.value) === 1) this.setState({af : true, gr: false, er: false})
        if(parseInt(e.target.value) === 2) this.setState({af : false, gr: true, er: false})
        if(parseInt(e.target.value) === 3) this.setState({af : false, gr: false, er: true})
    }
    handleDeterminize = () => {
        this.setState({automato:this.state.automato.determinize()})
      }
    
    filterTransitions = (state,symbol) => {
        const newState = this.state.automato.transitions.filter(transition => transition.state === state && transition.symbol === symbol)
        return newState
    }

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
        this.setState({regular : regular})
    }

    handleCreateTable = async () => {
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
        this.createTable(size[0],size[1])
    }

    createTable = (numStates,numInputs) => {
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
        this.setState({automato: newAutomato})
    }

    handleChangeCell = (e,symbol,state) => {
        this.setState({automato: this.state.automato.setTransition(state,symbol,e.target.value)})
    }
    
    handleFinalState = (e) => {
        this.setState({automato: this.state.automato.setFinalState(e.target.getAttribute('value'))})
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
                this.setState({automato: newAutomato})
            }
        }
        reader.readAsText(file)
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
                this.setState({regular: newRegular})
            }
        }
        reader.readAsText(file)
    }

    handleChangeSymbol = async (e) => {
        const symbol = e.target.value
        let {value: input} = await Swal.fire({
            title: 'insira a nova Entrada',
            input: 'text',
            showCancelButton: true,
            inputValidator: (value) => {
            if (!value || (this.state.automato.alphabet.indexOf(value) !== -1) ) {
                return 'Insira um valor para entrada ou valor que seja diferente'
            }
            }
        })
        if (input) {
            let newAutomato = this.state.automato.setSymbol(symbol,input)
            this.setState({automato: newAutomato})
        }
    }

    transformGramaticaToAutomato = () => {
        let temp = this.state.regular.transformRegularToAutomato()
        let newAutomato = new Automato(temp.states,temp.alphabet,temp.transitions,temp.initial,temp.finals)
        this.setState({automato:newAutomato,af:true,gr:false})
    }

    handleChangeSentenca = (e,from) => {
        this.setState({regular : this.state.regular.setProductions(from,e.target.value)})
    }

    render() {
        let state = ''
        if(this.state.af) state = <AF main={this} automato={this.state.automato}/>
        if(this.state.gr) state = <GR main={this} regular={this.state.regular}/>
        if(this.state.er) state = <ER main={this} expressao={this.state.expression}/>
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
