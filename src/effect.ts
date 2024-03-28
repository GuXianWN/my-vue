// 定义一个名为 ReactiveEffect 的类
class ReactiveEffect {
    private _fn: any // 私有属性 _fn 用于存储副作用函数

    // 构造函数，接受副作用函数 fn 和可选的调度器 scheduler 参数
    constructor(fn, public scheduler?) {
        this._fn = fn // 将传入的 fn 参数存储到私有属性 _fn 中
    }
 
    // 执行副作用函数的方法
    run() {
        activeEffect = this // 将当前 ReactiveEffect 实例赋值给全局变量 activeEffect
        return this._fn() // 调用副作用函数 _fn，并返回其执行结果
    }
}

// 创建一个 Map 类型的变量 targetMap，用于存储目标对象及其依赖关系
const targetMap = new Map()

// track 函数用于追踪响应式数据的访问依赖关系
export function track(target, key) {
    // 获取目标对象对应的依赖关系映射 depsMap
    let depsMap = targetMap.get(target);
    if (!depsMap) { // 如果 depsMap 不存在，则创建一个新的 Map 对象
        depsMap = new Map()
        targetMap.set(target, depsMap) // 将新创建的 depsMap 存储到 targetMap 中
    }

    // 获取目标对象属性对应的依赖关系集合 deps
    let deps: Set<ReactiveEffect> = depsMap.get(key);
    if (!deps) { // 如果 deps 不存在，则创建一个新的 Set 集合
        deps = new Set()
        depsMap.set(key, deps) // 将新创建的 deps 存储到 depsMap 中
    }
    deps.add(activeEffect) // 将当前的副作用函数（即 activeEffect）添加到 deps 集合中
}

// trigger 函数用于触发响应式数据的更新
export function trigger(target, key) {
    // 获取目标对象对应的依赖关系映射 depsMap
    let depsMap = targetMap.get(target)
    let deps: Set<ReactiveEffect> = depsMap.get(key); // 获取目标对象属性对应的依赖关系集合 deps
    deps.forEach((effect) => { // 遍历 deps 集合中的每个副作用函数
        if(effect.scheduler){ // 如果副作用函数提供了调度器 scheduler
            effect.scheduler() // 执行调度器 scheduler
        }else{ // 如果副作用函数没有提供调度器
            effect.run() // 直接执行副作用函数的 run 方法
        }
    })
}

// 定义一个全局变量 activeEffect，用于存储当前的副作用函数实例
let activeEffect: ReactiveEffect;

// effect 函数用于创建一个响应式副作用
export function effect(fn, options:any={}) {
    const _effect = new ReactiveEffect(fn, options.scheduler) // 创建一个 ReactiveEffect 实例 _effect
    _effect.run() // 执行副作用函数
    return _effect.run.bind(_effect) // 返回 ReactiveEffect 实例的 run 方法的绑定版本
}
