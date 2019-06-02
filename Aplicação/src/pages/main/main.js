import React, { Component } from 'react'
import './main.css'
import { changeType } from '../../actions/pageActions'
import Swal from 'sweetalert2'


import GR from '../../components/gr/gr'
import AF from '../../components/af/af'
import ER from '../../components/er/er'
import GL from '../../components/gl/gl'
import { connect } from 'react-redux'


class main extends Component {

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

    render() {
        let state = ''
        if(this.props.af) state = <AF/>
        if(this.props.gr) state = <GR/>
        if(this.props.er) state = <ER/>
        if(this.props.gl) state = <GL/>
        return (
            <div>
                <div className="container-buttons-menu">
                    <button onClick={e => this.props.changeType(e.target.value)} value={1}>AUTOMATO FINITO</button>
                    <button onClick={e => this.props.changeType(e.target.value)} value={2}>GRAMATICA REGULAR</button>
                    <button onClick={e => this.props.changeType(e.target.value)} value={3}>EXPRESSAO REGULAR</button>
                    <button onClick={e => this.props.changeType(e.target.value)} value={4}>GRAMATICA LIVRE</button>
                </div>
                {state}
                <div className="container-desenvolvimento">
                    <button className="emDesenvolvimento" onClick={this.handlePlostTwist}>Não Clicar</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        af: state.pageProps.af,
        gr: state.pageProps.gr,
        er: state.pageProps.er,
        gl: state.pageProps.gl
    }
}

export default connect(mapStateToProps,{ changeType })(main)
