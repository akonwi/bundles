import React from 'react'
import {shallow} from 'enzyme'
import Navbar from '../src/components/Navbar'
import NewBundleInput from '../src/components/NewBundleInput'

describe("Navbar", () => {
  const dispatch = new Function
  const navbar = shallow(<Navbar dispatch={dispatch}/>)

  it("renders", () => {
    expect(navbar.matchesElement(
      <div>
        <div></div>
        <div>
          <h2>Bundles</h2>
        </div>
        <div>
          <a href='#'>New</a>
        </div>
      </div>
    )).toBe(true)
  })

  describe("when the create button is clicked", () => {
    beforeAll(() => {
      navbar.find('#nav-btn').simulate('click')
    })

    it("state.isCreating becomes true", () => expect(navbar.state().isCreating).toBe(true))

    it("renders a NewBundleInput", () => {
      expect(navbar.find(NewBundleInput).props().dispatch).toBe(dispatch)
    })

    it("renders a CancelButton", () => {
      expect(navbar.find('#nav-btn').text()).toBe('Cancel')
    })
  })
})
