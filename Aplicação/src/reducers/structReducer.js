import Automato from '../models/automato'
import Regular from '../models/regular'
import Expression from '../models/expression'

const initialState = {
    automato: new Automato([],[],[],'',[]),
    regular: new Regular([],[],[],'S'),
    expression: new Expression()
  }
  
export default (state = initialState, action) => {
switch (action.type) {
    case 'NEW_AUTOMATO':
      return {...state, automato: action.payload}
    case 'DETERMINIZE':
      return {...state, automato: state.automato.determinize()}
    case 'TRANSFORM_GRAMATICA':
      return {...state, regular: state.automato.transformToGramatica()}
    case 'NEW_GRAMATICA':
      return {...state, regular: action.payload}
    case 'TRANSFORM_AUTOMATO':
      let temp = state.regular.transformRegularToAutomato()
      let newAutomato = new Automato(temp.states,temp.alphabet,temp.transitions,temp.initial,temp.finals)
      return {...state, automato: newAutomato }
    default:  
      return state
    }
}