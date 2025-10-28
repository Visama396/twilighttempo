import { useState } from "react"

export default function LevelFilter({ defaultLevel, setFilterLevel }) {
    const [selectedLevel, setSelectedLevel] = useState(defaultLevel)
    const [showDrop, setShowDrop] = useState(false)

    return (
        <div className="text-white relative cursor-pointer" onClick={() => { setShowDrop(!showDrop) }}>
            <span className="px-1 text-center rounded-md bg-[#555]">{selectedLevel}</span>
            <div className={`absolute top-5 left-[-10px] z-20 bg-[#333] px-3 py-1 gap-1 ${showDrop? "flex": "hidden"} flex-col items-center rounded-md shadow-md`}>
                {
                    Array.from({ length: Math.floor((245-20)/15)+1}, (_, i) => 20 + i * 15).map(i => (
                        <p className="hover:bg-[#555] px-1 text-center w-full rounded-md" onClick={() => {setSelectedLevel(i); setFilterLevel(i)}}>{i}</p>
                    ))
                }
            </div>
        </div>
    )
}