export const transformGraticaToAutomato = () => {
    return {
        type: 'TRANSFORM_AUTOMATO'
    }
}


export const newGramatica = (gramatica) => {
    return {
        type: 'NEW_GRAMATICA',
        payload: gramatica
    }
}