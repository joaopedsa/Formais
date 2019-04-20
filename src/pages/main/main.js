import React, { Component } from 'react';
import './main.css';

import GR from '../../components/gr/gr';
import AF from '../../components/af/af';
import ER from '../../components/er/er';

// import { Container } from './styles';

export default class main extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tipo: 0
        }
    }

    render() {
        return (
            <div class="container">
                <GR/>
                <AF/>
                <ER/>
            </div>
        )
    }
}
