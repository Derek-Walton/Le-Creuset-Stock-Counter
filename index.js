// Init
window.onload = function() {
  // Event listeners
  elements.submitButton.addEventListener('click', init);

  // Filter + sort
  elements.castIronFilter.addEventListener('click', () => filterEventHandler(castIronArray, 'Cast Iron'));
  elements.triplyFilter.addEventListener('click', () => filterEventHandler(triplyArray, '3PLY'));
  elements.tnsFilter.addEventListener('click', () => filterEventHandler(tnsArray, 'TNS'));
  elements.stonewareFilter.addEventListener('click', () => filterEventHandler(stonewareArray, 'Stoneware'));
  elements.mugsFilter.addEventListener('click', () => filterEventHandler(mugArray, 'Mugs'));
  elements.miscellaneousFilter.addEventListener('click', () => filterEventHandler(miscellaneousArray, 'Miscellaneous'));
  elements.unassignedFilter.addEventListener('click', () => filterEventHandler(unassignedArray, 'Unassigned'));
  elements.allFilter.addEventListener('click', () => filterEventHandler(originalArray, 'All'));
  elements.chambrayFilter.addEventListener('click', () => filterEventHandler(chambrayArray, 'Chambray'));
  elements.shellPinkFilter.addEventListener('click', () => filterEventHandler(shellPinkArray, 'Shell Pink'));
  elements.monthlyOffersFilter.addEventListener('click', () => filterEventHandler(monthlyOffersArray, 'Monthly Offers'));
  elements.alphabeticalSort.addEventListener('click', () => sortFunction('alphabeticalToggle', 'itemDescription'));
  elements.quantitySort.addEventListener('click', () => sortFunction('quantityToggle', 'quantity'));
  elements.costSort.addEventListener('click', () => sortFunction('costToggle', 'unitCost'));
  elements.totalCostSort.addEventListener('click', () => sortFunction('totalCostToggle', 'totalCost'));
};


const elementIds = [
  // Main Components
  'submitButton', 'spreadsheetInput', 'tableBody', 'table', 
  // Filters
  'castIronFilter', 'triplyFilter', 'tnsFilter', 'stonewareFilter',
  'mugsFilter', 'miscellaneousFilter', 'unassignedFilter', 'allFilter',
  'alphabeticalSort', 'quantitySort', 'costSort', 'totalCostSort', 
  'chambrayFilter', 'shellPinkFilter', 'monthlyOffersFilter', 
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
// let alphabeticalToggle = false;
// let quantityToggle = false;
// let totalCostToggle = false;
// let costToggle = false;

let toggles = {
  alphabeticalToggle: false, 
  quantityToggle: false, 
  totalCostToggle: false, 
  costToggle: false
};

// Main array which is displayed on screen
let itemArray = [];

// Hidden arrays which are categorized
let originalArray = [];
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
let chambrayArray = [];
let shellPinkArray = [];
let monthlyOffersArray = [];

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
  barChart ? barChart.destroy() : '';
  originalArray = itemArray;
  
  // Default sorted view
  sortFunction('alphabeticalToggle', 'itemDescription', true)

  filterInit();
  unassignedInit()

  updateRevenueSplit();

  createTables();
}

