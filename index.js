// Init
window.onload = function() {
  // Event listeners
  elements.submitButton.addEventListener('click', init);

  // Filter + sort
  elements.castIronFilter.addEventListener('click', castIronFilter);
  elements.triplyFilter.addEventListener('click', triplyFilter);
  elements.tnsFilter.addEventListener('click', tnsFilter);
  elements.stonewareFilter.addEventListener('click', stonewareFilter);
  elements.mugsFilter.addEventListener('click', mugsFilter);
  elements.miscellaneousFilter.addEventListener('click', miscellaneousFilter);
  elements.unassignedFilter.addEventListener('click', unassignedFilter);
  elements.allFilter.addEventListener('click', allFilter);
  elements.alphabeticalSort.addEventListener('click', alphabeticalSort);
  elements.quantitySort.addEventListener('click', quantitySort);
  elements.costSort.addEventListener('click', costSort);
  elements.totalCostSort.addEventListener('click', totalCostSort);
};


const elementIds = [
  // Main Components
  'submitButton', 'spreadsheetInput', 'tableBody', 'table', 
  // Filters
  'castIronFilter', 'triplyFilter', 'tnsFilter', 'stonewareFilter',
  'mugsFilter', 'miscellaneousFilter', 'unassignedFilter', 'allFilter',
  'alphabeticalSort', 'quantitySort', 'costSort', 'totalCostSort',
  // Stats
  'totalQuantityStat', 'totalCostStat', 'avgCostStat', 'castIronPercentage', 
  'triplyPercentage', 'tnsPercentage', 'stonewarePercentage', 'miscellaneousPercentage', 
  'unassignedPercentage', 
  // Charts
  'chartContainer', 'errorPercentage', 'filterTitle'
];

const elements = {};

// loop over ID's and assign each id their element
for (const id of elementIds) {
  elements[id] = document.querySelector(`#${id}`);
}

// Toggles for sorts
let alphabeticalToggle = false;
let quantityToggle = false;
let totalCostToggle = false;
let costToggle = false;

// Main array which is displayed on screen
let itemArray = [];

// Hidden arrays which are categorized
let itemDateArray = [];
let lastYearsItemDateArray = [];
let dayArray = [];
let castIronArray = [];
let triplyArray = [];
let tnsArray = [];
let stonewareArray = [];
let miscellaneousArray = [];
let mugArray = [];
let unassignedArray = [];

let pieChart;
let barChart;

// Functions

async function readLastYearsSales() {
  const res = await fetch('test-data/year-test-data.txt');
  if (!res.ok) {
    throw new Error('Failed to read last years sales');
  }
  const text = await res.text();
  // resizeBy.text();
  const lastYearSalesString = text;
  lastYearsItemDateArray = spreadsheetDateParser(lastYearSalesString);
}



// Ran on submit
async function init(){
  // await readLastYearsSales();
  clearData();
  initItemObject();
  initObject();
  pieChart ? pieChart.destroy() : '';
  // barChart ? barChart.destroy() : '';
  originalArray = itemArray;
  
  // Default 
  alphabeticalSort(false);

  castIronInit();
  triplyInit();
  tnsInit();
  mugsInit();
  miscellaneousInit();
  stonewareInit();
  unassignedInit()

  updateMoneyPercentage();

  createTables();
}

function clearData(){
  alphabeticalToggle = false;
  quantityToggle = false;
  totalCostToggle = false;
  costToggle = false;
  itemDateArray = [];
  itemArray = [];
  originalArray = [];
  castIronArray = [];
  triplyArray = [];
  tnsArray = [];
  stonewareArray = [];
  miscellaneousArray = [];
  mugArray = [];
  unassignedArray = [];
}


