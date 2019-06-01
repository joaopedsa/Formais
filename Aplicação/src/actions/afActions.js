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

export const newAutomato = (automato,type) => {
    if (type === 2) {
        return {
            type: 'NEW_AUTOMATO_2',
            payload: automato
        }
    } else { 
        return {
            type: 'NEW_AUTOMATO',
            payload: automato
        }
    }
}