import { useState, useEffect } from "react"
import { searchItem, totalDamage, totalDefense, amountElements, firstParam, searchId } from "../utils/itemUtils"
import LevelFilter from "./LevelFilter"
import ItemFilter from "./ItemFilter"
import SortFilter from "./SortFilter"

export default function BuildsList() {
    const [filterLevel, setFilterLevel] = useState(245)
    const [filterItemType, setFilterItemType] = useState({id: [134], name: "Casco"})
    const [filterSort, setFilterSort] = useState({ id: 0, name: "Dominios ↑" })
    const [filterDamages, setFilterDamages] = useState([1068, 120, 122, 123, 124, 125, 149, 180, 1052, 1053, 1055, 26])
    const [showTotal, setShowTotal] = useState(false)
    const [buildItems, setBuildItems] = useState([
        {
            id: [134],
            name: "HEAD",
            spriteId: -1,
            itemId: -1
        },
        {
            id: [120],
            name: "NECK",
            spriteId: -1,
            itemId: -1
        },
        {
            id: [136],
            name: "CHEST",
            spriteId: -1,
            itemId: -1
        },
        {
            id: [103],
            name: "LEFT_HAND",
            spriteId: -1,
            itemId: -1
        },
        {
            id: [103],
            name: "RIGHT_HAND",
            spriteId: -1,
            itemId: -1
        },
        {
            id: [119],
            name: "LEGS",
            spriteId: -1,
            itemId: -1
        },
        {
            id: [132],
            name: "BACK",
            spriteId: -1,
            itemId: -1
        },
        {
            id: [138],
            name: "SHOULDERS",
            spriteId: -1,
            itemId: -1
        },
        {
            id: [133],
            name: "BELT",
            spriteId: -1,
            itemId: -1
        }
    ])

    const actionsDMG = [1068, 120, 122, 123, 124, 125, 149, 180, 1052, 1053, 1055, 26]
    const actionsDEF = [71, 80, 82, 83, 84, 85, 988, 1069]

    const statNames = {
        "chance": "Golpe crítico",
        "lock": "Placaje",
        "AP": "PA",
        "MP": "PM",
        "WP": "PW"
    }

    /**
     * ACCESSORY.png
FIRST_WEAPON.png
MOUNT.png
PET.png
SECOND_WEAPON.png
     */

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

    const createBuild = () => {
        console.log("Creating optimized build");
    
        // Variables globales
        const MAX_CANDIDATES = 5; // número de candidatos por slot a considerar
        const buildCandidates = [];
    
        // 1️⃣ Generar los candidatos por slot
        buildItems.forEach(bi => {
            let bilist = searchItem(filterLevel, bi.id, [4, 5, 6, 7]);
    
            // Filtrar por tipo de daño
            bilist = bilist.filter(i => {
                const damageEffects = i.definition.equipEffects.filter(e =>
                    actionsDMG.includes(e.effect.definition.actionId)
                );
                return (
                    damageEffects.length > 0 &&
                    damageEffects.every(e => filterDamages.includes(e.effect.definition.actionId))
                );
            });
    
            // Ordenar según criterio
            switch (filterSort.id) {
                case 0:
                    bilist.sort((a, b) =>
                        totalDamage(b.definition.equipEffects, b.definition.item.level, actionsDMG, showTotal) -
                        totalDamage(a.definition.equipEffects, a.definition.item.level, actionsDMG, showTotal)
                    );
                    break;
                case 1:
                    bilist.sort((a, b) =>
                        totalDamage(a.definition.equipEffects, a.definition.item.level, actionsDMG, showTotal) -
                        totalDamage(b.definition.equipEffects, b.definition.item.level, actionsDMG, showTotal)
                    );
                    break;
                case 2:
                    bilist.sort((a, b) =>
                        totalDefense(b.definition.equipEffects, b.definition.item.level, actionsDEF, true) -
                        totalDefense(a.definition.equipEffects, a.definition.item.level, actionsDEF, true)
                    );
                    break;
                case 3:
                    bilist.sort((a, b) =>
                        totalDefense(a.definition.equipEffects, a.definition.item.level, actionsDEF, true) -
                        totalDefense(b.definition.equipEffects, b.definition.item.level, actionsDEF, true)
                    );
                    break;
            }
    
            buildCandidates.push({
                slot: bi,
                items: bilist.slice(0, MAX_CANDIDATES) // solo los mejores N
            });
        });
    
        // 2️⃣ Buscar la mejor combinación posible (con backtracking)
        let bestBuild = null;
        let bestScore = -Infinity;
    
        const usedRingIds = new Set();
        let usedEpic = false;
        let usedRelic = false;
    
        const evaluateBuild = (build) => {
            // Calcular daño o defensa total
            const total = build.reduce((acc, b) => {
                const effects = b.definition.equipEffects;
                const level = b.definition.item.level;
                return acc + (
                    [0,1].includes(filterSort.id)
                    ? totalDamage(effects, level, actionsDMG, showTotal)
                    : totalDefense(effects, level, actionsDEF, true)
                );
            }, 0);
    
            return total;
        };
    
        const backtrack = (index, currentBuild, usedEpicFlag, usedRelicFlag, ringSet) => {
            if (index === buildCandidates.length) {
                const score = evaluateBuild(currentBuild);
                if (score > bestScore) {
                    bestScore = score;
                    bestBuild = currentBuild.map(b => b);
                }
                return;
            }
    
            const { slot, items } = buildCandidates[index];
    
            for (const item of items) {
                const rarity = item.definition.item.baseParameters.rarity;
                const itemId = item.definition.item.id;
    
                // Rechazar si rompe restricciones
                if (slot.id.includes(103) && ringSet.has(itemId)) continue;
                if (rarity === 7 && usedEpicFlag) continue;
                if (rarity === 5 && usedRelicFlag) continue;
    
                // Crear nuevos flags/copies para siguiente nivel
                const newRings = new Set(ringSet);
                const newUsedEpic = usedEpicFlag || rarity === 7;
                const newUsedRelic = usedRelicFlag || rarity === 5;
                if (slot.id.includes(103)) newRings.add(itemId);
    
                backtrack(
                    index + 1,
                    [...currentBuild, item],
                    newUsedEpic,
                    newUsedRelic,
                    newRings
                );
            }
        };
    
        backtrack(0, [], usedEpic, usedRelic, usedRingIds);
    
        // 3️⃣ Construir la build final con los ítems elegidos
        const newBuildList = buildItems.map((bi, idx) => {
            const chosen = bestBuild?.[idx];
            if (!chosen) return { ...bi, itemId: -1, spriteId: -1 };
            return {
                ...bi,
                itemId: chosen.definition.item.id,
                spriteId: chosen.definition.item.graphicParameters.gfxId
            };
        });
    
        console.log("✅ Best score:", bestScore);
        setBuildItems(newBuildList);
    };
    

    return (
        <section className="p-4">
            <header>
                <h1 className="text-white text-3xl">UwUConstructor de wuwconjuntos</h1>
            </header>

            <section className="py-2">
                <div className="flex gap-2">
                    <div className="bg-[#333] cursor-pointer rounded-md transition-all duration-100 hover:bg-[#555] size-10 md:size-15 lg:size-18 xl:size-18 flex justify-center items-center" onClick={() => { createBuild() }}>
                        <p className="text-white">Crear</p>
                    </div>
                    {
                        buildItems.map(it => {
                            const item = searchId(it.itemId)
                            let rarity = -1
                            if (item) rarity = item.definition.item.baseParameters.rarity
                            return (
                                <figure className={`bg-[#333] cursor-pointer rounded-md bg-gradient-to-br ${rarityGradients[rarity] || "from-slate-500 to-[#222]"}`}>
                                    {
                                        it.itemId >= 0 && (
                                            <img className="size-10 md:size-15 lg:size-18 xl:size-18" src={`https://vertylo.github.io/wakassets/items/${it.spriteId}.png`} alt={`${it.name.toLowerCase()} placeholder`} />
                                        )
                                    }
                                    {
                                        it.itemId == -1 && (
                                            <img className="size-10 md:size-15 lg:size-18 xl:size-18" src={`https://tmktahu.github.io/WakfuAssets/equipmentDefaults/${it.name}.png`} alt={`${it.name.toLowerCase()} placeholder`} />
                                        )
                                    }
                                </figure>
                            )
                        })
                    }
                </div>
            </section>

            <section className="flex flex-col gap-3 py-2">
                <div className="grid grid-cols-2 lg:flex gap-2">
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
                        <label htmlFor="showTotal" className="text-white">Mostrar dominios totales</label>
                        <input type="checkbox" name="showTotal" id="showTotal" checked={showTotal} onChange={() => {setShowTotal(!showTotal)}} />
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:flex gap-2 text-white">
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="all">Todos los dominios</label>
                        <input type="checkbox" name="all" id="all" checked={filterDamages.includes(1068) || filterDamages.includes(120) || filterDamages.includes(1052) || filterDamages.includes(1053) || filterDamages.includes(149) || filterDamages.includes(1055) || filterDamages.includes(180) || filterDamages.includes(26)} onChange={() => { toggleDamage([1068,120,1052,1053,149,1055,180,26]) }} />
                    </div>
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="elemental">Dominio Elemental</label>
                        <input type="checkbox" name="elemental" id="elemental" checked={filterDamages.includes(1068) || filterDamages.includes(120)} onChange={() => {toggleDamage([1068, 120])}} />
                    </div>
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="melee">Dominio Melee</label>
                        <input type="checkbox" name="melee" id="melee" checked={filterDamages.includes(1052)} onChange={() => {toggleDamage([1052])}} />
                    </div>
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="distance">Dominio Distancia</label>
                        <input type="checkbox" name="distance" id="distance" checked={filterDamages.includes(1053)} onChange={() => {toggleDamage([1053])}} />
                    </div>
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="crit">Dominio Crítico</label>
                        <input type="checkbox" name="crit" id="crit" checked={filterDamages.includes(149)} onChange={() => {toggleDamage([149])}} />
                    </div>
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="zerk">Dominio Berserker</label>
                        <input type="checkbox" name="zerk" id="zerk" checked={filterDamages.includes(1055)} onChange={() => {toggleDamage([1055])}} />
                    </div>
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="rear">Dominio Espalda</label>
                        <input type="checkbox" name="rear" id="rear" checked={filterDamages.includes(180)} onChange={() => {toggleDamage([180])}} />
                    </div>
                    <div className="bg-[#333] p-2 flex gap-1">
                        <label htmlFor="heal">Dominio Cura</label>
                        <input type="checkbox" name="heal" id="heal" checked={filterDamages.includes(26)} onChange={() => {toggleDamage([26])}} />
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
                        const requirement = item.definition.equipRequirement

                        return (
                            <div className={`text-white p-2 shadow-xl rounded-md bg-gradient-to-br ${gradient} flex flex-col gap-2`} key={id}>
                                <div>
                                    <h2 className="text-2xl font-semibold">{nombre}</h2>
                                </div>
                                <div className="flex flex-col gap-2 bg-slate-600/15 backdrop-blur-md p-2 rounded-md">
                                    <h3 className="text-lg font-semibold">Extras</h3>
                                    <div className="flex gap-2">
                                        {
                                            eqf.find(e => e.effect.definition.actionId == 31) && (
                                                <p className="flex items-center gap-2 bg-slate-200/40 rounded-md p-2 text-green-300">{firstParam(eqf.find(e => e.effect.definition.actionId == 31).effect.definition.params, lvl)} <img className="size-[18px]" src="https://vertylo.github.io/wakassets/icons/ap.png" alt="PA" /></p>
                                            )
                                        }
                                        {
                                            eqf.find(e => e.effect.definition.actionId == 56) && (
                                                <p className="flex items-center gap-2 bg-slate-200/40 rounded-md p-2 text-red-600">{firstParam(eqf.find(e => e.effect.definition.actionId == 56).effect.definition.params, lvl)} <img className="size-[18px]" src="https://vertylo.github.io/wakassets/icons/ap.png" alt="PA" /></p>
                                            )
                                        }
                                        {
                                            eqf.find(e => e.effect.definition.actionId == 41) && (
                                                <p className="flex items-center gap-2 bg-slate-200/40 rounded-md p-2 text-green-300">{firstParam(eqf.find(e => e.effect.definition.actionId == 41).effect.definition.params, lvl)} <img className="size-[18px]" src="https://vertylo.github.io/wakassets/icons/mp.png" alt="PM" /></p>
                                            )
                                        }
                                        {
                                            eqf.find(e => e.effect.definition.actionId == 57) && (
                                                <p className="flex items-center gap-2 bg-slate-200/40 rounded-md p-2 text-red-600">{firstParam(eqf.find(e => e.effect.definition.actionId == 57).effect.definition.params, lvl)} <img className="size-[18px]" src="https://vertylo.github.io/wakassets/icons/mp.png" alt="PM" /></p>
                                            )
                                        }
                                        {
                                            eqf.find(e => e.effect.definition.actionId == 191) && (
                                                <p className="flex items-center gap-2 bg-slate-200/40 rounded-md p-2 text-green-300">{firstParam(eqf.find(e => e.effect.definition.actionId == 191).effect.definition.params, lvl)} <img className="size-[18px]" src="https://vertylo.github.io/wakassets/icons/wp.png" alt="PW" /></p>
                                            )
                                        }
                                        {
                                            eqf.find(e => e.effect.definition.actionId == 192) && (
                                                <p className="flex items-center gap-2 bg-slate-200/40 rounded-md p-2 text-red-600">{firstParam(eqf.find(e => e.effect.definition.actionId == 192).effect.definition.params, lvl)} <img className="size-[18px]" src="https://vertylo.github.io/wakassets/icons/wp.png" alt="PW" /></p>
                                            )
                                        }
                                        {
                                            eqf.find(e => e.effect.definition.actionId == 160) && (
                                                <p className="flex items-center gap-2 bg-slate-200/40 rounded-md p-2 text-green-300">{firstParam(eqf.find(e => e.effect.definition.actionId == 160).effect.definition.params, lvl)} <img className="size-[18px]" src="https://vertylo.github.io/wakassets/icons/range.png" alt="Range" /></p>
                                            )
                                        }
                                        {
                                            eqf.find(e => e.effect.definition.actionId == 161) && (
                                                <p className="flex items-center gap-2 bg-slate-200/40 rounded-md p-2 text-red-600">{firstParam(eqf.find(e => e.effect.definition.actionId == 161).effect.definition.params, lvl)} <img className="size-[18px]" src="https://vertylo.github.io/wakassets/icons/range.png" alt="Range" /></p>
                                            )
                                        }
                                        {
                                            eqf.find(e => e.effect.definition.actionId == 150) && (
                                                <p className="flex items-center gap-2 bg-slate-200/40 rounded-md p-2 text-green-300">{firstParam(eqf.find(e => e.effect.definition.actionId == 150).effect.definition.params, lvl)}% <img className="size-[18px]" src="https://vertylo.github.io/wakassets/icons/critical.png" alt="Chance" /></p>
                                            )
                                        }
                                        {
                                            eqf.find(e => e.effect.definition.actionId == 168) && (
                                                <p className="flex items-center gap-2 bg-slate-200/40 rounded-md p-2 text-red-600">{firstParam(eqf.find(e => e.effect.definition.actionId == 168).effect.definition.params, lvl)}% <img className="size-[18px]" src="https://vertylo.github.io/wakassets/icons/critical.png" alt="Chance" /></p>
                                            )
                                        }
                                        {
                                            eqf.find(e => e.effect.definition.actionId == 875) && (
                                                <p className="flex items-center gap-2 bg-slate-200/40 rounded-md p-2 text-green-300">{firstParam(eqf.find(e => e.effect.definition.actionId == 875).effect.definition.params, lvl)}% <img className="size-[18px]" src="https://vertylo.github.io/wakassets/icons/block.png" alt="Block" /></p>
                                            )
                                        }
                                        {
                                            eqf.find(e => e.effect.definition.actionId == 876) && (
                                                <p className="flex items-center gap-2 bg-slate-200/40 rounded-md p-2 text-red-600">{firstParam(eqf.find(e => e.effect.definition.actionId == 876).effect.definition.params, lvl)}% <img className="size-[18px]" src="https://vertylo.github.io/wakassets/icons/block.png" alt="Block" /></p>
                                            )
                                        }
                                        {
                                            eqf.find(e => e.effect.definition.actionId == 184) && (
                                                <p className="flex items-center gap-2 bg-slate-200/40 rounded-md p-2 text-green-300">{firstParam(eqf.find(e => e.effect.definition.actionId == 184).effect.definition.params, lvl)} <img className="size-[18px]" src="https://vertylo.github.io/wakassets/icons/control.png" alt="Control" /></p>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-1 gap-4">
                                    <div className="flex flex-col flex-1 bg-slate-600/15 backdrop-blur-md p-2 rounded-md">
                                        <h3 className="text-lg font-semibold">Dominios</h3>
                                        {
                                            totalDamage(eqf, lvl, [1052]) > 0 && (
                                                <p className="px-1 text-green-300">Melee {totalDamage(eqf, lvl, [1052])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [1053]) > 0 && (
                                                <p className="px-1 text-green-300">Distancia {totalDamage(eqf, lvl, [1053])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [149]) > 0 && (
                                                <p className="px-1 text-green-300">Crítico {totalDamage(eqf, lvl, [149])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [180]) > 0 && (
                                                <p className="px-1 text-green-300">Espalda {totalDamage(eqf, lvl, [180])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [1055]) > 0 && (
                                                <p className="px-1 text-green-300">Berserker {totalDamage(eqf, lvl, [1055])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [26]) > 0 && (
                                                <p className="px-1 text-green-300">Curas {totalDamage(eqf, lvl, [26])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [122]) > 0 && (
                                                <p className="px-1 text-green-300">Fuego {totalDamage(eqf, lvl, [122])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [124]) > 0 && (
                                                <p className="px-1 text-green-300">Agua {totalDamage(eqf, lvl, [124])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [123]) > 0 && (
                                                <p className="px-1 text-green-300">Tierra {totalDamage(eqf, lvl, [123])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [125]) > 0 && (
                                                <p className="px-1 text-green-300">Aire {totalDamage(eqf, lvl, [125])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [1068]) > 0 && (
                                                <p className="px-1 text-green-300">({amountElements(eqf, lvl, 1068)}) Elemental {totalDamage(eqf, lvl, [1068])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [120]) > 0 && (
                                                <p className="px-1 text-green-300">(4) Elemental {totalDamage(eqf, lvl, [120])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [1059]) > 0 && (
                                                <p className="px-1 text-red-500">Melee {totalDamage(eqf, lvl, [1059])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [1060]) > 0 && (
                                                <p className="px-1 text-red-500">Distancia {totalDamage(eqf, lvl, [1060])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [1056]) > 0 && (
                                                <p className="px-1 text-red-500">Crítico {totalDamage(eqf, lvl, [1056])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [181]) > 0 && (
                                                <p className="px-1 text-red-500">Espalda {totalDamage(eqf, lvl, [181])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [1061]) > 0 && (
                                                <p className="px-1 text-red-500">Berserker {totalDamage(eqf, lvl, [1061])}</p>
                                            )
                                        }
                                        {
                                            totalDamage(eqf, lvl, [130]) > 0 && (
                                                <p className="px-1 text-red-500">(4) Elemental {totalDamage(eqf, lvl, [130])}</p>
                                            )
                                        }
                                        <p className="font-semibold text-lg flex-1 flex flex-col justify-end items-end">Total {totalDamage(eqf, lvl, actionsDMG, showTotal)}</p>
                                        
                                    </div>
                                    <div className="flex flex-col flex-1 bg-slate-600/15 backdrop-blur-md p-2 rounded-md">
                                        <h3 className="text-lg font-semibold">Resistencias</h3>
                                        {
                                            totalDefense(eqf, lvl, [71]) > 0 && (
                                                <p className="px-1 text-green-300">Espalda {totalDefense(eqf, lvl, [71])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [988]) > 0 && (
                                                <p className="px-1 text-green-300">Crítica {totalDefense(eqf, lvl, [988])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [82]) > 0 && (
                                                <p className="px-1 text-green-300">Fuego {totalDefense(eqf, lvl, [82])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [83]) > 0 && (
                                                <p className="px-1 text-green-300">Agua {totalDefense(eqf, lvl, [83])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [84]) > 0 && (
                                                <p className="px-1 text-green-300">Tierra {totalDefense(eqf, lvl, [84])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [85]) > 0 && (
                                                <p className="px-1 text-green-300">Aire {totalDefense(eqf, lvl, [85])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [80]) > 0 && (
                                                <p className="px-1 text-green-300">(4) Elemental {totalDefense(eqf, lvl, [80])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [1063]) > 0 && (
                                                <p className="px-1 text-red-500">Espalda {totalDefense(eqf, lvl, [1063])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [1062]) > 0 && (
                                                <p className="px-1 text-red-500">Crítica {totalDefense(eqf, lvl, [1062])}</p>
                                            )
                                        }
                                        {
                                            totalDefense(eqf, lvl, [1069]) > 0 && (
                                                <p className="px-1 text-green-300">({amountElements(eqf, lvl, 1069)}) Elemental {totalDefense(eqf, lvl, [1069])}</p>
                                            )
                                        }
                                        <p className="font-semibold text-lg flex-1 flex flex-col justify-end items-end">Total {totalDefense(eqf, lvl, actionsDEF, true)}</p>
                                    </div>
                                </div>
                                {
                                    requirement && (
                                        <div className="bg-slate-600/15 rounded-md p-2">
                                            <h3 className="text-lg font-semibold">Requisitos</h3>
                                            <p className="px-1 text-red-500">{(requirement.lower ? statNames[requirement.stat] + " =< " + requirement.lower:"")}</p>
                                        </div>
                                    )
                                }
                            </div>
                            
                        )
                    })
                }
            </section>
        </section>
    )
}