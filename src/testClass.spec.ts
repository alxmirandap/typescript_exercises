import { TestClass } from './testClass'

it('Simple test', () => {
    let c = new TestClass('hello')
    expect(c.name).toBe('hello')
})

