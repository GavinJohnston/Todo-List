const uri = 'api/todoitem';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const categoryBox = document.getElementById('category').options[document.getElementById('category').selectedIndex].value;

    console.log(categoryBox);

    const item = {
        isComplete: false,
        name: addNameTextbox.value.trim(),
        Category: categoryBox
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    document.getElementById('editForm').style.display = 'block';
    var catUpdate = document.getElementById('categoryUpdate');
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const categoryBoxUpdate = document.getElementById('categoryUpdate').options[document.getElementById('categoryUpdate').selectedIndex].value;

    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim(),
        category: categoryBoxUpdate
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function editElement(Id) {

    const checkbox = document.getElementById(`checkbox_id_${Id}`);

    if (checkbox.checked == true) {
        fetch(`${uri}/${Id}`, {
            method: 'PATCH',
            body: JSON.stringify(
                [
                    {
                        "path": "/isComplete",
                        "value": true,
                        "op": "replace"
                    }
                ]),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(() => getItems())
            .catch(error => console.error('Unable to update item.', error));
    } else {
        fetch(`${uri}/${Id}`, {
            method: 'PATCH',
            body: JSON.stringify(
                [
                    {
                        "path": "/isComplete",
                        "value": false,
                        "op": "replace"
                    }
                ]),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(() => getItems())
            .catch(error => console.error('Unable to update item.', error));
    }

    }

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    console.log(data);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        //isCompleteCheckbox.disabled = false;
        isCompleteCheckbox.checked = item.isComplete;
        isCompleteCheckbox.setAttribute('id', `checkbox_id_${item.id}`);
        isCompleteCheckbox.setAttribute('onclick', `editElement(${item.id})`);

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();
  
        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        console.log(item.Category);

        let td2 = tr.insertCell(1);
        let textNodeName = document.createTextNode(item.name);
        td2.appendChild(textNodeName);

        if (item.isComplete == true) {
            td2.setAttribute("class", "checkedItem");
        }

        let td3 = tr.insertCell(2);
        let textNodeCategory = document.createTextNode(item.category);
        td3.appendChild(textNodeCategory);

        let td4 = tr.insertCell(3);
        td4.appendChild(editButton);

        let td5 = tr.insertCell(4);
        td5.appendChild(deleteButton);
    });

    const items = document.querySelectorAll(".checkedItem");

    if (items.length > 0) {

        items.forEach(el => {
            el.style.textDecoration = "line-through";
        });

    }

    todos = data;
}