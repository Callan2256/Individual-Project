window.addEventListener("load", init);

const operations = itemOperations;
const form = document.getElementsByClassName("form-control");

const total = document.querySelector('#total');
const mark = document.querySelector('#mark');
const unMark = document.querySelector('#unmark');

let saveFieldID = -1;

function init() {
    clearAll();
    loadId();
    showTotal();
    bindEvents();
}

function clearAll() {
    /* this function clears the contents of the form except the ID (since ID is auto generated)*/
    form.price.value = '';
    form.name.value = '';
    form.desc.value = '';
    form.url.value = '';
}

let auto = autoGen();

function loadId() {
    /* this function automatically sets the value of ID */
    document.querySelector('#id').innerText = auto.next().value;
}

function showTotal() {
    /* this function populates the values of #total, #mark and #unmark ids of the form */
    //Values to populate

    let totalStr = operations.items.length;
    let markedStr = operations.countTotalMarked();
    let unmarkedStr = totalStr - markedStr;

    total.innerText = totalStr;
    mark.innerText = markedStr;
    unmark.innerText = unmarkedStr;

}

function bindEvents() {
    document.querySelector('#remove').addEventListener('click', deleteRecords);
    document.querySelector('#add').addEventListener('click', addRecord);
    document.querySelector('#update').addEventListener('click', updateRecord)
    document.querySelector('#exchange').addEventListener('change', getExchangerate)
}

function deleteRecords() {
    /* this function deletes the selected record from itemOperations and prints the table using the function printTable*/
    operations.remove();
    printTable();
}




function addRecord() {
    /* this function adds a new record in itemOperations and then calls printRecord(). showTotal(), loadId() and clearAll()*/

    let id = form.id.innerText;
    let name = form.name.value;
    let price = form.price.value;
    let desc = form.desc.value;
    let color = form.color.value;
    let url = form.url.value;

    let item = new Item(id, name, price, desc, color, url, false);
    if (operations.search(id)) {
        console.log("Item already in table, please use update");
        return;
    }
    operations.items.push(item);


    //Calling Functions
    printRecord(item);
    showTotal();
    loadId();
    clearAll();
}

function edit() {
    /*this function fills (calls fillFields()) the form with the values of the item to edit after searching it in items */
    saveFieldID = document.querySelector('#id').innerText;
    let id = this.getAttribute('data-itemid');
    fillFields(operations.search(id));
}

function fillFields(itemObject) {
    /*this function fills the form with the details of itemObject*/
    form.id.innerText = itemObject.id;
    form.name.value = itemObject.name;
    form.price.value = itemObject.price;
    form.desc.value = itemObject.desc;
    form.color.value = itemObject.color;
    form.url.value = itemObject.url;
}

function createIcon(className, fn, id) {
    /* this function creates icons for edit and trash for each record in the table*/
    // <i class="fas fa-trash"></i>
    // <i class="fas fa-edit"></i>
    var iTag = document.createElement("i");
    iTag.className = className;
    iTag.addEventListener('click', fn);
    iTag.setAttribute("data-itemid", id);

    return iTag;
}


function updateRecord() {
    /*this function updates the record that is edited and then prints the table using printTable()*/
    let id = form.id.innerText;
    let name = form.name.value;
    let price = form.price.value;
    let desc = form.desc.value;
    let color = form.color.value;
    let url = form.url.value;

    let item = new Item(id, name, price, desc, color, url, false);
    let count = 0;
    for (let i of operations.items) {
        if (i.id === item.id) {
            operations.items[count] = item;
        }
        count++;
    }

    //Calling Functions
    printTable();
    showTotal();
    document.querySelector('#id').innerText = saveFieldID;
    clearAll();

}

function trash() {
    /*this function toggles the color of the row when its trash button is selected and updates the marked and unmarked fields */
    let id = this.getAttribute('data-itemid');
    itemOperations.markUnMark(id);
    showTotal();
    let tr = this.parentNode.parentNode;
    tr.classList.toggle('alert-danger');
    console.log("I am Trash ", this.getAttribute('data-itemid'))
}

function printTable() {
    /* this function calls printRecord for each item of items and then calls the showTotal function*/
    let table = document.querySelector('#items');
    table.innerHTML = '';
    for (let item of operations.items) {
        printRecord(item);
    }

    showTotal();
}

function printRecord(item) {
    var tbody = document.querySelector('#items');
    var tr = tbody.insertRow();
    var index = 0;
    for (let key in item) {
        if (key == 'isMarked') {
            continue;
        }
        let cell = tr.insertCell(index);
        cell.innerText = item[key];
        index++;
    }
    var lastTD = tr.insertCell(index);
    lastTD.appendChild(createIcon('fas fa-trash mr-2', trash, item.id));
    lastTD.appendChild(createIcon('fas fa-edit', edit, item.id));
}

async function getExchangerate() {
    /* this function makes an AJAX call to http://apilayer.net/api/live to fetch and display the exchange rate for the currency selected*/
    let priceValue = document.querySelector('#price').value;
    let exchangeRate = document.querySelector('#exchange').value;

    let url = 'http://apilayer.net/api/live?access_key=2bbde67cc40154a20a6713818c1a4957&currencies=NZD,AUD,CAD,EUR,GBP&source=USD&format=1'

    let res = await fetch(url);
    data = await res.json();

    let exchangeRates = data.quotes;

    let NZD = exchangeRates.USDNZD;
    let AUD = exchangeRates.USDAUD;
    let CAD = exchangeRates.USDCAD;
    let EUR = exchangeRates.USDEUR;
    let GBP = exchangeRates.USDGBP;

    let final = 0;

    switch (exchangeRate) {
        case 'NZD':
            final = NZD;
            break;
        case 'AUD':
            final = AUD;
            break;
        case 'CAD':
            final = CAD;
            break;
        case 'EUR':
            final = EUR;
            break;
        case 'GBP':
            final = GBP;
            break;
    }

    let exchangedAmount = priceValue * final;
    document.querySelector('#exrate').innerText = exchangedAmount;
}