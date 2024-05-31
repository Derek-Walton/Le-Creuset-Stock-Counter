const submit = document.querySelector('#submit');
const input = document.querySelector('#spreadsheetData');
const table = document.querySelector('#output');

let itemObject = {};


function eventHandler() {
  const spreadsheetData = input.value;
  input.value = ''
  const spreadsheetSplit = spreadsheetData.split('\t')
  for (let i = 2; i < spreadsheetSplit.length; i += 5) {
    const itemName = spreadsheetSplit[i];
    if (itemName != 'Item Description') {
      if (itemName in itemObject) {
        itemObject[itemName] -= spreadsheetSplit[i + 2];
      } else {
        itemObject[itemName] = -spreadsheetSplit[i + 2];
      }
    }
  }

  const keyArray = Object.keys(itemObject).sort();
  let staggeredRow = true;
  
  for (const key of keyArray) {
    if (itemObject[key] > 0) {
      const row = document.createElement('tr');
      row.className =  staggeredRow ? 'even': 'odd';
      
      const rowName = document.createElement('td');
      const name = document.createTextNode(key);
      rowName.appendChild(name);
      
      const rowQuantity = document.createElement('td');
      const quantity = document.createTextNode(itemObject[key]);
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

submit.addEventListener('click', eventHandler);