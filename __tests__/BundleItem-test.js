import React from 'react'
import {shallow} from 'enzyme'
jest.mock('../lib/chrome-storage')
import BundleItem from '../src/components/BundleItem'

describe("BundleItem", () => {
  const name = 'Foobar Item'
  const itemId = 'item-id'
  const link = {url: 'foobar.com', title: 'Foobar'}

  it("renders a li with the links and function buttons", () => {
    const bundleItem = shallow(<BundleItem name={name} links={[link]}/>)
    expect(bundleItem.is('li')).toBe(true)
    expect(bundleItem.find('.links').children().length).toBe(1)
    expect(bundleItem.find('h4').text()).toBe(name)
  })

  describe("the open/close toggle", () => {
    it("toggles the state and classes of the ", () => {
      const bundleItem = shallow(<BundleItem name={name} links={[link]}/>)
      expect(bundleItem.state().open).toBe(false)
      expect(bundleItem.find('.triangle').hasClass('down')).toBe(false)
      expect(bundleItem.find('.links').hasClass('open')).toBe(false)

      bundleItem.find('h4').simulate('click')
      expect(bundleItem.state().open).toBe(true)
      expect(bundleItem.find('.triangle').hasClass('down')).toBe(true)
      expect(bundleItem.find('.links').hasClass('open')).toBe(true)
    })
  })

  describe("control buttons", () => {
    const dispatch = jest.fn()
    let bundleItem

    beforeEach(() => {
      bundleItem = shallow(<BundleItem id={itemId} name={name} links={[link]} dispatch={dispatch}/>)
    })

    describe("the open button", () => {
      it("opens the links in new tabs", () => {
        window.chrome = {
          tabs: { create: jest.fn() }
        }

        const openButton = bundleItem.find('.controls').children().first()
        expect(openButton.is('a[title="Open all"]')).toBe(true)
        openButton.find('i').simulate('click')
        expect(chrome.tabs.create).toHaveBeenCalledWith({url: link.url})
      })
    })

    describe("the openButton button", () => {
      it("dispatches an AddLink command", () => {
        window.chrome = {
          tabs: {
            getSelected: (_, cb) => cb({url: 'baz.com', title: 'Baz'})
          }
        }
        const expectedCommand = {
          message: {
            id: itemId,
            title: 'Baz',
            url: 'baz.com'
          },
          name: 'AddLink'
        }

        const addButton = bundleItem.find('.controls').children().at(1)
        expect(addButton.is('a[title="Add current page"]')).toBe(true)
        addButton.find('i').simulate('click')
        expect(dispatch).toHaveBeenCalledWith(expectedCommand)
      })
    })

    describe("the delete button", () => {
      it("dispatches an DeleteBundle command", () => {
        const expectedCommand = {
          message: {
            id: itemId
          },
          name: 'DeleteBundle'
        }

        const deleteButton = bundleItem.find('.controls').children().last()
        expect(deleteButton.is('a[title="Delete"]')).toBe(true)
        deleteButton.find('i').simulate('click')
        expect(dispatch).toHaveBeenCalledWith(expectedCommand)
      })
    })
  })
})
