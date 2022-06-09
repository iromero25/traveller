import type { FC } from 'react'

import { City } from '../../api/src/cities/types'
import { ListItem, UnorderedList } from '@chakra-ui/react'

interface Props {
  cities: City[]
}

const CitiesList: FC<Props> = ({ cities }) => (
  <UnorderedList>
    {cities.map(({ id, name, country }) => (
      <ListItem key={id}>{`${name}, ${country}`}</ListItem>
    ))}
  </UnorderedList>
)

export default CitiesList
