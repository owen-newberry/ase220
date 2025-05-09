import { loadAllItems, getPartyMemberById, updatePartyMember } from './utils.js';

const items = await loadAllItems();
const campaignId = getCampaignIdFromUrl();

const itemsPerPage = 4;
let currentPage = 1;
let currentCategory = 'armor';

const urlParams = new URLSearchParams(window.location.search);
const memberId = urlParams.get('id');
console.log(memberId);

export async function displayCurrentItems() {
    const member = await getPartyMemberById(memberId);
    const currentItems = member.items

    const categorized = {
        armor: [],
        weapons: [],
        misc: []
    };

    currentItems.forEach(item => {
        const type = item.properties?.["Item Type"];
        if (type === "Armor") categorized.armor.push(item);
        else if (type === "Weapon") categorized.weapons.push(item);
        else categorized.misc.push(item);
    });

    ['armor', 'weapons', 'misc'].forEach(category => {
        const equipmentList = document.getElementById(`${category}-current-list`);
        if (!equipmentList) return;

        equipmentList.innerHTML = '';
        categorized[category].forEach(item => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.textContent = item.name;

            const removeBtn = document.createElement('button');
            removeBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end');
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = () => removeEquipment(item.name);

            li.appendChild(removeBtn);
            equipmentList.appendChild(li);
        });
    });
}


async function removeEquipment(itemName) {
    console.log(itemName);
    const member = await getPartyMemberById(memberId);

    const itemIndex = member.items.findIndex(e => e.name === itemName);
    if (itemIndex !== -1) {
        const item = member.items[itemIndex];

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            member.items.splice(itemIndex, 1);
        }

        await updatePartyMember(memberId, member);
        alert(`${item.name} removed from ${member.name}'s inventory`);
        displayCurrentItems();
    } else {
        alert(`Item not found in ${member.name}'s inventory.`);
    }
}



function displayItems(category) {
    currentCategory = category;

    const equipmentList = document.getElementById(`${category}-list`);
    if (currentPage === 1) equipmentList.innerHTML = '';

    const categoryItems = items[category] || [];

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = Math.min(currentPage * itemsPerPage, categoryItems.length);

    for (let i = startIdx; i < endIdx; i++) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = categoryItems[i].name;

        const addBtn = document.createElement('button');
        addBtn.classList.add('btn', 'btn-success', 'btn-sm', 'float-end');
        addBtn.textContent = 'Add';
        addBtn.onclick = () => addEquipment(category, categoryItems[i]);

        li.appendChild(addBtn);
        equipmentList.appendChild(li);
    }

    const gapDiv = document.createElement('div');
    gapDiv.classList.add('equipment-gap');
    equipmentList.appendChild(gapDiv);

    const loadMoreBtn = document.getElementById('load-more-btn');
    loadMoreBtn.disabled = currentPage * itemsPerPage >= categoryItems.length;
}

async function addEquipment(category, item) {
    const member = await getPartyMemberById(memberId);

    const existingItem = member.items.find(e => e.name === item.name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const itemToAdd = { 
            ...item, 
            quantity: 1 
        };
        console.log('Adding item:', item);

        member.items.push(itemToAdd);
        console.log(member.items);
    }

    await updatePartyMember(memberId, member);
    alert(`${item.name} added.`);
    displayCurrentItems(category);
}




document.getElementById('load-more-btn').onclick = () => {
    currentPage++;
    displayItems(currentCategory);
};

document.getElementById('armor-tab').onclick = () => {
    clearOtherCategories('armor');
    currentPage = 1;
    displayItems('armor');
    displayCurrentItems('armor');
};
document.getElementById('weapons-tab').onclick = () => {
    clearOtherCategories('weapons');
    currentPage = 1;
    displayItems('weapons');
    displayCurrentItems('weapons');
};
document.getElementById('misc-tab').onclick = () => {
    clearOtherCategories('misc');
    currentPage = 1;
    displayItems('misc');
    displayCurrentItems('misc');
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
    window.location.href = `index.html?campaignId=${campaignId}`;
};

function getCampaignIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('campaignId');
}

displayItems('armor');
displayCurrentItems(memberId);