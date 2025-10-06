import { useState, useEffect } from "react"
import { TablesDB } from "appwrite"
import { appwriteAccount, appwriteClient } from "../service/appwriteConnection"

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

    const factor = (level - 1) / 9

    const color = interpolateColor("#ffe6f0", "ff007f", factor)

    return color
}

function CharDungList() {

    const [dungeons, setDungeons] = useState([])
    const [characters, setCharacters] = useState([])
    const [dungeonsDone, setDungeonsDone] = useState([])

    useEffect(() => {
        getDungeons().then(response => {
            setDungeons(response.rows)
        })

        getDungeonsDone().then(response => {
            setDungeonsDone(response.rows)
        })

        getCharacters().then(response => {
            setCharacters(response.rows)
        })
    }, [])

    return (
        <section className="p-2">
            <h2 className="text-white text-2xl">Mazmorras Franja 200</h2>
            <div className="grid gap-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {dungeons && dungeons.length > 0 ? dungeons.map(dung => (
                    <article className="p-2 bg-[#333] rounded-md" key={dung.$id}>
                        <h3 className="text-white text-lg">{dung.nombre}</h3>
                        <div>
                            {dungeonsDone && dungeonsDone.length > 0 && dungeonsDone.find(dd => dung.$id == dd.mazmorra) ? 
                                dungeonsDone.map(dd => (<p className="text-white" key={dd.$id}>{characters.find(chr => chr.$id == dd.personaje).nombre} <span className="px-1 rounded-md" style={{backgroundColor: StasisLevelColor(dd.Stasis)}}>S{dd.Stasis}</span></p>)) 
                                : <p>No hemos hecho esta mazmorra aún</p>}
                        </div>
                    </article>                
                )) 
                : <div>No se han encontrado mazmorras</div>}
            </div>            
        </section>
    )
}

export default CharDungList