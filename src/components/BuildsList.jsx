import { useState, useEffect } from "react"
import { searchItem, totalDamage } from "../utils/itemUtils"
import LevelFilter from "./LevelFilter"

export default function BuildsList() {
    const [filterLevel, setFilterLevel] = useState(200)
    const [filterDamages, setFilterDamages] = useState([])

    const actions = [1068, 120, 122, 123, 124, 125, 149, 180, 1052, 1053, 1055, 26]
    
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

    let items = searchItem(filterLevel, 134, 4)

    items = items.filter(i => i.definition.equipEffects.find(e => filterDamages.includes(e.effect.definition.actionId)))

    items = items.sort((a, b) => totalDamage(b.definition.equipEffects, b.definition.item.level, actions) - totalDamage(a.definition.equipEffects, a.definition.item.level, actions))

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

            <section className="grid grid-cols-4 gap-2">
                {
                    items.map(item => {
                        let eqf = item.definition.equipEffects
                        let lvl = item.definition.item.level
                        let id = item.definition.item.id
                        let nombre = item.title.es
                        return (
                            <div className="text-white bg-[#222] p-2 shadow-xl rounded-md" key={id}>
                                <h2 className="text-xl">{nombre}</h2>
                                {
                                    totalDamage(eqf, lvl, [1052]) > 0 && (
                                        <p>Melee: {totalDamage(eqf, lvl, [1052])}</p>
                                    )
                                }
                                {
                                    totalDamage(eqf, lvl, [1053]) > 0 && (
                                        <p>Distancia: {totalDamage(eqf, lvl, [1053])}</p>
                                    )
                                }
                                {
                                    totalDamage(eqf, lvl, [26]) > 0 && (
                                        <p>Curas: {totalDamage(eqf, lvl, [26])}</p>
                                    )
                                }
                                {
                                    totalDamage(eqf, lvl, [1055]) > 0 && (
                                        <p>Berserker: {totalDamage(eqf, lvl, [1055])}</p>
                                    )
                                }
                                {
                                    totalDamage(eqf, lvl, [180]) > 0 && (
                                        <p>Espalda: {totalDamage(eqf, lvl, [180])}</p>
                                    )
                                }
                                {
                                    totalDamage(eqf, lvl, [149]) > 0 && (
                                        <p>Crítico: {totalDamage(eqf, lvl, [149])}</p>
                                    )
                                }
                                {
                                    totalDamage(eqf, lvl, [1068]) > 0 && (
                                        <p>Elemental: {totalDamage(eqf, lvl, [1068])}</p>
                                    )
                                }
                                <p>Total: {totalDamage(eqf, lvl, actions)}</p>
                            </div>
                        )
                    })
                }
            </section>
        </section>
    )
}