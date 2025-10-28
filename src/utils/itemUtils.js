import items from '../data/items.json'

// Caso práctico sencillo:
// Buscar cascos de nivel 200

const searchItem = (level, itemType, rarities) => {
    const filteredItems = items.filter(i => i.definition.item.level == level && itemType.includes(i.definition.item.baseParameters.itemTypeId) &&  rarities.includes(i.definition.item.baseParameters.rarity))

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

const totalDamage = (effects, level, actions, total = false) => {
    const dmgActionMap = {
        1052: 1,
        1053: 1,
        149: 1,
        180: 1,
        1055: 1,
        26: 1,
        122: 1,
        124: 1,
        125: 1,
        123: 1,
        1068: 1,
        120: 1,
        1059: -1,
        1060: -1,
        1056: -1,
        181: -1,
        1061: -1,
        130: -1,
        132: -1,
    }
    
    /*
    const filteredEffects = effects.filter(effect => actions.includes(effect.effect.definition.actionId))
    if (filteredEffects.length > 0) {
        return filteredEffects.reduce((sum, effect) => {
            const fp = firstParam(effect.effect.definition.params, level)
            return sum + (effect.effect.definition.actionId == 120 && total? fp*4: effect.effect.definition.actionId == 1068 && total? fp*amountElements(effects, level, 1068): fp)
        }, 0)
    }

    return 0*/

    return effects.reduce((sum, effect) => {
        const def = effect.effect.definition
        const coef = dmgActionMap[def.actionId]
        if (!coef) return sum

        const fp = firstParam(def.params, level)
        const value = coef * fp

        if (def.actionId == 120 && total) return sum + value * 4
        if (def.actionId == 1068 && total) return sum + value * amountElements(effects, level, 1068)
        
        return sum + value
    }, 0)
}

const totalDefense = (effects, level, actions, total = false) => {
    const filteredEffects = effects.filter(effect => actions.includes(effect.effect.definition.actionId))
    if (filteredEffects.length > 0) {
        return filteredEffects.reduce((sum, effect) => {
            const fp = firstParam(effect.effect.definition.params, level)
            return sum + (effect.effect.definition.actionId == 80 && total? fp*4: effect.effect.definition.actionId == 1069 && total? fp*amountElements(effects, level, 1069): fp)
        }, 0)
    }

    return 0
}

const amountElements = (effects, level, action) => {
    const filteredEffect = effects.find(effect => effect.effect.definition.actionId == action)
    if (filteredEffect) {
        return secondParam(filteredEffect.effect.definition.params, level)
    }

    return 0
}

const searchId = (id) => {
    if (id == -1) return null
    const item = items.find(i => i.definition.item.id == id)
    return item
}

export { searchItem, totalDamage, totalDefense, amountElements, firstParam, searchId }