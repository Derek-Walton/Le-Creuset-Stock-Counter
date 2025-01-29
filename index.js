// Init
window.onload = function() {
  // Event listeners
  submitButton.addEventListener('click', initTable);

  // Filter + sort
  castIron.addEventListener('click', castIronFilter);
  triply.addEventListener('click', triplyFilter);
  tns.addEventListener('click', tnsFilter);
  stoneware.addEventListener('click', stonewareFilter);
  mugs.addEventListener('click', mugsFilter);
  miscellaneous.addEventListener('click', miscellaneousFilter);
  seasonal.addEventListener('click', seasonalFilter);
  all.addEventListener('click', allFilter);
  alphabeticalButton.addEventListener('click', alphabeticalSort);
  quantityButton.addEventListener('click', quantitySort);
  totalCostButton.addEventListener('click', totalCostSort);
};

// loop over ID's 

// const elementIds = [
//   'submit', 'spreadsheetData', 'output', 'outputArea','castIron',
//   'triply', 'tns', 'stoneware', 'mugs', 'miscellaneous', 'seasonal', 
//   'all','alphabeticalButton', 'quantityButton', 'totalCostButton', 
//   'totalQuantity', 'totalCost', 'avgCost', 'mostPopular', 'leastPopular',
//   'castIronPercentage', 'triplyPercentage', 'tnsPercentage', 'stonewarePercentage',
//   'miscellaneousPercentage'
// ];

// const elements = {};

// for (const id of elementIds) {
//   elements[id] = document.querySelector(`#${id}`);
// }

// Main Components
const submitButton = document.querySelector('#submit');
const inputElem = document.querySelector('#spreadsheetData');
const tableElem = document.querySelector('#output');
const outputArea = document.querySelector('#outputArea');

// Filters
const castIron = document.querySelector('#castIron');
const triply = document.querySelector('#triply');
const tns = document.querySelector('#tns');
const stoneware = document.querySelector('#stoneware');
const mugs = document.querySelector('#mugs');
const miscellaneous = document.querySelector('#miscellaneous');
const seasonal = document.querySelector('#seasonal');
const all = document.querySelector('#all');

// Sorts
const alphabeticalButton = document.querySelector('#alphabeticalButton');
const quantityButton = document.querySelector('#quantityButton');
const totalCostButton = document.querySelector('#totalCostButton');

// Stats
const totalQuantityStat = document.querySelector('#totalQuantity');
const totalCostStat = document.querySelector('#totalCost');
const avgCostStat = document.querySelector('#avgCost');
const mostPopularStat = document.querySelector('#mostPopular');
const leastPopularStat = document.querySelector('#leastPopular');

const castIronPercentageElem = document.querySelector('#castIronPercentage');
const triplyPercentageElem = document.querySelector('#triplyPercentage');
const tnsPercentageElem = document.querySelector('#tnsPercentage');
const stonewarePercentageElem = document.querySelector('#stonewarePercentage');
const miscellaneousPercentageElem = document.querySelector('#miscellaneousPercentage');

const chartContainer = document.querySelector('#chartContainer');

// Toggles for sorts
let alphabeticalToggle = false;
let quantityToggle = false;
let totalCostToggle = false;

// Main array which is displayed on screen
let productArray = [];

// Hidden arrays which are categorized
let castIronArray = [];
let triplyArray = [];
let tnsArray = [];
let stonewareArray = [];
let miscellaneousArray = [];
let mugArray = [];



// Functions

// Ran on submit
function initTable(){
  initObject();
  originalArray = productArray;
  
  productArray.sort((product1, product2) => (product1.itemDescription > product2.itemDescription) 
  ? 1 : (product1.itemDescription < product2.itemDescription) 
  ? -1 : 0);

  castIronInit();
  triplyInit();
  tnsInit();
  mugsInit();
  miscellaneousInit();
  stonewareInit();

  updateMoneyPercentage();
  createTables();
}

// Creates the main object for all the products
function initObject() {
  clearTable();
  outputArea.style.display = 'table';
  const spreadsheetData = inputElem.value;
  inputElem.value = '';
  const spreadsheetSplit = spreadsheetData.split('\t');
  
  for (let i = 2; i < spreadsheetSplit.length; i += 5) {
    const productName = spreadsheetSplit[i];    
    const productPrice = -parseFloat(spreadsheetSplit[i + 3].split('\'')[0]);
    const productQuantity = -spreadsheetSplit[i + 2];
    if (productName != 'Item Description') {
      if (productArray.find(product => product.itemDescription == productName)) {
        productArray.find(product => product.itemDescription == productName).totalCost += productPrice;
        productArray.find(product => product.itemDescription == productName).quantity += productQuantity;
      } else {
        productArray.push({ 
          itemDescription: productName, 
          quantity: productQuantity, 
          totalCost: productPrice
        })
      }
    }
  }
  return productArray;
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
  originalArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (
      castIronKeywords.some(keyword => lowerCaseProduct.startsWith(keyword)) ||
      lowerCaseProduct.includes('skillet') ||
      lowerCaseProduct.includes('balti')
    ) {
      newCastIronArray.push(product);
    }
  });
  castIronArray = newCastIronArray;
  return castIronArray;
}


