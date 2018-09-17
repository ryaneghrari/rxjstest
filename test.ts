import { Observable, Subject, ReplaySubject, from, of, range, forkJoin, merge } from 'rxjs';
import { map, filter, switchMap, tap, flatMap, concatMap, mergeMap, pluck, delay,mergeAll, combineAll, scan, toArray  } from 'rxjs/operators';


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
let userGroupIds$ = of([{id:1},{id:2},{id:3},{id:4}]) //single event which is an arr of userGroups
.pipe(
  flatMap( ugs => from(ugs) ), //convert arr into stream
  mergeMap(
    //project
    ug => getPhoneNumbers(ug.id),
    //resultSelector
    (oVal, iVal, oIndex, iIndex) => {
      oVal.phoneNumber = iVal;
      return oVal;
    },
    //concurrent
    1 //same as concat map if set to 1
  ),
  toArray() //collects all emitted
)


userGroupIds$.subscribe(console.log)


function getPhoneNumbers(id: number){
  let n = [0,0,0,0,0,0,0,0,0].map(n => n + id).toString();

  if(id === 3){
    return of(n).pipe(delay(4000));
  }
  else{
    return of(n).pipe(delay(1000));
  }

}
function l(name){
  console.log(`-----------------${name}-------------------`);
}