// Creates the main object for all the items
function initObject() {
  clearTable();
  elements.table.style.display = 'table';
  const spreadsheetData = elements.spreadsheetInput.value;
  elements.spreadsheetInput.value = '';
  const spreadsheetSplit = spreadsheetData.split('\t');
  
  for (let i = 2; i < spreadsheetSplit.length; i += 5) {
    const itemName = spreadsheetSplit[i];    
    const itemPrice = -spreadsheetSplit[i + 3].split('\n')[0];
    const itemTotalPrice = -parseFloat(spreadsheetSplit[i + 3].split('\'')[0]);
    const itemQuantity = -spreadsheetSplit[i + 2];
    const itemDate = spreadsheetSplit[i + 1];
    if (itemName != 'Item Description') {
      if (itemArray.find(item => item.itemDescription == itemName)) {
        const correctItem = itemArray.find(item => item.itemDescription == itemName);
        correctItem.totalCost += itemTotalPrice;
        correctItem.quantity += itemQuantity;
        correctItem.unitCost = (correctItem.unitCost + itemPrice / 2);
      } else {
        itemArray.push({ 
          itemDescription: itemName, 
          quantity: itemQuantity, 
          unitCost: itemPrice, 
          totalCost: itemTotalPrice
        })
      }
    }
  }
  return itemArray;
}


// Used for dates
function initItemObject() {
  const spreadsheetData = elements.spreadsheetInput.value;
  itemDateArray = spreadsheetDateParser(spreadsheetData);
}



function spreadsheetDateParser(spreadsheetData) {
  const spreadsheetSplit = spreadsheetData.split('\t');
  const tempItemDateArray = [];

  for (let i = 2; i < spreadsheetSplit.length; i += 5) {
    const itemName = spreadsheetSplit[i];
    if (itemName != 'Item Description') {
      const itemPrice = -spreadsheetSplit[i + 3].split('\n')[0];
      const itemQuantity = -spreadsheetSplit[i + 2];
      // const itemDate = spreadsheetSplit[i + 1];
      // const itemDate = new Date(spreadsheetSplit[i + 1].split('/').join('-'));
      const splitDate = spreadsheetSplit[i + 1].split('/');
      let year;
      let month;
      let day;
      if (splitDate[2].split('').length > 2) {
        year = splitDate[2];
        month = splitDate[0];
        day = splitDate[1];
      } else {
        year = `20${splitDate[2]}`;
        month = splitDate[1];
        day = splitDate[0];
      }
      const dateJoined = [year, month, day].join('-');
      const itemDate = new Date(dateJoined);

      tempItemDateArray.push({
        itemDescription: itemName,
        date: itemDate,
        quantity: itemQuantity,
        unitCost: itemPrice,
      });
    }
  }

  return tempItemDateArray;
}

// Initialization of the categories
function castIronInit() {
  const castIronKeywords = [
    'rnd cass','evo rnd cass','ovl cass','evo shllw','shllw cass', 'evo rect',
    'evo shllw','rect grill','evo saucepan','sq grillit','evo oblong',
    'flower casserole','heart cass 20','heart cass cerise','pumpkin cass','rnd tatin',
    'soup pot'
  ];
  let newCastIronArray = [];
  // FOR OF instead of forEach
  originalArray.forEach(item => {
    let lowerCaseItem = item.itemDescription.toLowerCase();
    if (
      castIronKeywords.some(keyword => lowerCaseItem.startsWith(keyword)) ||
      lowerCaseItem.includes('skillet') ||
      lowerCaseItem.includes('balti')
    ) {
      newCastIronArray.push(item);
    }
  });
  castIronArray = newCastIronArray;
  return castIronArray;
}


function triplyInit(){
  let newTriplyArray = [];
  originalArray.forEach(item => {
    let lowerCaseItem = item.itemDescription.toLowerCase();
    if (lowerCaseItem.includes('3ply')) {
      newTriplyArray.push(item);
    }
  });
  triplyArray = newTriplyArray;
  return triplyArray
}

function tnsInit(){
  let newTnsArray = [];
  originalArray.forEach(item => {
    let lowerCaseItem = item.itemDescription.toLowerCase();
    if (lowerCaseItem.includes('tns')) {
      newTnsArray.push(item);
    }
  });
  tnsArray = newTnsArray
  return tnsArray;
}

