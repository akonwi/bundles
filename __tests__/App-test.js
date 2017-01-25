import React from 'react'
import {shallow} from 'enzyme'
jest.mock('../lib/chrome-storage')
import App from '../src/components/App'
import Navbar from '../src/components/Navbar'
import BundleList from '../src/components/BundleList'

describe("App", () => {
  const dispatch = new Function
  const app = shallow(<App dispatch={dispatch}/>)

  it("renders loading text before data is received", () => {
    expect(app.matchesElement(
      <div>
        <Navbar dispatch={dispatch}/>
        <div>Loading...</div>
      </div>
    )).toBe(true)
  })

  describe("when data is received", () => {
    const state = {
      bundles: {
        foo: {
          name: 'foo',
          links: []
        }
      }
    }

    beforeAll(() => {
      app.setState(state)
    })

    it("updates it state", () => expect(app.state()).toMatchObject(state))

    it("renders the BundleList", () => {
      expect(app.matchesElement(
        <div>
          <Navbar dispatch={dispatch}/>
          <BundleList dispatch={dispatch} bundles={state.bundles}/>
        </div>
      )).toBe(true)
    })
    
    describe("when the state.isEditing is true", () => {
      it("passes that state to Navbar", () => {
        app.setState({isEditing: true})
        expect(app.matchesElement(
          <div>
            <Navbar dispatch={dispatch} isEditing={true}/>
            <BundleList dispatch={dispatch} bundles={state.bundles}/>
          </div>
        )).toBe(true)
      })
    })
  })
})
