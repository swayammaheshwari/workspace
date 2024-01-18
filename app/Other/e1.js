let obj1={
    f:function(p1,p2){
        console.log(this.a,p1,p2)
    }
};

let obj2={a:"mystring"}

obj1.f.call(obj2,1,2)