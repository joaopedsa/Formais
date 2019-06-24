import Automato from '../models/automato'
import Regular from '../models/regular'
import Expression from '../models/expression'
import LivreContexto from '../models/livreContexto';

const initialState = {
    automato: new Automato([],[],[],'',[]),
    automato2: new Automato([],[],[],'',[]),
    regular: new Regular([],[],[],'S'),
    expression: new Expression(),
    livreContexto: new LivreContexto([],[],[],'S')
  }
  
export default (state = initialState, action) => {
switch (action.type) {
    case 'NEW_AUTOMATO':
      return { ...state, automato: action.payload }
    case 'NEW_AUTOMATO_2':
      return { ...state, automato2: action.payload }
    case 'DETERMINIZE':
      return { ...state, automato: state.automato.determinize() }
    case 'TRANSFORM_GRAMATICA_REGULAR':
      return { ...state, regular: state.automato.transformToGramatica()}
    case 'NEW_GRAMATICA_REGULAR':
      return { ...state, regular: action.payload }
    case 'NEW_GRAMATICA_LIVRE':
      return { ...state, livreContexto: action.payload }
    case 'TRANSFORM_AUTOMATO':
      let temp = state.regular.transformRegularToAutomato()
      let newAutomato = new Automato(temp.states,temp.alphabet,temp.transitions,temp.initial,temp.finals)
      return { ...state, automato: newAutomato }
    case 'FATORACAO':
      temp = state.livreContexto.fatoracao()
      let newLivreContexto = new LivreContexto(temp.nonTerminal,temp.terminal,temp.productions,temp.initial)
      return { ...state, livreContexto: newLivreContexto}
    default:
      return state
    }
}