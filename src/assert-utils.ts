export function assertIsSubset(expected: any, actual: any) : void {
    for(let i in expected) {
        if(actual[i]===undefined) 
            throw "There is no " + i + " field";
    
        var left = expected[i];
        var right = actual[i];
        if(left === right)
            continue;
        
        if(typeof left==="object") {
            assertIsSubset(left, right);
            continue;
        }

        throw "Field " + i + " has different value";
    }
}

