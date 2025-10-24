import { useState, useEffect } from "react"
import { searchItem, totalDamage, totalDefense, amountElements } from "../utils/itemUtils"
import LevelFilter from "./LevelFilter"
import ItemFilter from "./ItemFilter"
import SortFilter from "./SortFilter"

export default function BuildsList() {
    const [filterLevel, setFilterLevel] = useState(245)
    const [filterItemType, setFilterItemType] = useState({id: [134], name: "Casco"})
    const [filterSort, setFilterSort] = useState({ id: 0, name: "Dominios ↑" })
    const [filterDamages, setFilterDamages] = useState([1068, 120, 122, 123, 124, 125, 149, 180, 1052, 1053, 1055, 26])
    const [showTotal, setShowTotal] = useState(false)

    const actionsDMG = [1068, 120, 122, 123, 124, 125, 149, 180, 1052, 1053, 1055, 26]
    const actionsDEF = [71, 80, 82, 83, 84, 85, 988, 1069]

    const rarityGradients = {
        4: "from-yellow-400 via-[#222] to-[#222]",
        5: "from-purple-500 via-[#222] to-[#222]",
        6: "from-blue-500 via-[#222] to-[#222]",
        7: "from-pink-500 via-[#222] to-[#222]"
    }
    
    const toggleDamage = (ids) => {
        setFilterDamages((prev => {
            const allIncluded = ids.every(id => prev.includes(id))

            if (allIncluded) {
                return prev.filter(id => !ids.includes(id))
            } else {
                const newIds = ids.filter(id => !prev.includes(id))
                return [...prev, ...newIds] 
            }
        }))
    }

    let items = searchItem(filterLevel, filterItemType.id, [4, 5, 6, 7])

    //items = items.filter(i => i.definition.equipEffects.every(e => filterDamages.includes(e.effect.definition.actionId)))
    items = items.filter(i => {
        const damageEffects = i.definition.equipEffects.filter(e => actionsDMG.includes(e.effect.definition.actionId))
        return (damageEffects.length > 0 && damageEffects.every(e => filterDamages.includes(e.effect.definition.actionId)))
    })

    switch (filterSort.id) {
        case 0: 
            items = items.sort((a, b) => totalDamage(b.definition.equipEffects, b.definition.item.level, actionsDMG, showTotal) - totalDamage(a.definition.equipEffects, a.definition.item.level, actionsDMG, showTotal))
            break
        case 1:
            items = items.sort((a, b) => totalDamage(a.definition.equipEffects, a.definition.item.level, actionsDMG, showTotal) - totalDamage(b.definition.equipEffects, b.definition.item.level, actionsDMG, showTotal))
            break
        case 2:
            items = items.sort((a, b) => totalDefense(b.definition.equipEffects, b.definition.item.level, actionsDEF, true) - totalDefense(a.definition.equipEffects, a.definition.item.level, actionsDEF, true))
            break
        case 3:
            items = items.sort((a, b) => totalDefense(a.definition.equipEffects, a.definition.item.level, actionsDEF, true) - totalDefense(b.definition.equipEffects, b.definition.item.level, actionsDEF, true))
            break
    }

    return (
        <section className="p-4">
            <header>
                <h1 className="text-white text-3xl">UwUConstructor de wuwconjuntos</h1>
            </header>

            <section className="flex flex-col gap-2 py-2">
                <div className="flex gap-2">
                    <div className="bg-[#333] flex p-2 gap-2">
                        <span className="text-white">Nivel</span>
                        <LevelFilter defaultLevel={filterLevel} setFilterLevel={setFilterLevel} />
                    </div>
                    <div className="bg-[#333] flex p-2 gap-2">
                        <span className="text-white">Equipamiento</span>
                        <ItemFilter defaultItem={filterItemType} setFilterItem={setFilterItemType} />
                    </div>
                    <div className="bg-[#333] flex p-2 gap-2">
                        <span className="text-white">Ordenar por</span>
                        <SortFilter defaultSort={filterSort} setFilterSort={setFilterSort} />
                    </div>
                    <div className="bg-[#333] flex p-2 gap-2">
                        <span className="text-white">Mostrar dominios totales</span>
                        <input type="checkbox" name="showTotal" id="showTotal" checked={showTotal} onChange={() => {setShowTotal(!showTotal)}} />
                    </div>
                </div>
                <div className="flex gap-1 text-white">
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="elemental">Dominio Elemental</label>
                        <input type="checkbox" name="elemental" id="elemental" checked={filterDamages.includes(1068) || filterDamages.includes(120)} onChange={() => {toggleDamage([1068, 120])}} />
                    </div>
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="melee">Dominio Melee</label>
                        <input type="checkbox" name="melee" id="melee" checked={filterDamages.includes(1052)} onClick={() => {toggleDamage([1052])}} />
                    </div>
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="distance">Dominio Distancia</label>
                        <input type="checkbox" name="distance" id="distance" checked={filterDamages.includes(1053)} onClick={() => {toggleDamage([1053])}} />
                    </div>
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="crit">Dominio Crítico</label>
                        <input type="checkbox" name="crit" id="crit" checked={filterDamages.includes(149)} onClick={() => {toggleDamage([149])}} />
                    </div>
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="zerk">Dominio Berserker</label>
                        <input type="checkbox" name="zerk" id="zerk" checked={filterDamages.includes(1055)} onClick={() => {toggleDamage([1055])}} />
                    </div>
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="rear">Dominio Espalda</label>
                        <input type="checkbox" name="rear" id="rear" checked={filterDamages.includes(180)} onClick={() => {toggleDamage([180])}} />
                    </div>
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="heal">Dominio Cura</label>
                        <input type="checkbox" name="heal" id="heal" checked={filterDamages.includes(26)} onClick={() => {toggleDamage([26])}} />
                    </div>
                </div>
                
            </section>

            <section className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {
                    items.map(item => {
                        const eqf = item.definition.equipEffects
                        const lvl = item.definition.item.level
                        const id = item.definition.item.id
                        const nombre = item.title.es
                        const rarity = item.definition.item.baseParameters.rarity
                        const gradient = rarityGradients[rarity] || "from-yellow-500 to-[#222]"

                        return (
                            <div className={`text-white p-2 shadow-xl rounded-md bg-gradient-to-br ${gradient} flex flex-col gap-2`} key={id}>
                                <div>
                                    <h2 className="text-2xl font-semibold">{nombre}</h2>
                                </div>
                                <div className="flex flex-1 gap-4">
                                    <div className="flex flex-col flex-1 bg-slate-600/15 backdrop-blur-md p-2 rounded-md">
                                        <h3 className="text-lg font-semibold">Dominios</h3>
                                        {
                                            totalDamage(eqf, lvl, [1052]) > 0 && (
                                                <p className="px-1">Melee {totalDamage(eqf, lvl, [1052])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [1053]) > 0 && (
                                                <p className="px-1">Distancia {totalDamage(eqf, lvl, [1053])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [149]) > 0 && (
                                                <p className="px-1">Crítico {totalDamage(eqf, lvl, [149])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [180]) > 0 && (
                                                <p className="px-1">Espalda {totalDamage(eqf, lvl, [180])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [1055]) > 0 && (
                                                <p className="px-1">Berserker {totalDamage(eqf, lvl, [1055])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [26]) > 0 && (
                                                <p className="px-1">Curas {totalDamage(eqf, lvl, [26])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [122]) > 0 && (
                                                <p className="px-1">Fuego {totalDamage(eqf, lvl, [122])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [124]) > 0 && (
                                                <p className="px-1">Agua {totalDamage(eqf, lvl, [124])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [123]) > 0 && (
                                                <p className="px-1">Tierra {totalDamage(eqf, lvl, [123])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [125]) > 0 && (
                                                <p className="px-1">Aire {totalDamage(eqf, lvl, [125])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [1068]) > 0 && (
                                                <p className="px-1">({amountElements(eqf, lvl, 1068)}) Elemental {totalDamage(eqf, lvl, [1068])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [120]) > 0 && (
                                                <p className="px-1">(4) Elemental {totalDamage(eqf, lvl, [120])}</p>
                                            )
                                        }
                                        <p className="font-semibold text-lg flex-1 flex flex-col justify-end items-end">Total {totalDamage(eqf, lvl, actionsDMG, showTotal)}</p>
                                        
                                    </div>
                                    <div className="flex flex-col flex-1 bg-slate-600/15 backdrop-blur-md p-2 rounded-md">
                                        <h3 className="text-lg font-semibold">Resistencias</h3>
                                        {
                                            totalDefense(eqf, lvl, [71]) > 0 && (
                                                <p className="px-1">Espalda {totalDefense(eqf, lvl, [71])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [988]) > 0 && (
                                                <p className="px-1">Crítica {totalDefense(eqf, lvl, [988])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [82]) > 0 && (
                                                <p className="px-1">Fuego {totalDefense(eqf, lvl, [82])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [83]) > 0 && (
                                                <p className="px-1">Agua {totalDefense(eqf, lvl, [83])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [84]) > 0 && (
                                                <p className="px-1">Tierra {totalDefense(eqf, lvl, [84])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [85]) > 0 && (
                                                <p className="px-1">Aire {totalDefense(eqf, lvl, [85])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [80]) > 0 && (
                                                <p className="px-1">(4) Elemental {totalDefense(eqf, lvl, [80])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [1069]) > 0 && (
                                                <p className="px-1">({amountElements(eqf, lvl, 1069)}) Elemental {totalDefense(eqf, lvl, [1069])}</p>
                                            )
                                        }
                                        <p className="font-semibold text-lg flex-1 flex flex-col justify-end items-end">Total {totalDefense(eqf, lvl, actionsDEF, true)}</p>
                                    </div>
                                </div>
                            </div>
                            
                        )
                    })
                }
            </section>
        </section>
    )
}