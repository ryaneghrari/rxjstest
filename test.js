"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
//in order firing one after the other
// let userGroupIds$ = of({id:1},{id:2},{id:3},{id:4})
// .pipe(
//   concatMap(
//     //project
//     ug => getPhoneNumbers(ug.id),
//     //resultSelector
//     (oVal, iVal, oIndex, iIndex) => {
//       // let arr = [oIndex, oVal, iIndex, iVal];
//       oVal.phoneNumber = iVal;
//       let cUg = oVal;
//       return cUg;
//     }
//   )
// )
//out of order but outter observables still match inner (correct ug with correct numbers)
var userGroupIds$ = rxjs_1.of([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
    .pipe(operators_1.flatMap(function (ugs) { return rxjs_1.from(ugs); }), //convert arr into stream
operators_1.mergeMap(
//project
function (ug) { return getPhoneNumbers(ug.id); }, 
//resultSelector
function (oVal, iVal, oIndex, iIndex) {
    // let arr = [oIndex, oVal, iIndex, iVal];
    oVal.phoneNumber = iVal;
    var cUg = oVal;
    return cUg;
}, 
//concurrent
1 //same as concat map if set to 1
), operators_1.toArray());
userGroupIds$.subscribe(console.log);
function getPhoneNumbers(id) {
    var n = [0, 0, 0, 0, 0, 0, 0, 0, 0].map(function (n) { return n + id; }).toString();
    if (id === 3) {
        return rxjs_1.of(n).pipe(operators_1.delay(4000));
    }
    else {
        return rxjs_1.of(n).pipe(operators_1.delay(1000));
    }
}
function l(name) {
    console.log("-----------------" + name + "-------------------");
}