function clearData(){
  toggles.alphabeticalToggle = false;
  toggles.quantityToggle = false;
  toggles.totalCostToggle = false;
  toggles.costToggle = false;

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
    if (itemName == 'Item Description') {
      continue
    }
    const itemPrice = -spreadsheetSplit[i + 3].split('\n')[0];
    const itemTotalPrice = -parseFloat(spreadsheetSplit[i + 3].split('\'')[0]);
    const itemQuantity = -spreadsheetSplit[i + 2];
    // const itemDate = spreadsheetSplit[i + 1];

      if (itemArray.find(item => item.itemDescription == itemName) && itemName != 'Item Description') {
        const correctItem = itemArray.find(item => item.itemDescription == itemName);
        correctItem.totalCost += itemTotalPrice;
        correctItem.quantity += itemQuantity;
        correctItem.unitCost = (correctItem.unitCost + (itemPrice / itemQuantity)) / 2;
      } else {
        itemArray.push({ 
          itemDescription: itemName, 
          quantity: itemQuantity, 
          unitCost: (itemPrice / itemQuantity), 
          totalCost: itemTotalPrice
        })
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

function filterFunction(startsWith = [], includes = []) {
  const filteredArray = [];
  // FOR OF instead of forEach
  for (const item of originalArray) {
    const lowerCaseItem = item.itemDescription.toLowerCase();
    if (
      startsWith.some(keyword => lowerCaseItem.startsWith(keyword)) ||
      includes.some(keyword => lowerCaseItem.includes(keyword))
    ) {
      filteredArray.push(item);
    }
  }
  
  return filteredArray;
}

// Initialization of the categories
function filterInit() {
  const castIronKeywords = [
    'rnd cass','evo rnd cass','ovl cass','evo shllw','shllw cass', 'evo rect',
    'evo shllw','rect grill','evo saucepan','sq grillit','evo oblong',
    'flower casserole','heart cass 20','heart cass cerise','pumpkin cass','rnd tatin',
    'soup pot'
  ];
  const castIronKeywordsInclude = [
    'skillet', 'balti'
  ];
  const stonewareKeywordsStartWith = ['10', '25cm', 'ct ', 'cookie jar', 'gravy', 'heart tart', 
    'honey', 'lc b', 'lc mug', 'lc cappuccino', 'lc espresso', 'lc grand mug', 'lc outlet', 
    'lc petite', 'lc r', 'lc s', 'med stor', 'oil', '300ml pumpkin', '20cm flower dish'
  ];
  const stonewareKeywordsIncludes = [
    'apple', 'cereal', 'dinner', 'plate', 'soup bowl x 2', 
    'pet bowl', 'lc van', 'dip bowl', 'pasta bowl', 'rice bowl', 'fusion', 'coffee', 'egg cup', 
    'garlic keeper', 'tea pot', 'spoon rest', 'mixing jug', 'lasagna', 'heart dish', 'mug', 
    'rainbow', 'pie', 'heart plate', 'ramekin', 'mini sauce', 'soup bowl 14', 'stoneware', 'tapas',
    'teapot', 'camembert', 'fluted fan', 'frill bowl', 'fluted flan'
  ];
  const mugKeywords = ['lc mug', 'lc cappuccino', 'lc espresso', 'lc grand mug'];

  const miscellaneousKeywordsStartWith = ['class', '30cm', 'ss mixing', 'bak', 'silicone mill', 'sw1'];
  const miscellaneousKeywordsIncludes = ['kettle', 'splatter', 'glass', 'glass', ' ss', 'bottle', 
    'garlic press', 'spoons', 'strainer', 'protector', 'turner', 'mash', 'wire', 'ovw', 'cooler', 
    'wine', 'opener', 'waiters', 'cutter', 'stopper', 'drip', 'spat', 'brush', 'cleaner', 'book', 
    'handle', 'knob', 'cool tool', 'glove', 'mitt', 'citrus', 'peeler', 'turner', 'whisk', 'tongs', 
    'knife', 'grater', 'gift voucher', 'gift box', 'activ', 'pourer', 'virtual sales', 
    'cookie jar santa', 'mini ornaments', 'ladle', 'pasta fork', 'edge spoon', 'edge serving spoon',
    'acacia wood', 'ceramic bkg beans', 'chefs apron', 'slotted spoon', 
  ];
  const chambrayKeywordsIncludes = ['cham', 'lid cha', '14 cha', 'plates cha', ];

  castIronArray = filterFunction(castIronKeywords, castIronKeywordsInclude);
  triplyArray = filterFunction([], ['3ply']);
  tnsArray = filterFunction([], ['tns']);
  stonewareArray = filterFunction(stonewareKeywordsStartWith, stonewareKeywordsIncludes);
  mugArray = filterFunction(mugKeywords)
  miscellaneousArray = filterFunction(miscellaneousKeywordsStartWith, miscellaneousKeywordsIncludes);
  chambrayArray = filterFunction([], chambrayKeywordsIncludes);
  shellPinkArray = filterFunction([], ['shell pink', 'shell p', 'sh p', 's pink']);
  monthlyOffersArray = filterFunction(['rnd cass 24 chiffon pink', 'tns crepe pan 24 silicone', '3ply pasta pot 20 silicone']);
  
  unassignedInit();
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
    elements.tableBody.removeChild(elements.tableBody.lastChild);
  }
}



// Event handler functions

// Event handlers for the filters + sorts
function filterEventHandler (displayedArray, filterTitle){
  clearTable();
  itemArray = displayedArray;
  createTables();
  elements.filterTitle.textContent = filterTitle;
}


function sortFunction(toggle, whatToSort, init = true){
  clearTable();
  toggles[toggle] ? itemArray.sort((item1, item2) => (item1[whatToSort] < item2[whatToSort]) 
    ? 1 : (item1[whatToSort] > item2[whatToSort]) 
    ? -1 : 0) : itemArray.sort((item1, item2) => (item1[whatToSort] > item2[whatToSort]) 
    ? 1 : (item1[whatToSort] < item2[whatToSort]) 
    ? -1 : 0);

  init ? createTables() : '';
  toggles[toggle] = !toggles[toggle];
  console.log(itemArray);
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

function updateRevenueSplit(){
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


  dateSort(itemDateArray);

  let newItemDateObject = totalSalesPerDate(itemDateArray);
 

  let daysData = [];
  let dataSet = [];

  for (const dateObject of newItemDateObject) {
    daysData.push((Object.keys(dateObject)).toString());
    dataSet.push((Object.values(dateObject)).toString());
  }

  barChart = new Chart("barChart", {
    type: 'bar',
    data: {
      // labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      labels: daysData,
      datasets: [{
        label: 'Current Sales',
        // data: [newItemDateObject[1], newItemDateObject[2], newItemDateObject[3], newItemDateObject[4], newItemDateObject[5], newItemDateObject[6], newItemDateObject[0]]
        data: dataSet
        ,
      },
      // {
      //   label: 'Last Year Sales',
      //   // data: [newItemDateObject[3], newItemDateObject[4], newItemDateObject[5], newItemDateObject[6], newItemDateObject[0], newItemDateObject[1], newItemDateObject[2]]
      //   data: lastYearDataSet
      //   ,
      // }
    ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stacked: false
        },
        x: {
          stacked: true
        }
      }
    }
  });
}

function loadPieChart(){
  
};