function stonewareInit(){
  const stonewareKeywordsStartWith = ['10', '25cm', 'ct ', 'cookie jar', 'gravy', 'heart tart', 
    'honey', 'lc b', 'lc mug', 'lc cappuccino', 'lc espresso', 'lc grand mug', 'lc outlet', 
    'lc petite', 'lc r', 'lc s', 'med stor', 'oil', '300ml pumpkin', '20cm flower dish'
  ];
  const stonewareKeywordsIncludes = [
    'apple', 'cereal', 'dinner', 'plate', 'soup bowl x 2', 
    'pet bowl', 'lc van', 'dip bowl', 'pasta bowl', 'rice bowl', 'fusion', 'coffee', 'egg cup', 
    'garlic keeper', 'tea pot', 'spoon rest', 'mixing jug', 'lasagna', 'heart dish', 'mug', 
    'rainbow', 'pie', 'heart plate', 'ramekin', 'mini sauce', 'soup bowl 14', 'stoneware', 'tapas',
    'teapot', 'camembert', 'fluted fan', 'frill bowl'
  ];
  let newStonewareArray = [];
  originalArray.forEach(item => {
    let lowerCaseItem = item.itemDescription.toLowerCase();
    if (
      stonewareKeywordsIncludes.some(keyword => lowerCaseItem.includes(keyword)) ||
      stonewareKeywordsStartWith.some(keyword => lowerCaseItem.startsWith(keyword))
      ) {
        newStonewareArray.push(item);
    }
  });
  stonewareArray = newStonewareArray;

  return stonewareArray
};

function mugsInit(){
  const mugKeywords = ['lc mug', 'lc cappuccino', 'lc espresso', 'lc grand mug'];
  let newMugsArray = [];
  originalArray.forEach(item => {
    let lowerCaseItem = item.itemDescription.toLowerCase();
    if (mugKeywords.some(keyword => lowerCaseItem.startsWith(keyword))) {
      newMugsArray.push(item);
    }
  });
  mugArray = newMugsArray;
  return mugArray
}

function miscellaneousInit(){
  const miscellaneousKeywordsStartWith = ['class', '30cm', 'ss mixing', 'bak', 'silicone mill', 'sw1'];
  const miscellaneousKeywordsIncludes = ['kettle', 'splatter', 'glass', 'glass', ' ss', 'bottle', 
    'garlic press', 'spoons', 'strainer', 'protector', 'turner', 'mash', 'wire', 'ovw', 'cooler', 
    'wine', 'opener', 'waiters', 'cutter', 'stopper', 'drip', 'spat', 'brush', 'cleaner', 'book', 
    'handle', 'knob', 'cool tool', 'glove', 'mitt', 'citrus', 'peeler', 'turner', 'whisk', 'tongs', 
    'knife', 'grater', 'gift voucher', 'gift box', 'activ', 'pourer', 'virtual sales', 
    'cookie jar santa', 'mini ornaments', 'ladle', 'pasta fork', 'edge spoon', 'edge serving spoon',
    'acacia wood', 'ceramic bkg beans', 'chefs apron', 'slotted spoon', 
  ];
  let newMiscellaneousArray = [];
  originalArray.forEach(item => {
    let lowerCaseItem = item.itemDescription.toLowerCase();
    if (
      miscellaneousKeywordsIncludes.some(keyword => lowerCaseItem.includes(keyword)) ||
      miscellaneousKeywordsStartWith.some(keyword => lowerCaseItem.startsWith(keyword))
      ) {
        newMiscellaneousArray.push(item);
    }
  });
  miscellaneousArray = newMiscellaneousArray;
  return miscellaneousArray
}

function unassignedInit(){
  let newUnassignedArray = originalArray.filter(
    item => !castIronArray.includes(item) &&
    !tnsArray.includes(item) &&
    !triplyArray.includes(item) &&
    !stonewareArray.includes(item) &&
    !miscellaneousArray.includes(item)
);  
  unassignedArray = newUnassignedArray;
  return unassignedArray
};


