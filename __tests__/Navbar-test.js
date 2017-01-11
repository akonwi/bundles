import React from 'react'
import {shallow} from 'enzyme'
import Navbar from '../src/components/Navbar'
import NewBundleInput from '../src/components/new-bundle-input'

describe("Navbar", () => {
  const dispatch = new Function
  const navbar = shallow(<Navbar dispatch={dispatch}/>)

  it("renders", () => {
    expect(navbar.matchesElement(
      <div>
        <div className='nav-block small left'></div>
        <div className='nav-block big'>
          <h2 className='logo'>Bundles</h2>
        </div>
        <div className='nav-block small right'>
          <a className='nav-btn' href='#'>New</a>
        </div>
      </div>
    ))
  })

  describe("when the create button is clicked", () => {
    beforeAll(() => {
      navbar.find('.nav-btn').simulate('click')
    })

    it("state.isCreating becomes true", () => expect(navbar.state().isCreating).toBe(true))

    it("renders a NewBundleInput", () => {
      expect(navbar.find(NewBundleInput).props().dispatch).toBe(dispatch)
    })

    it("renders a CancelButton", () => {
      expect(navbar.find('.nav-btn').text()).toBe('Cancel')
    })
  })
})
