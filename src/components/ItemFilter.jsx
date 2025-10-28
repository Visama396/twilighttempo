import { useState } from "react"

export default function ItemFilter({ defaultItem, setFilterItem }) {
    const [selectedItem, setSelectedItem] = useState(defaultItem)
    const [showDrop, setShowDrop] = useState(false)
    const itemFilters = [
        {id: [134], name: "Casco"},
        {id: [120], name: "Amuleto"},
        {id: [136], name: "Coraza"},
        {id: [103], name: "Anillo"},
        {id: [119], name: "Botas"},
        {id: [132], name: "Capa"},
        {id: [138], name: "Hombreras"},
        {id: [133], name: "Cinturón"},
        {id: [108,110,113,115,254], name: "Armas (1 mano)"},
        {id: [101,111,114,117,223,253], name: "Armas (2 manos)"},
        {id: [108,101,110,111,113,114,115,117,223,253,254], name: "Armas principales"},
        {id: [112,189], name: "Armas secundarias"}
    ]

    return (
        <div className="text-white relative cursor-pointer" onClick={() => { setShowDrop(!showDrop) }}>
            <span className="px-1 text-center rounded-md bg-[#555]">{selectedItem.name}</span>
            <div className={`absolute top-5 z-20 bg-[#333] px-3 py-1 gap-1 ${showDrop? "flex":"hidden"} flex-col items-center rounded-sm shadow-md w-45`}>
                {
                    itemFilters.map(item => {
                        return (
                            <p className="hover:bg-[#555] px-1 text-center w-full rounded-md" onClick={() => {setSelectedItem(item); setFilterItem(item)}}>{item.name}</p>
                        )
                    })
                }
            </div>
        </div>
    )
}