// Creating / removing the table

// Creates the table for the screen
function createTables() {
  
  let staggeredRow = true;
  itemArray.forEach(item => {
    if (item.quantity > 0) {
      const row = document.createElement('tr');
      row.className =  staggeredRow ? 'even': 'odd';
      
      const rowName = document.createElement('td');
      const name = document.createTextNode(item.itemDescription);
      rowName.appendChild(name);
      
      const rowQuantity = document.createElement('td');
      const quantity = document.createTextNode(item.quantity);
      rowQuantity.appendChild(quantity);
      
      const rowAvgCost = document.createElement('td');
      const avgCost = document.createTextNode(`£${item.unitCost.toFixed(2)}`);
      rowAvgCost.appendChild(avgCost);
      
      const rowTotalCost = document.createElement('td');
      const totalCost = document.createTextNode(`£${item.totalCost.toFixed(2)}`);
      rowTotalCost.appendChild(totalCost);
      
      const checkBoxElement = document.createElement('td');
      const checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBoxElement.appendChild(checkBox);
      
      // Append instead of append child
      row.appendChild(rowName);
      row.appendChild(rowQuantity);
      row.appendChild(rowAvgCost);
      row.appendChild(rowTotalCost);
      row.appendChild(checkBoxElement);
      
      elements.tableBody.appendChild(row);
      staggeredRow = !staggeredRow;
    }
  });
  updateDashboard()
};

// Clears the table on the screen
function clearTable() {
  while (elements.tableBody.firstChild) {
    // remove instead of
    elements.tableBody.removeChild(elements.tableBody.lastChild);
  }
}



// Event handler functions

// Event handlers for the filters + sorts
function castIronFilter (){
  clearTable();
  itemArray = castIronArray;
  createTables();
  elements.filterTitle.textContent = 'Cast Iron';
}
// REPETITIVE
function triplyFilter (){
  clearTable();
  itemArray = triplyArray;
  createTables();
  elements.filterTitle.textContent = '3PLY';
}

function tnsFilter (){
  clearTable();
  itemArray = tnsArray;
  createTables();
  elements.filterTitle.textContent = 'TNS';
}

function stonewareFilter (){
  clearTable();
  itemArray = stonewareArray;
  createTables();
  elements.filterTitle.textContent = 'Stoneware';
}

function mugsFilter (){
  clearTable();
  itemArray = mugArray;
  createTables();
  elements.filterTitle.textContent = 'Mugs';
}

function miscellaneousFilter (){
  clearTable();
  itemArray = miscellaneousArray;
  createTables();
  elements.filterTitle.textContent = 'Miscellaneous';
}

function unassignedFilter (){
  clearTable();
  itemArray = unassignedArray;
  createTables();
  elements.filterTitle.textContent = 'Unassigned';
}

function allFilter (){
  clearTable();
  itemArray = originalArray;
  createTables();
  elements.filterTitle.textContent = 'All';
}

function alphabeticalSort(init = true){
  clearTable();
  alphabeticalToggle ? itemArray.sort((item1, item2) => (item1.itemDescription < item2.itemDescription) 
    ? 1 : (item1.itemDescription > item2.itemDescription) 
    ? -1 : 0) : itemArray.sort((item1, item2) => (item1.itemDescription > item2.itemDescription) 
    ? 1 : (item1.itemDescription < item2.itemDescription) 
    ? -1 : 0);
  init ? createTables() : '';
  alphabeticalToggle = !alphabeticalToggle;
}

function quantitySort(){
  clearTable();
  quantityToggle ? itemArray.sort((item1, item2) => (item1.quantity < item2.quantity) 
  ? 1 : (item1.quantity > item2.quantity) 
  ? -1 : 0) : itemArray.sort((item1, item2) => (item1.quantity > item2.quantity) 
  ? 1 : (item1.quantity < item2.quantity) 
  ? -1 : 0);  
  createTables();
  quantityToggle = !quantityToggle;
}

