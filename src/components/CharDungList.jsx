import { useState, useEffect, useMemo } from "react"
import { ID, TablesDB } from "appwrite"
import { appwriteAccount, appwriteClient } from "../service/appwriteConnection"
import CustomSelector from "./CustomSelector"

const client = appwriteClient

const database = new TablesDB(client)

async function getDungeons() {
    return await database.listRows({databaseId: "68dea035000c4960bb99", tableId: "mazmorras"})
        .catch((error) => {
            throw new Error(error)
        })
}

async function getDungeonsDone() {
    return await database.listRows({databaseId: "68dea035000c4960bb99", tableId: "mazmorra_personaje"})
        .catch((error) => {
            throw new Error(error)
        })
}

async function getCharacters() {
    return await database.listRows({databaseId: "68dea035000c4960bb99", tableId: "personajes"})
        .catch((error) => {
            throw new Error(error)
        })
}

async function insertCharacterDungeon(stasisLevel, character, dungeon) {
    return database.createRow({databaseId: "68dea035000c4960bb99", tableId: "mazmorra_personaje", rowId: ID.unique(), data: {stasis: stasisLevel, personaje: character.$id, mazmorra: dungeon.$id}})
        .catch((error) => {
            throw new Error(error)
        })
}

function StasisLevelColor (level) {
    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.slice(1), 16)
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        }
    }

    const interpolateColor = (color1, color2, factor) => {
        const c1 = hexToRgb(color1)
        const c2 = hexToRgb(color2)
        const r = Math.round(c1.r + (c2.r - c1.r) * factor)
        const g = Math.round(c1.g + (c2.g - c1.g) * factor)
        const b = Math.round(c1.b + (c2.b - c1.b) * factor)
        return `rgb(${r}, ${g}, ${b})`
    }

    const factor = Math.min(Math.max((level - 1) / 9, 0), 1)

    const color = interpolateColor("#ffe6f0", "#ff007f", factor)

    return color
}

function GetTextColor(rgbString) {
    const match = rgbString.match(/\d+/g)
    if (!match) return "black"

    const [r, g, b] = match.map(Number)
    const lumi = 0.299 * r + 0.587 * g + 0.114 * b
    return lumi > 150 ? "black" : "white"
}

function CharDungList() {

    const [dungeons, setDungeons] = useState([])
    const [characters, setCharacters] = useState([])
    const [dungeonsDone, setDungeonsDone] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddCharacter, setShowAddCharacter] = useState(false)
    const [selectedChar, setSelectedChar] = useState(null)
    const [selectedDung, setSelectedDung] = useState(null)
    const [selectedStasis, setSelectedStasis] = useState(null)
    const [endMonthReward, setEndMonthReward] = useState(0)

    useEffect(() => {
        async function fetchData() {
            try {
                const [dunRes, charRes, doneRes] = await Promise.all([
                    getDungeons(),
                    getCharacters(),
                    getDungeonsDone()
                ])
                
                setDungeons(dunRes.rows)
                setCharacters(charRes.rows)
                setDungeonsDone(doneRes.rows)
            } catch (err) {
                console.error("Error al cargar datos: ", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const showModal = () => {
        setShowAddCharacter(true)
    }

    const addCharacter = async (sta, chrt, dng) => {
        const result = await insertCharacterDungeon(sta, chrt, dng)
        setShowAddCharacter(false)
    }

    const date = new Date()
    let month = date.getMonth()
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

    const doneByDungeon = useMemo(() => {
        const map = {}

        dungeonsDone.forEach((dd) => {
            if (!map[dd.mazmorra]) map[dd.mazmorra] = []
            map[dd.mazmorra].push(dd)
        })
        return map
    }, [dungeonsDone])

    if (loading) {
        return <p className="text-white text-xl p-2">Cargando mazmorras...</p>
    }

    if (dungeons.length === 0) {
        return <p className="text-white">No se han encontrado mazmorras</p>
    }

    return (
        <section className="p-2">
            <header>
                <h1 className="text-white text-3xl p-2">Resumen del mes de {meses[month]}</h1>
                <h4 className="text-gray-400 text-md">Total de cofres: {endMonthReward}</h4>
            </header>
            <button onClick={showModal} className="px-3 py-1 bg-blue-600 rounded-md text-white cursor-pointer">Añadir personaje</button>

            {showAddCharacter && (
                <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
                    <div className="bg-[#333] p-6 rounded-lg shadow-lg sm:w-[90%] md:w-96 lg:w-140">
                        <h3 className="text-white text-lg mb-4" onClick={() => { console.log(selectedDung, selectedChar, typeof selectedStasis, selectedStasis) }}>Añadir run</h3>
                        <div className="flex gap-1">
                            <CustomSelector options={dungeons} selected={selectedDung} onSelect={setSelectedDung} labelKey="nombre" placeholder="Mazmorra" />
                            <CustomSelector options={characters} selected={selectedChar} onSelect={setSelectedChar} labelKey="nombre" placeholder="Personaje" />
                            <CustomSelector options={Array.from({ length: 10 }, (_, i) => i + 1)} selected={selectedStasis} onSelect={setSelectedStasis} placeholder="Stasis" getColor={(n) => { return StasisLevelColor(n) }} />
                        </div>
                        <button className="mt-4 px-3 py-1 bg-blue-600 rounded-md text-white cursor-pointer" onClick={() => { addCharacter(selectedStasis, selectedChar, selectedDung)}}>
                            Confirmar
                        </button>
                    </div>
                </div>
            )}

            <h2 className="text-white text-2xl mb-2">Mazmorras Franja 200</h2>

            <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {dungeons.map((dung) => {
                    const completadas = doneByDungeon[dung.$id] || [];

                    return (
                        <article className="p-3 bg-[#333] rounded-md shadow-sm shadow-white border border-gray-700" key={dung.$id}>
                            <h3 className="text-white text-lg font-semibold mb-1">{dung.nombre}</h3>

                            <div className="flex gap-2">
                                {completadas.length > 0 ? (
                                    completadas.map((dd) => {
                                        const char = characters.find((c) => c.$id === dd.personaje)

                                        return (
                                            <span key={dd.$id} className="px-1 rounded-md text-sm font-semibold bg-emerald-500">
                                                <span className="w-5 h-5 rounded-full" style={{backgroundColor: StasisLevelColor(dd.stasis)}}></span>
                                                {char ? char.nombre : "Desconocido"}{" "}
                                            </span>
                                        )
                                    })
                                ) : (<p className="text-gray-400 text-sm">No hemos hecho esta mazmorra aún</p>)}
                            </div>
                        </article>
                    )
                })}
            </div>            
        </section>
    )
}

export default CharDungList