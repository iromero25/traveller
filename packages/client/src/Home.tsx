import { Search2Icon } from '@chakra-ui/icons'
import React, { ChangeEvent, useContext } from 'react'
import { Container, InputRightElement, Input, Heading, InputGroup, IconButton, VStack } from '@chakra-ui/react'

import type { FC } from 'react'
import DataTable from './DataTable'
import { getCitiesArray, lowerCaseKey } from './utils'

import { CitiesContext } from './cities.context'

export const Home: FC = () => {
  const { cities } = useContext(CitiesContext)
  const { filter, setFilter } = useContext(CitiesContext)
  const { displayedCities, setDisplayedCities } = useContext(CitiesContext)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setFilter(event.target.value)

  const filterCities = () => {
    const citiesToSearchArray = filter !== '' ? filter.split(',').map(lowerCaseKey) : []
    const citiesToSearchSet = new Set<string>(citiesToSearchArray)
    const filteredCities = getCitiesArray(cities, citiesToSearchSet)

    setDisplayedCities(filteredCities)
  }

  return (
    <VStack spacing="8">
      <Heading as="h1">Smart traveller</Heading>
      <Container maxW="container.md">
        <InputGroup>
          <Input
            placeholder="enter list of cities separated by commas"
            value={filter}
            aria-label="cities-input"
            onChange={event => handleChange(event)}
          />
          <InputRightElement
            children={<IconButton aria-label="search button" icon={<Search2Icon />} onClick={filterCities} />}
          />
        </InputGroup>
        {displayedCities.length > 0 && <DataTable />}
      </Container>
    </VStack>
  )
}