function costSort(){
  clearTable();
  costToggle ? itemArray.sort((item1, item2) => (item1.unitCost < item2.unitCost) 
  ? 1 : (item1.unitCost > item2.unitCost) 
  ? -1 : 0) : itemArray.sort((item1, item2) => (item1.unitCost > item2.unitCost) 
  ? 1 : (item1.unitCost < item2.unitCost) 
  ? -1 : 0);  
  createTables();
  costToggle = !costToggle;
}

function totalCostSort(){
  clearTable();
  totalCostToggle ? itemArray.sort((item1, item2) => (item1.totalCost < item2.totalCost) 
  ? 1 : (item1.totalCost > item2.totalCost) 
  ? -1 : 0) : itemArray.sort((item1, item2) => (item1.totalCost > item2.totalCost) 
  ? 1 : (item1.totalCost < item2.totalCost) 
  ? -1 : 0);  
  createTables();
  totalCostToggle = !totalCostToggle;
}

function dateSort(unsortedItemDateArray){
  // clearTable();
  unsortedItemDateArray.sort((item1, item2) => (item1.date > item2.date) 
  ? 1 : (item1.date < item2.date) 
  ? -1 : 0)  
}

// Func to update the dashboard whenever the filter changes
function updateDashboard() {
  let totalQuantity = 0;
  let totalCost = 0;
  itemArray.forEach(item => {
    totalQuantity += item.quantity
    totalCost += item.totalCost
  });
  let avgCost = (totalCost / totalQuantity).toFixed(2);
  elements.totalQuantityStat.textContent = totalQuantity.toLocaleString('en') + ' Units';
  elements.totalCostStat.textContent = '£' + totalCost.toLocaleString('en');
  elements.avgCostStat.textContent = '£' + avgCost;

  // ['Monday', 'T', 'W', 'T', 'F', 'S', 'S']


 dateSort(itemDateArray);
 dateSort(lastYearsItemDateArray);

//  itemDateArray
 // miscellaneousKeywordsIncludes.some(keyword => lowerCaseItem.includes(keyword)) ||
 // miscellaneousKeywordsStartWith.some(keyword => lowerCaseItem.startsWith(keyword))

 let newItemDateObject = totalSalesPerDate(itemDateArray);
 let lastYearItemDateObject = totalSalesPerDate(lastYearsItemDateArray);

// Put last years data in a json file instead of reading it every time

//  console.log(lastYearItemDateObject);
// console.log(itemDateArray);

 

  let daysData = [];
  let dataSet = [];
  let lastYearDataSet = [];

  for (const dateObject of newItemDateObject) {
    const formattedDate = (Object.keys(dateObject)).toString().split('').splice(-4).join('')
    daysData.push((Object.keys(dateObject)).toString());
    dataSet.push((Object.values(dateObject)).toString());
    for (const lastYearDateObject of lastYearItemDateObject) {
      const lastYearsFormattedDate = (Object.keys(lastYearDateObject)).toString().split('').splice(-4).join('')
      // console.log(lastYearsFormattedDate, formattedDate);
      
      if (lastYearsFormattedDate == formattedDate) {
        lastYearDataSet.push((Object.values(lastYearDateObject)).toString());
      }
    }
  }

  // console.log(lastYearDataSet);
  

// IMPLEMENT LAST YEARS DATA TO COMPARE AGAINST THE DATA INPUTTED
  // barChart = new Chart("barChart", {
  //   type: 'bar',
  //   data: {
  //     // labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  //     labels: daysData,
  //     datasets: [{
  //       label: 'Current Sales',
  //       // data: [newItemDateObject[1], newItemDateObject[2], newItemDateObject[3], newItemDateObject[4], newItemDateObject[5], newItemDateObject[6], newItemDateObject[0]]
  //       data: dataSet
  //       ,
  //     },
  //     // {
  //     //   label: 'Last Year Sales',
  //     //   // data: [newItemDateObject[3], newItemDateObject[4], newItemDateObject[5], newItemDateObject[6], newItemDateObject[0], newItemDateObject[1], newItemDateObject[2]]
  //     //   data: lastYearDataSet
  //     //   ,
  //     // }
  //   ]
  //   },
  //   options: {
  //     scales: {
  //       y: {
  //         beginAtZero: true,
  //         stacked: false
  //       },
  //       x: {
  //         stacked: true
  //       }
  //     }
  //   }
  // });

}

