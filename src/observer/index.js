import { isObject } from "../util";
import { arrayMethods } from "./array";

// 类监测数据的变化，类有类型；对象无类型
class Observe {
    constructor(data) { // 对对象中的所有属性进行劫持
        data.__ob__ = this; //所有被劫持过的属性都有__ob__属性
        if (Array.isArray(data)) {
            // 数组的劫持逻辑
            // 对数组原来的方法进行改写，切片编程 高阶函数
            data.__proto__ = arrayMethods;
            // 如果数组中的数据是对象类型，需要监控对象的变化
            this.observeArray(data);
        } else {
            this.walk(data); // 对象的劫持逻辑
        }
    }
    observeArray(data) { // 对数组中的数组 和数组中的对象再次劫持，递归
        data.forEach(item => {
            observe(item);
        })
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key]);
        })
    }
}

// vue2会对对象进行遍历，将每个属性用defineProperty重新进行定义，性能差
function defineReactive(data, key, value) {// value有可能是对象
    observe(value); // 本身用户默认值是对象套对象，需要递归处理（性能差）
    Object.defineProperty(data, key, {
        get() {
            return value;
        },
        set(newV) {
            observe(newV); //如果用户赋值一个新对象，需要将这个对象进行劫持
            value = newV;
        }
    })
}

export function observe(data) {
    // 如果是对象才监测
    if (!isObject(data)) {
        return;
    }

    if (data.__ob__) {
        return;
    }
    
    // 默认最外层的data必须是一个对象
    return new Observe(data);
}