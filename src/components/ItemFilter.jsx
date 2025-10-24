import { useState } from "react"

export default function ItemFilter({ defaultItem, setFilterItem }) {
    const [selectedItem, setSelectedItem] = useState(defaultItem)
    const itemFilters = [
        {id: 120, name: "Amuleto"},
        {id: 132, name: "Capa"},
        {id: 134, name: "Casco"},
        {id: 138, name: "Hombreras"}
    ]

    return (
        <div className="text-white relative group cursor-pointer">
            <span className="px-1 text-center rounded-md bg-[#555]">{selectedItem.name}</span>
            <div className="absolute top-5 z-20 bg-[#333] px-3 py-1 gap-1 group-hover:flex flex-col items-center hidden rounded-sm shadow-md">
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