import { effect } from "../effect";
import { reactive } from "../reactive"

describe('effect', () => {
    it('effect track & trigger', () => {
        const user = reactive({
            age: 10
        })
        let nextAge;

        effect(() => {
            nextAge = user.age + 1
        })

        expect(nextAge).toBe(11)
        user.age++
        expect(nextAge).toBe(12)
    })

    it('return runner when call effect', () => {
        let foo = 10
        const runner = effect(() => {
            foo++
            console.log("--> 1111");
            return 'demo'
        })

        expect(foo).toBe(11)
        const r = runner()
        expect(foo).toBe(12)
        expect(r).toBe('demo')
    })

    it('scheduler', () => {
        // effect 初始化会执行 fn set value执行scheduler 执行runner执行fn

        // schedule 的存在主要是为了解决两个问题：多次触发更新和手动控制更新时机。
        // 多次触发更新：假设你在一次操作中多次更改了依赖的状态，如果没有 schedule，那么每次状态变更都会立即触发依赖更新，这就会导致性能上的浪费。schedule 的存在可以在一次操作完成后统一进行更新，避免了多次无意义的更新。
        // 手动控制更新时机：在某些情况下，你可能希望能够控制更新的时机，比如在一次复杂操作完成后再进行更新，而不是每次状态变更都立刻更新。这时你就可以利用 schedule 来把更新操作放在异步队列中，然后在需要的时候进行更新。

        let dummy
        let run: any

        const scheduler = jest.fn(() => {
            console.log("-----> schduler <-----");
        })
        const obj = reactive({
            foo: 1
        })
        const runner = effect(() => {
            dummy = obj.foo
        }, { scheduler })

        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)
        expect(dummy).toBe(1)
    })
})