import React from 'react'
import {shallow} from 'enzyme'
import BundleLink from '../src/components/BundleLink'

describe("BundleLink", () => {
  const url = 'foo://bar.com'
  const title = 'Foobar'
  let bundleLink, link

  beforeEach(() => {
    bundleLink = shallow(<BundleLink title={title} url={url}/>)
    link = bundleLink.find('a')
  })

  it("creates a li with a link", () => {
    expect(bundleLink.is('li')).toBe(true)
    expect(link.text()).toEqual(title)
  })

  it("opens a new tab with the url of the link", () => {
    window.chrome = {
      tabs: {
        create: jest.fn()
      }
    }

    link.simulate('click')

    expect(chrome.tabs.create).toHaveBeenCalledWith({url})
  })
})
