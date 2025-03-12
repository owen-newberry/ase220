let partyData = JSON.parse(localStorage.getItem('partyData')) || [];

if (!partyData.length) {
    alert("No party data found. Redirecting to main page.");
    window.location.href = 'index.html';
}

const equipment = {
    armor: ["Plate Mail", "Leather Armor", "Chain Mail", "Ring Mail", "Scale Mail", "Splint Armor", "Brigandine Armor", "Hide Armor"],
    weapons: ["Sword", "Bow", "Axe", "Spear", "Hammer", "Crossbow", "Dagger", "Staff"],
    misc: ["Healing Potion", "Torch", "Rations", "Magic Scroll", "Thieves' Tools", "Lantern", "Grappling Hook", "Bedroll"]
};

const itemsPerPage = 4;
let currentPage = 1;
let currentCategory = 'armor';

const urlParams = new URLSearchParams(window.location.search);
const memberId = parseInt(urlParams.get('id'));

let member = partyData.find(m => m.id === memberId);
if (!member) {
    alert('Member not found!');
    window.location.href = 'index.html';
}

if (!member.equipment) {
    member.equipment = {
        armor: [],
        weapons: [],
        misc: []
    };
}

document.getElementById('member-name').textContent = `Managing Equipment for: ${member.name}`;

function displayCurrentEquipment(category) {
    ['armor', 'weapons', 'misc'].forEach(cat => {
        const equipmentList = document.getElementById(`${cat}-current-list`);
        equipmentList.innerHTML = '';
    });

    const equipmentList = document.getElementById(`${category}-current-list`);
    member.equipment[category].forEach(item => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = item;

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => removeEquipmentFromMember(category, item);

        li.appendChild(removeBtn);
        equipmentList.appendChild(li);
    });
}

function removeEquipmentFromMember(category, item) {
    member.equipment[category] = member.equipment[category].filter(equipment => equipment !== item);
    savePartyData();

    alert(`${item} removed from ${member.name}'s ${category}`);
    displayCurrentEquipment(category);
}

function displayEquipment(category) {
    currentCategory = category;

    const equipmentList = document.getElementById(`${category}-list`);
    equipmentList.innerHTML = '';

    const items = equipment[category] || [];
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = Math.min(currentPage * itemsPerPage, items.length);

    for (let i = startIdx; i < endIdx; i++) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = items[i];

        const addBtn = document.createElement('button');
        addBtn.classList.add('btn', 'btn-success', 'btn-sm', 'float-end');
        addBtn.textContent = 'Add';
        addBtn.onclick = () => addEquipmentToMember(category, items[i]);

        li.appendChild(addBtn);
        equipmentList.appendChild(li);
    }

    const gapDiv = document.createElement('div');
    gapDiv.classList.add('equipment-gap');
    equipmentList.appendChild(gapDiv);

    const loadMoreBtn = document.getElementById('load-more-btn');
    loadMoreBtn.disabled = currentPage * itemsPerPage >= items.length;
}

function addEquipmentToMember(category, item) {
    member.equipment[category].push(item);
    savePartyData();

    alert(`${item} added to ${member.name}'s ${category}`);
    displayCurrentEquipment(category);
}

document.getElementById('load-more-btn').onclick = () => {
    currentPage++;
    displayEquipment(currentCategory);
};

document.getElementById('armor-tab').onclick = () => {
    clearOtherCategories('armor');
    currentPage = 1;
    displayEquipment('armor');
    displayCurrentEquipment('armor');
};
document.getElementById('weapons-tab').onclick = () => {
    clearOtherCategories('weapons');
    currentPage = 1;
    displayEquipment('weapons');
    displayCurrentEquipment('weapons');
};
document.getElementById('misc-tab').onclick = () => {
    clearOtherCategories('misc');
    currentPage = 1; 
    displayEquipment('misc');
    displayCurrentEquipment('misc');
};

function clearOtherCategories(selectedCategory) {
    const categories = ['armor', 'weapons', 'misc'];
    categories.forEach(category => {
        if (category !== selectedCategory) {
            const equipmentList = document.getElementById(`${category}-list`);
            equipmentList.innerHTML = '';
        }
    });
}

document.getElementById('back-btn').onclick = () => {
    window.location.href = 'index.html';
};

displayEquipment('armor');
displayCurrentEquipment('armor');

function savePartyData() {
    localStorage.setItem('partyData', JSON.stringify(partyData));
}
