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

const alphabetical = document.querySelector('#alphabetical');
const quantity = document.querySelector('#quantitySort');

const totalQuantity = document.querySelector('#totalQuantity');
const totalCost = document.querySelector('#totalCost');
const avgCost = document.querySelector('#avgCost');
const mostPopular = document.querySelector('#mostPopular');
const leastPopular = document.querySelector('#leastPopular');

let productObject = {};

let alphabeticalToggle = false;
let quantityToggle = false;
let originalNames;

function initObject() {
  clearTable();
  productObject = {};
  outputArea.style.display = 'table';
  const spreadsheetData = input.value;
  input.value = ''
  const spreadsheetSplit = spreadsheetData.split('\t')
  
  for (let i = 2; i < spreadsheetSplit.length; i += 5) {
    const productName = spreadsheetSplit[i];    
    if (productName != 'Product Description') {
      if (productName in productObject) {
        productObject[productName] -= spreadsheetSplit[i + 2];
      } else {
        productObject[productName] = -spreadsheetSplit[i + 2];
      }
    }
  }
  return productObject;
}

function createTables() {
  let staggeredRow = true;
  for (const key of productNames) {
    if (productObject[key] > 0) {
      const row = document.createElement('tr');
      row.className =  staggeredRow ? 'even': 'odd';
      
      const rowName = document.createElement('td');
      const name = document.createTextNode(key);
      rowName.appendChild(name);
      
      const rowQuantity = document.createElement('td');
      const quantity = document.createTextNode(productObject[key]);
      rowQuantity.appendChild(quantity);
      
      const checkBoxElement = document.createElement('td');
      const checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBoxElement.appendChild(checkBox);
      
      row.appendChild(rowName);
      row.appendChild(rowQuantity);
      row.appendChild(checkBoxElement);
      
      table.appendChild(row);
      staggeredRow = !staggeredRow;
    }
  }  
}

function clearTable() {
  while (table.firstChild) {
    table.removeChild(table.lastChild);
  }
}

function initTable(){
  initObject();
  productNames = Object.keys(productObject).sort();
  originalNames = productNames;
  createTables();
}

// function updateDashboard() {
//   productNames
// }


function castIronEventHandler (){
  clearTable();
  productNames = originalNames
  let newProductNames = [];
  productNames.forEach(product => {
    let lowerCaseProduct = product.toLowerCase();
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
        newProductNames.push(product);
    }
  });
  productNames = newProductNames;
  createTables();
}
function triplyEventHandler (){
  clearTable();
  productNames = originalNames
  let newProductNames = [];
  productNames.forEach(product => {
    let lowerCaseProduct = product.toLowerCase();
    if (lowerCaseProduct.includes('3ply')) {
        newProductNames.push(product);
    }
  });
  productNames = newProductNames;
  createTables();
}
function tnsEventHandler (){
  clearTable();
  productNames = originalNames
  let newProductNames = [];
  productNames.forEach(product => {
    let lowerCaseProduct = product.toLowerCase();
    if (lowerCaseProduct.includes('tns')) {
        newProductNames.push(product);
    }
  });
  productNames = newProductNames;
  createTables();
}
function stonewareEventHandler (){
  clearTable();
  productNames = originalNames
  let newProductNames = [];
  productNames.forEach(product => {
    let lowerCaseProduct = product.toLowerCase();
    if (false) {
        newProductNames.push(product);
    }
  });
  productNames = newProductNames;
  createTables();
}
function mugsEventHandler (){
  clearTable();
  productNames = originalNames
  let newProductNames = [];
  productNames.forEach(product => {
    let lowerCaseProduct = product.toLowerCase();
    if (lowerCaseProduct.startsWith('lc mug') || 
        lowerCaseProduct.startsWith('lc cappuccino') || 
        lowerCaseProduct.startsWith('lc espresso') || 
        lowerCaseProduct.startsWith('lc grand mug')
      ) {
        newProductNames.push(product);
    }
  });
  productNames = newProductNames;
  createTables();
}
function miscellaneousEventHandler (){

}
function seasonalEventHandler (){

}
function allEventHandler (){
  clearTable();
  productNames = originalNames;
  createTables();
}

function alphabeticalSort(){
  clearTable();
  productNames = alphabeticalToggle ? productNames.sort() : productNames.sort().reverse();
  createTables();
  alphabeticalToggle = !alphabeticalToggle;
}

function quantitySort(){
  clearTable();
  allProductNamesSorted = quantityToggle ? Object.keys(productObject).sort(function(a,b){return productObject[a]-productObject[b]}) : Object.keys(productObject).sort(function(a,b){return productObject[b]-productObject[a]});
  let sortedProductNames = [];
  allProductNamesSorted.forEach(product => {
    if (productNames.includes(product)){
      sortedProductNames.push(product);
    }
  });
  productNames = sortedProductNames;
  
  createTables();
  quantityToggle = !quantityToggle;
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

alphabetical.addEventListener('click', alphabeticalSort);
quantity.addEventListener('click', quantitySort);