function triplyInit(){
  let newTriplyArray = [];
  originalArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (lowerCaseProduct.includes('3ply')) {
      newTriplyArray.push(product);
    }
  });
  triplyArray = newTriplyArray;
  return triplyArray
}

function tnsInit(){
  let newTnsArray = [];
  originalArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (lowerCaseProduct.includes('tns')) {
      newTnsArray.push(product);
    }
  });
  tnsArray = newTnsArray
  return tnsArray;
}

function stonewareInit(){
  let newStonewareArray = originalArray.filter(
    item => !castIronArray.includes(item) &&
    !tnsArray.includes(item) &&
    !triplyArray.includes(item) &&
    !miscellaneousArray.includes(item)
);  
  stonewareArray = newStonewareArray;
  return stonewareArray
}

function mugsInit(){
  const mugKeywords = ['lc mug', 'lc cappuccino', 'lc espresso', 'lc grand mug'];
  let newMugsArray = [];
  originalArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (mugKeywords.some(keyword => lowerCaseProduct.startsWith(keyword))) {
      newMugsArray.push(product);
    }
  });
  mugArray = newMugsArray;
  return mugArray
}

function miscellaneousInit(){
  const miscellaneousKeywordsStartWith = ['class', '30cm', 'ss mixing', 'bak', 'silicone mill'];
  const miscellaneousKeywordsIncludes = ['kettle', 'splatter', 'glass', 'glass', ' ss', 'bottle', 
    'garlic press', 'spoons', 'strainer', 'protector', 'turner', 'mash', 'wire', 'ovw', 'cooler', 
    'wine', 'opener', 'waiters', 'cutter', 'stopper', 'drip', 'spat', 'brush', 'cleaner', 'book', 
    'handle', 'knob', 'cool tool', 'glove', 'mitt', 'citrus', 'peeler', 'turner', 'whisk', 'tongs', 
    'knife', 'grater', 'gift voucher', 'gift box', 'activ table', 'pourer', 'virtual sales', 
    'cookie jar santa'
  ];
  let newMiscellaneousArray = [];
  originalArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (
      miscellaneousKeywordsIncludes.some(keyword => lowerCaseProduct.startsWith(keyword)) ||
      miscellaneousKeywordsStartWith.some(keyword => lowerCaseProduct.startsWith(keyword))
      ) {
        newMiscellaneousArray.push(product);
    }
  });
  miscellaneousArray = newMiscellaneousArray;
  return miscellaneousArray
}


// Creating / removing the table

// Creates the table for the screen
function createTables() {
  let staggeredRow = true;
  productArray.forEach(product => {
    if (product.quantity > 0) {
      const row = document.createElement('tr');
      row.className =  staggeredRow ? 'even': 'odd';
      
      const rowName = document.createElement('td');
      const name = document.createTextNode(product.itemDescription);
      rowName.appendChild(name);
      
      const rowQuantity = document.createElement('td');
      const quantity = document.createTextNode(product.quantity);
      rowQuantity.appendChild(quantity);
      
      const rowTotalCost = document.createElement('td');
      const totalCost = document.createTextNode(product.totalCost.toFixed(2));
      rowTotalCost.appendChild(totalCost);
      
      const checkBoxElement = document.createElement('td');
      const checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBoxElement.appendChild(checkBox);
      
      // Append instead of append child
      row.appendChild(rowName);
      row.appendChild(rowQuantity);
      row.appendChild(rowTotalCost);
      row.appendChild(checkBoxElement);
      
      tableElem.appendChild(row);
      staggeredRow = !staggeredRow;
      updateDashboard()
    }
  });
}

// Clears the table on the screen
function clearTable() {
  while (tableElem.firstChild) {
    // remove instead of
    tableElem.removeChild(tableElem.lastChild);
  }
}



// Event handler functions

// Event handlers for the filters + sorts
function castIronFilter (){
  clearTable();
  productArray = castIronArray;
  createTables();
}
// REPETITIVE
function triplyFilter (){
  clearTable();
  productArray = triplyArray;
  createTables();
}

