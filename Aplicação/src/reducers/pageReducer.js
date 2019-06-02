const initialState = {
    af: true,
    gr: false,
    er: false,
    gl: false
}
  
export default (state = initialState, action) => {
switch (action.type) {
    case 'CHANGE_TYPE':
        if(action.payload === '1') return {...state, af: true, gr: false, er: false, gl: false}
        if(action.payload === '2') return {...state, af: false, gr: true, er: false, gl: false }
        if(action.payload === '3') return {...state, af: false, gr: false, er: true, gl: false}
        if(action.payload === '4') return {...state, af: false, gr: false, er: false, gl: true}
        break;
    case 'TRANSFORM_GRAMATICA_REGULAR':
        return {...state, af: false, gr: true}
    case 'TRANSFORM_AUTOMATO':
        return {...state, af: true, gr:false}
    default:
        return state
    }
}