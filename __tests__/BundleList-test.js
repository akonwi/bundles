import React from 'react'
import {shallow} from 'enzyme'
jest.mock('../lib/chrome-storage')
import BundleList from '../src/components/BundleList'
import BundleItem from '../src/components/BundleItem'

describe("BundleList", () => {
  const dispatch = new Function
  const bundles = {
    "id1": { name: 'first', links: ['foo://bar'] },
    "id2": { name: 'second', links: ['foo://baz'] }
  }

  it("renders a list of bundles", () => {
    const list = shallow(<BundleList bundles={bundles} dispatch={dispatch}/>)

    expect(list.matchesElement(
      <ul className='bundles'>
        <BundleItem dispatch={dispatch} id='id1' name={bundles.id1.name} links={bundles.id1.links}/>
        <BundleItem dispatch={dispatch} id='id2' name={bundles.id2.name} links={bundles.id2.links}/>
      </ul>
    )).toBe(true)
  })
})
