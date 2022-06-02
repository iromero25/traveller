import React, { Dispatch, FC, SetStateAction, createContext, useState } from 'react'
import { City } from '../../api/src/cities/types'

interface ICitiesContext {
  cities: Record<string, City>
  filter: string
  displayedCities: City[]
  setCities: Dispatch<SetStateAction<Record<string, City>>>
  setFilter: (filter: string) => void
  setDisplayedCities: (cities: City[]) => void
}

export const CitiesContext = createContext<ICitiesContext>({
  cities: {},
  filter: '',
  displayedCities: [],
  setCities: () => null,
  setFilter: () => null,
  setDisplayedCities: () => null,
})

export const CitiesProvider: FC = ({ children }) => {
  const [cities, setCities] = useState<Record<string, City>>({})
  const [filter, setFilter] = useState<string>('')
  const [displayedCities, setDisplayedCities] = useState<City[]>([])
  const value = { cities, filter, displayedCities, setCities, setFilter, setDisplayedCities }
  return <CitiesContext.Provider value={value}>{children}</CitiesContext.Provider>
}
