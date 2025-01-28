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
  let newCastIronArray = [];
  originalArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (lowerCaseProduct.startsWith('rnd cass') || 
        lowerCaseProduct.startsWith('evo rnd cass') || 
        lowerCaseProduct.startsWith('ovl cass') || 
        lowerCaseProduct.startsWith('evo shllw') || 
        lowerCaseProduct.startsWith('shllw cass') || 
        lowerCaseProduct.startsWith('evo rect') || 
        lowerCaseProduct.startsWith('evo shllw') || 
        lowerCaseProduct.startsWith('rect grill') || 
        lowerCaseProduct.startsWith('evo saucepan') || 
        lowerCaseProduct.startsWith('sq grillit') || 
        lowerCaseProduct.startsWith('evo oblong') || 
        lowerCaseProduct.startsWith('flower casserole') || 
        lowerCaseProduct.startsWith('heart cass 20') || 
        lowerCaseProduct.startsWith('heart cass cerise') || 
        lowerCaseProduct.startsWith('pumpkin cass') || 
        lowerCaseProduct.startsWith('rnd tatin') || 
        lowerCaseProduct.startsWith('soup pot') || 
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
  let newStonewareArray = originalArray.filter(item => !castIronArray.includes(item) &&
                                                !tnsArray.includes(item) &&
                                                !triplyArray.includes(item) &&
                                                !miscellaneousArray.includes(item)

);  
  stonewareArray = newStonewareArray;
  return stonewareArray
}

function mugsInit(){
  let newMugsArray = [];
  originalArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (lowerCaseProduct.startsWith('lc mug') || 
        lowerCaseProduct.startsWith('lc cappuccino') || 
        lowerCaseProduct.startsWith('lc espresso') || 
        lowerCaseProduct.startsWith('lc grand mug')
      ) {
        newMugsArray.push(product);
    }
  });
  mugArray = newMugsArray;
  return mugArray
}

function miscellaneousInit(){
  let newMiscellaneousArray = [];
  originalArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (lowerCaseProduct.startsWith('class') || 
    lowerCaseProduct.includes('kettle') || 
    lowerCaseProduct.includes('splatter') || 
    lowerCaseProduct.includes('glass') || 
    lowerCaseProduct.startsWith('30cm') || 
    lowerCaseProduct.includes('glass') ||
    lowerCaseProduct.includes(' ss') || 
    lowerCaseProduct.includes('bottle') || 
    lowerCaseProduct.includes('garlic press') || 
    lowerCaseProduct.includes('spoons') || 
    lowerCaseProduct.includes('strainer') || 
    lowerCaseProduct.includes('protector') || 
    lowerCaseProduct.includes('turner') || 
    lowerCaseProduct.includes('mash') || 
    lowerCaseProduct.includes('wire') || 
    lowerCaseProduct.startsWith('ss mixing') || 
    lowerCaseProduct.startsWith('bak') || 
    lowerCaseProduct.includes('ovw') ||
    lowerCaseProduct.includes('cooler') ||
    lowerCaseProduct.includes('wine') || 
    lowerCaseProduct.includes('opener') || 
    lowerCaseProduct.includes('waiters') || 
    lowerCaseProduct.includes('cutter') || 
    lowerCaseProduct.includes('stopper') || 
    lowerCaseProduct.includes('drip') || 
    lowerCaseProduct.startsWith('silicone mill') || 
    lowerCaseProduct.includes('spat') || 
    lowerCaseProduct.includes('brush') || 
    lowerCaseProduct.includes('cleaner') || 
    lowerCaseProduct.includes('book') || 
    lowerCaseProduct.includes('handle') || 
    lowerCaseProduct.includes('knob') || 
    lowerCaseProduct.includes('cool tool') || 
    lowerCaseProduct.includes('glove') || 
    lowerCaseProduct.includes('mitt') || 
    lowerCaseProduct.includes('citrus') || 
    lowerCaseProduct.includes('peeler') || 
    lowerCaseProduct.includes('turner') || 
    lowerCaseProduct.includes('whisk') || 
    lowerCaseProduct.includes('tongs') || 
    lowerCaseProduct.includes('knife') || 
    lowerCaseProduct.includes('grater') || 
    lowerCaseProduct.includes('gift voucher') || 
    lowerCaseProduct.includes('gift box') || 
    lowerCaseProduct.includes('activ table') || 
    lowerCaseProduct.includes('pourer') || 
    lowerCaseProduct.includes('virtual sales') || 
    lowerCaseProduct.includes('cookie jar santa') || 
    lowerCaseProduct.includes('edge')
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
  originalArray.forEach(product => {
    totalMoney += product.totalCost
  })
  castIronArray.forEach(product => {
    totalCastIron += product.totalCost
  })
  triplyArray.forEach(product => {
    totalTriply += product.totalCost
  })
  tnsArray.forEach(product => {
    totalTns += product.totalCost
  })
  stonewareArray.forEach(product => {
    totalStoneware += product.totalCost
  })
  miscellaneousArray.forEach(product => {
    totalMiscellaneous += product.totalCost
  })
  
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
  
}

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