function totalSalesPerDate(newItemDateArray) {
  
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let newItemDateObject = [];
  for (const item of newItemDateArray) {
    const formattedDate = `${days[item.date.getDay()]} ${item.date.getDate()}/${item.date.getMonth() + 1}`;
    if (newItemDateObject.find(dateObject => formattedDate == (Object.keys(dateObject)).toString())) {
      const correctDate = newItemDateObject.find(dateObject => formattedDate == (Object.keys(dateObject)).toString());
      correctDate[formattedDate] += item.unitCost;
    } else {
      newItemDateObject.push({ [formattedDate]: item.unitCost });
    }
  };
  
  return newItemDateObject;
}

function updateMoneyPercentage(){
  let totalMoney = 0;
  let totalCastIron = 0;
  let totalTriply = 0;
  let totalTns = 0;
  let totalStoneware = 0;
  let totalMiscellaneous = 0;
  let totalUnassigned = 0;

  for (const item of originalArray) {
    totalMoney += item.totalCost;
  }
  for (const item of castIronArray) {
    totalCastIron += item.totalCost;
  }
  for (const item of triplyArray) {
    totalTriply += item.totalCost;
  }
  for (const item of tnsArray) {
    totalTns += item.totalCost;
  }
  for (const item of stonewareArray) {
    totalStoneware += item.totalCost; 
  }
  for (const item of miscellaneousArray) {
    totalMiscellaneous += item.totalCost;
  }
  for (const item of unassignedArray) {
    totalUnassigned += item.totalCost;
  }
  
  // Arrow function 
  let castIronPercentage = (totalCastIron * 100 / totalMoney);
  let triplyPercentage = (totalTriply * 100 / totalMoney);
  let tnsPercentage = (totalTns * 100 / totalMoney);
  let stonewarePercentage = (totalStoneware * 100 / totalMoney);
  let miscellaneousPercentage = (totalMiscellaneous * 100 / totalMoney);
  let unassignedPercentage = (totalUnassigned * 100 / totalMoney);

  elements.castIronPercentage.textContent = castIronPercentage.toFixed(1) + '%';
  elements.triplyPercentage.textContent = triplyPercentage.toFixed(1) + '%';
  elements.tnsPercentage.textContent = tnsPercentage.toFixed(1) + '%';
  elements.stonewarePercentage.textContent = stonewarePercentage.toFixed(1) + '%';
  elements.miscellaneousPercentage.textContent = miscellaneousPercentage.toFixed(1) + '%';
  elements.unassignedPercentage.textContent = unassignedPercentage.toFixed(1) + '%';

  pieChart = new Chart("chartContainer", {
    type: 'pie',
    data: {
      labels: ['Cast Iron', '3PLY', 'TNS', 'Stoneware', 'Miscellaneous', 'Unassigned'],
      datasets: [{
        data: [castIronPercentage, triplyPercentage, tnsPercentage, stonewarePercentage, miscellaneousPercentage, unassignedPercentage],
        borderWidth: 1,
        backgroundColor: ['#ff6702', 'lightgray', '#3a3a3a', 'red', 'lightblue', 'lightgreen']
      }]
    },
    options: {
      plugins: {
        legend: {
            display: false
        },
      }
    }
  });


  const total = castIronPercentage + triplyPercentage + tnsPercentage + stonewarePercentage + miscellaneousPercentage + unassignedPercentage
  elements.errorPercentage.style.display = 'block';
  elements.errorPercentage.textContent = `Margin of Error: ${(((total - 100) / total) * 100).toFixed(2)}%`
}

function loadPieChart(){
  
};