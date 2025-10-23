import items from '../data/items.json'

// Caso práctico sencillo:
// Buscar cascos de nivel 200

const searchItem = (level, itemType, rarities) => {
    const filteredItems = items.filter(i => i.definition.item.level == level && i.definition.item.baseParameters.itemTypeId == itemType &&  rarities.includes(i.definition.item.baseParameters.rarity))

    return filteredItems
}

const firstParam = (effectParams, level) => {
    return effectParams[0] + effectParams[1] * level
}

const secondParam = (effectParams, level) => {
    return effectParams[2] + effectParams[3] * level
}

const thirdParam = (effectParams, level) => {
    return effectParams[4] + effectParams[5] * level
}

const totalDamage = (effects, level, actions) => {
    const filteredEffects = effects.filter(effect => actions.includes(effect.effect.definition.actionId))
    if (filteredEffects.length > 0) {
        return filteredEffects.reduce((sum, effect) => {
            return sum + firstParam(effect.effect.definition.params, level)
        }, 0)
    }

    return 0
}

export { searchItem, totalDamage }