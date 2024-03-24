class ReactiveEffect {
    private _fn: any

    constructor(fn) {
        this._fn = fn
    }

    run() {
        activeEffect = this
        this._fn()
    }
}

const targetMap = new Map()
export function track(target, key) {
    // target -> key -> deps
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let deps: Set<ReactiveEffect> = depsMap.get(key);
    if (!deps) {
        deps = new Set()
        depsMap.set(key, deps)
    }
    deps.add(activeEffect)
}

export function trigger(target, key) {
    let depsMap = targetMap.get(target)
    let deps: Set<ReactiveEffect> = depsMap.get(key);
    deps.forEach((dep) => {
        dep.run()
    })
}

let activeEffect: ReactiveEffect;
export function effect(fn) {
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}