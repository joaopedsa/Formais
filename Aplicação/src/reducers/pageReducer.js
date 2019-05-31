const initialState = {
    af: true,
    gr: false,
    er: false,
}
  
export default (state = initialState, action) => {
switch (action.type) {
    case 'CHANGE_TYPE':
        if(action.payload === '1') return {...state, af: true, gr: false, er: false}
        if(action.payload === '2') return {...state, af: false, gr: true, er: false}
        if(action.payload === '3') return {...state, af: false, gr: false, er: true}
        break;
    case 'TRANSFORM_GRAMATICA':
        return {...state, af: false, gr: true}
    case 'TRANSFORM_AUTOMATO':
        return {...state, af: true, gr:false}
    default:
        return state
    }
}