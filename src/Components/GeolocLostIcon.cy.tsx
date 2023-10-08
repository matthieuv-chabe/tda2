import React from 'react'
import { GeolocLostIcon } from './GeolocLostIcon'

describe('<GeolocLostIcon />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<GeolocLostIcon />)
  })
})