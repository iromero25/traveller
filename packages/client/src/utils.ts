import { City } from '../../api/src/cities/types'

export const BASE_URL = 'http://localhost:4000/rest'

export const getPutRequestOptions = (visited: boolean, wishlist: boolean) => ({
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ visited, wishlist }),
})

export const lowerCaseKey = (keyName: string) => keyName.trim().toLowerCase()

export const convertArrayIntoHash = (cities: City[]): Record<string, City> => {
  return cities.reduce((result, city) => {
    const key = lowerCaseKey(city.name)
    return { ...result, [key]: city }
  }, {})
}

export const getCitiesArray = (hashTable: Record<string, City>, citiesToExtract: string[]): City[] => {
  const citiesArray: City[] = []
  citiesToExtract.forEach(cityName => {
    const key = lowerCaseKey(cityName)
    if (hashTable[key]) {
      citiesArray.push(hashTable[key])
    }
  })
  return citiesArray
}
