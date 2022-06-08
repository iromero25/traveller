import { App } from './App'
import { mockCities } from './mockData'
import { render, fireEvent, screen, act } from './test-utils'

jest.mock('./fetchApi', () => ({
  getCitiesRequest: () =>
    Promise.resolve({
      cities: mockCities,
    }),
  putCitiesRequest: () => Promise.resolve({}),
}))

describe('<App /> component', () => {
  let input: HTMLElement
  let searchBtn: HTMLElement

  beforeEach(async () => {
    render(<App />)
    await act(async () => {
      input = screen.getByPlaceholderText(/enter list of cities separated by commas/i)
      expect(input).toBeVisible()

      searchBtn = screen.getByRole('button', { name: 'search button' })
      expect(searchBtn).toBeVisible()
    })
  })

  test('renders the Header content', async () => {
    const HeadingComponent = screen.getByText(/^Smart traveller$/i)
    expect(HeadingComponent).toBeInTheDocument()
  })

  test('city is searched and displayed at the table', async () => {
    //window.history.pushState({}, 'Home', '/')

    await fireEvent.change(input, { target: { value: 'Auckland' } })
    await fireEvent.click(searchBtn)

    const mexico = screen.queryByText(/Mexico/i)
    const auckland = await screen.findByText(/Auckland/i)
    expect(mexico).toBeNull()
    expect(auckland).toBeVisible()

    const saveButton = screen.getByText(/Save/i)
    expect(saveButton).toBeDisabled()

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(2)

    fireEvent.click(checkboxes[0])
    expect(saveButton).toBeEnabled()
  })

  test('more than one cities are searched and displayed at the table', async () => {
    const mexicoCity = screen.queryByText(/Mexico City/i)
    const auckland = screen.queryByText(/Auckland/i)
    expect(mexicoCity).toBeNull()
    expect(auckland).toBeNull()

    await fireEvent.change(input, { target: { value: 'Auckland, Mexico City' } })
    await fireEvent.click(searchBtn)

    expect(await screen.findByText(/Auckland/i)).toBeVisible()
    expect(await screen.findByText(/Mexico City/i)).toBeVisible()

    const saveButtons = await screen.findAllByText(/Save/i)
    expect(saveButtons[0]).toBeDisabled()

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(4)
  })

  test('city fetching is case insensitive', async () => {
    await fireEvent.change(input, { target: { value: 'auckLAND' } })
    await fireEvent.click(searchBtn)

    expect(await screen.findByText(/auckland/i)).toBeVisible()
  })

  test('fetching a non-existing city doesnt display results', async () => {
    await fireEvent.change(input, { target: { value: 'Atlantis' } })
    await fireEvent.click(searchBtn)

    expect(screen.queryByText(/Atlantis/i)).toBeNull()
  })

  test('adding the same city to the input more than once displays only one entry', async () => {
    await fireEvent.change(input, { target: { value: 'Bangkok, bangkok, auckland' } })
    await fireEvent.click(searchBtn)

    expect((await screen.findAllByText(/bangkok/i)).length).toBe(1)
  })

  test('save button is only enabled when there is data that has changed', async () => {
    await fireEvent.change(input, { target: { value: 'Bangkok' } })
    await fireEvent.click(searchBtn)

    expect(await screen.findByText(/Bangkok/i)).toBeVisible()
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(2)

    const saveButton = await screen.findByText(/Save/i)
    expect(saveButton).toBeDisabled()

    const visitedBangkokCheck = checkboxes[0]
    fireEvent.click(visitedBangkokCheck)
    expect(saveButton).toBeEnabled()
  })

  test('visited city is displayed in the right list', async () => {
    await fireEvent.change(input, { target: { value: 'Auckland' } })
    await fireEvent.click(searchBtn)

    const checkboxes = await screen.findAllByRole('checkbox')
    expect(checkboxes.length).toBe(2)

    const visitedAucklandCheck = checkboxes[0]
    fireEvent.click(visitedAucklandCheck)

    const saveButton = await screen.findByText(/Save/i)
    expect(saveButton).toBeEnabled()
    fireEvent.click(saveButton)

    const links = screen.getAllByRole('link')
    const visitedLink = links[2]
    const wishlistLink = links[3]

    fireEvent.click(visitedLink)
    expect(await screen.findByText(/Auckland, New Zealand/i)).toBeVisible()

    fireEvent.click(wishlistLink)
    expect(screen.queryByText(/Auckland, New Zealand/i)).toBeNull()
  })
})
