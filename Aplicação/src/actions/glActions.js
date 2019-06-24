export const newGramatica = (gramatica) => {
    return {
        type: 'NEW_GRAMATICA_LIVRE',
        payload: gramatica
    }
}

export const fatoracao = () => {
    return {
        type: 'FATORACAO',
    }
}