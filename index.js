const submit = document.querySelector('#submit');
const input = document.querySelector('#spreadsheetData');
const table = document.querySelector('#output');
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

const alphabeticalButton = document.querySelector('#alphabeticalButton');
const quantityButton = document.querySelector('#quantityButton');
const totalCostButton = document.querySelector('#totalCostButton');

const totalQuantityStat = document.querySelector('#totalQuantity');
const totalCostStat = document.querySelector('#totalCost');
const avgCostStat = document.querySelector('#avgCost');
const mostPopularStat = document.querySelector('#mostPopular');
const leastPopularStat = document.querySelector('#leastPopular');

let productArray = [];

let alphabeticalToggle = false;
let quantityToggle = false;
let totalCostToggle = false;
let originalNames;

function initObject() {
  clearTable();
  outputArea.style.display = 'table';
  const spreadsheetData = input.value;
  input.value = '';
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
      
      table.appendChild(row);
      staggeredRow = !staggeredRow;
      updateDashboard()
    }
  });
}

function clearTable() {
  while (table.firstChild) {
    table.removeChild(table.lastChild);
  }
}

function initTable(){
  initObject();
  originalArray = productArray;
  productArray.sort((product1, product2) => (product1.itemDescription > product2.itemDescription) ? 1 : (product1.itemDescription < product2.itemDescription) ? -1 : 0);
  createTables();
}

function updateDashboard() {
  let totalQuantity = 0;
  let totalCost = 0;
  productArray.forEach(product => {
    totalQuantity += product.quantity
    totalCost += product.totalCost
  });
  let avgCost = (totalCost / totalQuantity).toFixed(2);
  totalQuantityStat.innerText = totalQuantity.toLocaleString('en') + ' Units';
  totalCostStat.innerText = '£' + totalCost.toLocaleString('en');
  avgCostStat.innerText = '£' + avgCost;
}


function castIronEventHandler (){
  clearTable();
  productArray = originalArray
  let newProductArray = [];
  productArray.forEach(product => {
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
        lowerCaseProduct.startsWith('pumpkin cass') || 
        lowerCaseProduct.startsWith('rnd tatin') || 
        lowerCaseProduct.startsWith('soup pot') || 
        lowerCaseProduct.includes('skillet')
      ) {
        newProductArray.push(product);
    }
  });  
  productArray = newProductArray;
  createTables();
}

function triplyEventHandler (){
  clearTable();
  productArray = originalArray
  let newProductArray = [];
  productArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (lowerCaseProduct.includes('3ply')) {
      newProductArray.push(product);
    }
  });
  productArray = newProductArray;
  createTables();
}

function tnsEventHandler (){
  clearTable();
  productArray = originalArray
  let newProductArray = [];
  productArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (lowerCaseProduct.includes('tns')) {
      newProductArray.push(product);
    }
  });
  productArray = newProductArray;
  createTables();
}

function stonewareEventHandler (){
  clearTable();
  productArray = originalArray
  let newProductArray = [];
  productArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (false) {
      newProductArray.push(product);
    }
  });
  productArray = newProductArray;
  createTables();
}

function mugsEventHandler (){
  clearTable();
  productArray = originalArray
  let newProductArray = [];
  productArray.forEach(product => {
    let lowerCaseProduct = product.itemDescription.toLowerCase();
    if (lowerCaseProduct.startsWith('lc mug') || 
        lowerCaseProduct.startsWith('lc cappuccino') || 
        lowerCaseProduct.startsWith('lc espresso') || 
        lowerCaseProduct.startsWith('lc grand mug')
      ) {
        newProductArray.push(product);
    }
  });
  productArray = newProductArray;
  createTables();
}

function miscellaneousEventHandler (){

}

function seasonalEventHandler (){

}

function allEventHandler (){
  clearTable();
  productArray = originalArray;
  createTables();
}

function alphabeticalSort(){
  clearTable();
  alphabeticalToggle ? productArray.sort((product1, product2) => (product1.itemDescription > product2.itemDescription) ? 1 : (product1.itemDescription < product2.itemDescription) ? -1 : 0) : productArray.sort((product1, product2) => (product1.itemDescription < product2.itemDescription) ? 1 : (product1.itemDescription > product2.itemDescription) ? -1 : 0);
  createTables();
  alphabeticalToggle = !alphabeticalToggle;
}

function quantitySort(){
  clearTable();
  quantityToggle ? productArray.sort((product1, product2) => (product1.quantity < product2.quantity) ? 1 : (product1.quantity > product2.quantity) ? -1 : 0) : productArray.sort((product1, product2) => (product1.quantity > product2.quantity) ? 1 : (product1.quantity < product2.quantity) ? -1 : 0);  
  createTables();
  quantityToggle = !quantityToggle;
}

function totalCostSort(){
  clearTable();
  totalCostToggle ? productArray.sort((product1, product2) => (product1.totalCost < product2.totalCost) ? 1 : (product1.totalCost > product2.totalCost) ? -1 : 0) : productArray.sort((product1, product2) => (product1.totalCost > product2.totalCost) ? 1 : (product1.totalCost < product2.totalCost) ? -1 : 0);  
  createTables();
  totalCostToggle = !totalCostToggle;
}

submit.addEventListener('click', initTable);
castIron.addEventListener('click', castIronEventHandler);
triply.addEventListener('click', triplyEventHandler);
tns.addEventListener('click', tnsEventHandler);
stoneware.addEventListener('click', stonewareEventHandler);
mugs.addEventListener('click', mugsEventHandler);
miscellaneous.addEventListener('click', miscellaneousEventHandler);
seasonal.addEventListener('click', seasonalEventHandler);
all.addEventListener('click', allEventHandler);

alphabeticalButton.addEventListener('click', alphabeticalSort);
quantityButton.addEventListener('click', quantitySort);
totalCostButton.addEventListener('click', totalCostSort);