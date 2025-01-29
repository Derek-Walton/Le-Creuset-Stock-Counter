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
  'chartContainer', 'errorPercentage'
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
let productArray = [];

// Hidden arrays which are categorized
let castIronArray = [];
let triplyArray = [];
let tnsArray = [];
let stonewareArray = [];
let miscellaneousArray = [];
let mugArray = [];
let unassignedArray = [];

let pieChart;

// Functions

// Ran on submit
function init(){
  clearData();
  initObject();
  pieChart ? pieChart.destroy() : '';
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
  unassignedInit()

  updateMoneyPercentage();

  createTables();
}

function clearData(){
  alphabeticalToggle = false;
  quantityToggle = false;
  totalCostToggle = false;
  costToggle = false;
  productArray = [];
  originalArray = [];
  castIronArray = [];
  triplyArray = [];
  tnsArray = [];
  stonewareArray = [];
  miscellaneousArray = [];
  mugArray = [];
  unassignedArray = [];
  updateDashboard();
}


// Creates the main object for all the products
function initObject() {
  clearTable();
  elements.table.style.display = 'table';
  const spreadsheetData = elements.spreadsheetInput.value;
  elements.spreadsheetInput.value = '';
  const spreadsheetSplit = spreadsheetData.split('\t');
  
  for (let i = 2; i < spreadsheetSplit.length; i += 5) {
    const productName = spreadsheetSplit[i];    
    const productPrice = -spreadsheetSplit[i + 3].split('\n')[0];
    const productTotalPrice = -parseFloat(spreadsheetSplit[i + 3].split('\'')[0]);
    const productQuantity = -spreadsheetSplit[i + 2];
    const productDate = spreadsheetSplit[i + 1];
    if (productName != 'Item Description') {
      if (productArray.find(product => product.itemDescription == productName)) {
        const correctProduct = productArray.find(product => product.itemDescription == productName);
        correctProduct.totalCost += productTotalPrice;
        correctProduct.quantity += productQuantity;
        correctProduct.productPrice = (correctProduct.productPrice + productPrice / 2);
      } else {
        productArray.push({ 
          itemDescription: productName, 
          quantity: productQuantity, 
          unitCost: productPrice, 
          totalCost: productTotalPrice
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
  originalArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (
      stonewareKeywordsIncludes.some(keyword => lowerCaseProduct.includes(keyword)) ||
      stonewareKeywordsStartWith.some(keyword => lowerCaseProduct.startsWith(keyword))
      ) {
        newStonewareArray.push(product);
    }
  });
  stonewareArray = newStonewareArray;

  return stonewareArray
}


// ORIGNIAL
// function stonewareInitORIGINAL(){
//   let newStonewareArray = originalArray.filter(
//     item => !castIronArray.includes(item) &&
//     !tnsArray.includes(item) &&
//     !triplyArray.includes(item) &&
//     !miscellaneousArray.includes(item)
// );  
//   stonewareArray = newStonewareArray;

//   // const newArr = [];
//   // for (const item of stonewareArray) {
//   //   // newArr.push(item.values);
//   //   newArr.push(Object.values(item).join('\t'));
//   // }
//   // console.log(newArr.join('\n'));

//   return stonewareArray
// }

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
  originalArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (
      miscellaneousKeywordsIncludes.some(keyword => lowerCaseProduct.includes(keyword)) ||
      miscellaneousKeywordsStartWith.some(keyword => lowerCaseProduct.startsWith(keyword))
      ) {
        newMiscellaneousArray.push(product);
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
}


// Creating / removing the table

// Creates the table for the screen
function createTables() {
  console.log('HERREREEE!!');
  
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
      
      const rowAvgCost = document.createElement('td');
      const avgCost = document.createTextNode(`£${product.unitCost.toFixed(2)}`);
      rowAvgCost.appendChild(avgCost);
      
      const rowTotalCost = document.createElement('td');
      const totalCost = document.createTextNode(`£${product.totalCost.toFixed(2)}`);
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
      updateDashboard()
    }
  });
}

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

function unassignedFilter (){
  clearTable();
  productArray = unassignedArray;
  createTables();
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

function costSort(){
  clearTable();
  costToggle ? productArray.sort((product1, product2) => (product1.unitCost < product2.unitCost) 
  ? 1 : (product1.unitCost > product2.unitCost) 
  ? -1 : 0) : productArray.sort((product1, product2) => (product1.unitCost > product2.unitCost) 
  ? 1 : (product1.unitCost < product2.unitCost) 
  ? -1 : 0);  
  createTables();
  costToggle = !costToggle;
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
  let totalUnassigned = 0;

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
  for (const product of unassignedArray) {
    totalUnassigned += product.totalCost;
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