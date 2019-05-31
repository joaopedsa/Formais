export const determinize = () => {
    return {
        type: 'DETERMINIZE'
    }
}

export const transformToGramatica = () => {
    return {
        type: 'TRANSFORM_GRAMATICA'
    }
}

export const newAutomato = (automato) => {
    return {
        type: 'NEW_AUTOMATO',
        payload: automato
    }
}