import React from 'react'
import {shallow} from 'enzyme'
import Navbar from '../src/components/Navbar'
import NewBundleInput from '../src/components/NewBundleInput'
import EditBundleInput from '../src/components/EditBundleInput'

describe("Navbar", () => {
  const dispatch = new Function
  const navbar = shallow(<Navbar dispatch={dispatch} isEditing={false}/>)

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

    it("sets state.isCreating to true", () => expect(navbar.state().isCreating).toBe(true))

    it("renders a NewBundleInput", () => {
      expect(navbar.find(NewBundleInput).props().dispatch).toBe(dispatch)
    })

    it("renders a CancelButton", () => {
      expect(navbar.find('#nav-btn').text()).toBe('Cancel')
    })
  })

  describe("when props.isEditing is true", () => {
    const toggleEditing = new Function
    const editProps = {
      id: 'foo',
      name: 'Foobar'
    }

    it("renders an EditBundleInput", () => {
      let navbar = shallow(<Navbar dispatch={dispatch} toggleEditing = {toggleEditing} isEditing={true} editProps={editProps}/>)
      expect(navbar.find(EditBundleInput).props().dispatch).toBe(dispatch)
      expect(navbar.find(EditBundleInput).props().onComplete).toBe(toggleEditing)
      expect(navbar.find(EditBundleInput).props().editProps).toBe(editProps)
    })
  })
})
