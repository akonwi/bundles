import React from 'react'
import {shallow} from 'enzyme'
jest.mock('../lib/chrome-storage')
import BundleList from '../src/components/BundleList'
import BundleItem from '../src/components/BundleItem'

describe("BundleList", () => {
  const dispatch = new Function
  const toggleEditing = new Function
  const bundles = [
    { id: 'id1', name: 'first', links: ['foo://bar'] },
    { id: 'id2', name: 'second', links: ['foo://baz'] }
  ]

  it("renders a list of bundles", () => {
    const list = shallow(<BundleList bundles={bundles} dispatch={dispatch} toggleEditing={toggleEditing}/>)

    expect(list.matchesElement(
      <ul>
        <BundleItem dispatch={dispatch} id='id1' name={bundles[0].name} links={bundles[0].links} toggleEditing={toggleEditing}/>
        <BundleItem dispatch={dispatch} id='id2' name={bundles[1].name} links={bundles[1].links} toggleEditing={toggleEditing}/>
      </ul>
    )).toBe(true)
  })
})
