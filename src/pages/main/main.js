import React, { Component } from 'react';
import './main.css';

import GR from '../../components/gr/gr';
import AF from '../../components/af/af';
import ER from '../../components/er/er';

// import { Container } from './styles';

export default class main extends Component {

    render() {
        return (
            <div className="container">
                <AF/>
            </div>
        )
    }
}
