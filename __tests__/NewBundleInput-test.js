import React from 'react'
import {shallow} from 'enzyme'
import NewBundleInput from '../src/components/NewBundleInput'
import {CreateBundle} from '../src/commands'

describe("NewBundleInput", () => {
  const dispatch = jest.fn()
  const onComplete = jest.fn()
  const input = shallow(<NewBundleInput dispatch={dispatch} onComplete={onComplete}/>)

  it("renders an input", () => {
    expect(input.matchesElement(
      <input className='new-bundle-input' autoFocus type='text' placeholder='Bundle name...' />
    ))
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
        input.simulate('keyup', {keyCode: 13, target: {value: 'foobar'}})
        expect(dispatch).toBeCalledWith(CreateBundle({name: 'foobar'}))
        expect(onComplete).toBeCalled()
      })
    })
  })
})
