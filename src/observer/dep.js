import { watch } from "rollup";

let id=0;
class Dep{// 每个属性都给他分配一个dep，dep可以用来存放watcher，watcher中还要存放这个dep
    constructor(){
        this.id=id++;
        this.subs=[];// 用来存放watcher的
    }
    depend(){
        //Dep.target Dep里要存放这个watcher,watcher要存放dep，多对对的关系
        if(Dep.target){
            Dep.target.addDep(this);
        }
    }
    addSub(watcher){
        this.subs.push(watcher);
    }
    notify(){
        this.subs.forEach(watcher=>{
            watcher.update();
        })
    }
}
Dep.target=null;

export function pushTarget(watcher){
    Dep.target=watcher;
}

export function popTarget(){
    Dep.target=null;
}

export default Dep;