function tnsFilter (){
  clearTable();
  productArray = tnsArray;
  createTables();
}

function stonewareFilter (){
  clearTable();
  productArray = stonewareArray;
  createTables();
}

function mugsFilter (){
  clearTable();
  productArray = mugArray;
  createTables();
}

function miscellaneousFilter (){
  clearTable();
  productArray = miscellaneousArray;
  createTables();
}

function seasonalFilter (){

}

function allFilter (){
  clearTable();
  productArray = originalArray;
  createTables();
}

function alphabeticalSort(){
  clearTable();
  alphabeticalToggle ? productArray.sort((product1, product2) => (product1.itemDescription > product2.itemDescription) 
    ? 1 : (product1.itemDescription < product2.itemDescription) 
    ? -1 : 0) : productArray.sort((product1, product2) => (product1.itemDescription < product2.itemDescription) 
    ? 1 : (product1.itemDescription > product2.itemDescription) 
    ? -1 : 0);
  createTables();
  alphabeticalToggle = !alphabeticalToggle;
}

function quantitySort(){
  clearTable();
  quantityToggle ? productArray.sort((product1, product2) => (product1.quantity < product2.quantity) 
  ? 1 : (product1.quantity > product2.quantity) 
  ? -1 : 0) : productArray.sort((product1, product2) => (product1.quantity > product2.quantity) 
  ? 1 : (product1.quantity < product2.quantity) 
  ? -1 : 0);  
  createTables();
  quantityToggle = !quantityToggle;
}

function totalCostSort(){
  clearTable();
  totalCostToggle ? productArray.sort((product1, product2) => (product1.totalCost < product2.totalCost) 
  ? 1 : (product1.totalCost > product2.totalCost) 
  ? -1 : 0) : productArray.sort((product1, product2) => (product1.totalCost > product2.totalCost) 
  ? 1 : (product1.totalCost < product2.totalCost) 
  ? -1 : 0);  
  createTables();
  totalCostToggle = !totalCostToggle;
}

// Func to update the dashboard whenever the filter changes
function updateDashboard() {
  let totalQuantity = 0;
  let totalCost = 0;
  productArray.forEach(product => {
    totalQuantity += product.quantity
    totalCost += product.totalCost
  });
  let avgCost = (totalCost / totalQuantity).toFixed(2);
  totalQuantityStat.textContent = totalQuantity.toLocaleString('en') + ' Units';
  totalCostStat.textContent = '£' + totalCost.toLocaleString('en');
  avgCostStat.textContent = '£' + avgCost;
}

function updateMoneyPercentage(){
  let totalMoney = 0;
  let totalCastIron = 0;
  let totalTriply = 0;
  let totalTns = 0;
  let totalStoneware = 0;
  let totalMiscellaneous = 0;

  for (const product of originalArray) {
    totalMoney += product.totalCost;
  }
  for (const product of castIronArray) {
    totalCastIron += product.totalCost;
  }
  for (const product of triplyArray) {
    totalTriply += product.totalCost;
  }
  for (const product of tnsArray) {
    totalTns += product.totalCost;
  }
  for (const product of stonewareArray) {
    totalStoneware += product.totalCost; 
  }
  for (const product of miscellaneousArray) {
    totalMiscellaneous += product.totalCost;
  }
  
  // Arrow function 
  let castIronPercentage = (totalCastIron * 100 / totalMoney).toFixed(1);
  let triplyPercentage = (totalTriply * 100 / totalMoney).toFixed(1);
  let tnsPercentage = (totalTns * 100 / totalMoney).toFixed(1);
  let stonewarePercentage = (totalStoneware * 100 / totalMoney).toFixed(1);
  let miscellaneousPercentage = (totalMiscellaneous * 100 / totalMoney).toFixed(1);

  castIronPercentageElem.textContent = castIronPercentage + '%';
  triplyPercentageElem.textContent = triplyPercentage + '%';
  tnsPercentageElem.textContent = tnsPercentage + '%';
  stonewarePercentageElem.textContent = stonewarePercentage + '%';
  miscellaneousPercentageElem.textContent = miscellaneousPercentage + '%';

  new Chart("chartContainer", {
    type: 'pie',
    data: {
      labels: ['Cast Iron', '3PLY', 'TNS', 'Stoneware', 'Miscellaneous'],
      datasets: [{
        data: [castIronPercentage, triplyPercentage, tnsPercentage, stonewarePercentage, miscellaneousPercentage],
        borderWidth: 1,
        backgroundColor: ['#ff6702', 'lightgray', '#3a3a3a', 'red', 'lightblue']
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
}

function loadPieChart(){
  
};