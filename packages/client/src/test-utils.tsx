import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { CitiesProvider } from './cities.context'
import { render, RenderOptions } from '@testing-library/react'

const AllTheProviders: React.FC = ({ children }) => {
  return (
    <BrowserRouter>
      <CitiesProvider>{children}</CitiesProvider>
    </BrowserRouter>
  )
}

const customRender = (ui: JSX.Element, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
