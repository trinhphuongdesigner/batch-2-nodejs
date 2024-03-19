let list = [
  {
    name: "phuong",
    lastName: "Trinh",
    point: 3,
  },
  {
    name: "phuong2",
    lastName: "Trinh",
    point: 4,
  },
  {
    name: "phuong3",
    lastName: "Trinh",
    point: 10,
  },
  {
    name: "phuong4",
    lastName: "Trinh",
    point: 10,
  },
]

// map
// list = list.filter(item => item.point < 5);
// const newList = list.map(item => {
//   if (item.point < 5) {
//     return item
//   }
//   return
// })

// newList.forEach(item => {
//   // console.log(`${item.name} ${item.lastName}`)
//   if (item) console.log(`${item.name} ${item.lastName}`)
// })

// // forEach
const newList = [];
list.forEach(item => {
  if (item.point < 5) {
    newList.push(item)
  }
})

newList.forEach(item => {
  console.log(`${item.name} ${item.lastName}`)
  // if (item) console.log(`${item.name} ${item.lastName}`)
})

// filter
// list = list.filter(item => item.point < 5);
// list.forEach(item => {
//   console.log(`${item.name} ${item.lastName}`)
// })

// function checkPoint(point) 

// list.forEach(item => {
//   console.log(`${item.name} ${item.lastName}`)
// })

// list.map(item => {
//   console.log(`${item.name} ${item.lastName}`)
// })
