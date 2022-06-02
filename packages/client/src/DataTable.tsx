import React, { FC, useContext, useEffect, useState } from 'react'
import { Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react'

import { lowerCaseKey } from './utils'
import CustomCheckbox from './CustomCheckbox'
import { putCitiesRequest } from './fetchApi'
import { CitiesContext } from './cities.context'
import { City } from '../../api/src/cities/types'

const DataTable: FC = () => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const { cities, displayedCities, setCities } = useContext(CitiesContext)

  const cleanUp = useEffect(() => {
    // cleanup function: avoid memory leaks
    return () => {
      setIsUpdating(false)
    }
  }, [displayedCities])

  const updateCity = (cityToUpdate: City) => {
    const { id, name, visited, wishlist } = cityToUpdate
    setIsUpdating(true)
    putCitiesRequest(id, visited, wishlist)
      .then(_data => {
        const updatedCities = { ...cities }
        const key = lowerCaseKey(name)
        updatedCities[key] = { ...cityToUpdate }
        setCities(updatedCities)
      })
      .catch(error => console.log(error))
      .finally(() => setIsUpdating(false))
  }

  const displayedCityMatchesCityInArray = (displayedCity: City) => {
    const key = lowerCaseKey(displayedCity.name)
    const cityFromHash = cities[key]
    return displayedCity.visited === cityFromHash.visited && displayedCity.wishlist === cityFromHash.wishlist
  }

  const tableBody = displayedCities.map(city => {
    const { id, name, country } = city
    const displayedCityIsNotModified = displayedCityMatchesCityInArray(city)
    return (
      <Tr key={id}>
        <Td>{name}</Td>
        <Td>{country}</Td>
        <Td>
          <CustomCheckbox city={city} attrToChange={'visited'} />
        </Td>
        <Td>
          <CustomCheckbox city={city} attrToChange={'wishlist'} />
        </Td>
        <Td>
          <Button onClick={() => updateCity(city)} disabled={displayedCityIsNotModified} isLoading={isUpdating}>
            Save
          </Button>
        </Td>
      </Tr>
    )
  })

  return (
    <TableContainer>
      <Table variant="simple" disabled={true}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Country</Th>
            <Th>Visited</Th>
            <Th>Whishlist</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>{tableBody}</Tbody>
      </Table>
    </TableContainer>
  )
}

export default DataTable
