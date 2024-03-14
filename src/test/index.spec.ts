import {demo} from "../index"

it('init',()=>{
    expect(true).toBe(true);
    expect(demo(1,1)).toBe(2)
})