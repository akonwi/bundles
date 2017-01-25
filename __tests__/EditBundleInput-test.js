import React from 'react'
import {shallow} from 'enzyme'
import EditBundleInput from '../src/components/EditBundleInput'
import {EditBundle} from '../src/commands'

describe("EditBundleInput", () => {
  const dispatch = jest.fn()
  const onComplete = jest.fn()
  const editProps = {
    id: 'foo',
    name: 'Foobar'
  }
  const input = shallow(<EditBundleInput dispatch={dispatch} onComplete={onComplete} editProps={editProps}/>)

  it("renders an input", () => {
    expect(input.matchesElement(
      <input className='new-bundle-input' autoFocus type='text' defaultValue={editProps.name}/>
    )).toBe(true)
  })

  describe("when the input is empty", () => {
    describe("when the enter key is pressed", () => {
      it("doesn't do anything", () => {
        input.simulate('keyup', {keyCode: 13, target: {value: ''}})
        expect(dispatch).not.toBeCalled()
        expect(onComplete).not.toBeCalled()
      })
    })
  })

  describe("when the input has text", () => {
    describe("when the enter key is pressed", () => {
      it("dispatches a CreateBundle command and calls onComplete", () => {
        input.simulate('keyup', {keyCode: 13, target: {value: 'Barfoo'}})
        expect(dispatch).toBeCalledWith(EditBundle({id: editProps.id, name: 'Barfoo'}))
        expect(onComplete).toBeCalled()
      })
    })
  })
})
