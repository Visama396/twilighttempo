import { useState } from "react"

export default function SortFilter({ defaultSort, setFilterSort }) {
    const [selectedSort, setSelectedSort] = useState(defaultSort)
    const sortFilters = [
        {id: 0, name: "Dominios ↑"},
        {id: 1, name: "Dominios ↓"},
        {id: 2, name: "Resistencias ↑"},
        {id: 3, name: "Resistencias ↓"}
    ]

    return (
        <div className="text-white relative group cursor-pointer">
            <span className="px-1 text-center rounded-md bg-[#555]">{selectedSort.name}</span>
            <div className="w-35 absolute top-5 left-[-10px] z-20 bg-[#333] px-3 py-1 gap-1 group-hover:flex flex-col items-center hidden rounded-md shadow-md">
                {
                    sortFilters.map(item => {
                        return (
                            <p className="hover:bg-[#555] px-1 text-center w-full rounded-md" onClick={() => {setSelectedSort(item); setFilterSort(item)}}>{item.name}</p>
                        )
                    })
                }
            </div>
        </div>
    )
}