let partyData = [];

const blobUrl = 'https://api.jsonbin.io/v3/b/67d119af8960c979a56fee3c';

const xpThresholds = [
    { xp: 0, level: 1, bonus: 2 },
    { xp: 300, level: 2, bonus: 2 },
    { xp: 900, level: 3, bonus: 2 },
    { xp: 2700, level: 4, bonus: 2 },
    { xp: 6500, level: 5, bonus: 3 },
    { xp: 14000, level: 6, bonus: 3 },
    { xp: 23000, level: 7, bonus: 3 },
    { xp: 34000, level: 8, bonus: 3 },
    { xp: 48000, level: 9, bonus: 4 },
    { xp: 64000, level: 10, bonus: 4 },
    { xp: 85000, level: 11, bonus: 4 },
    { xp: 100000, level: 12, bonus: 4 },
    { xp: 120000, level: 13, bonus: 5 },
    { xp: 140000, level: 14, bonus: 5 },
    { xp: 165000, level: 15, bonus: 5 },
    { xp: 195000, level: 16, bonus: 5 },
    { xp: 225000, level: 17, bonus: 6 },
    { xp: 265000, level: 18, bonus: 6 },
    { xp: 305000, level: 19, bonus: 6 },
    { xp: 355000, level: 20, bonus: 6 },
];

fetchPartyData();

document.getElementById('add-member-form').addEventListener('submit', addMember);

async function fetchPartyData() {
    try {
        const response = await fetch(blobUrl, {
            method: 'GET',
            headers: {
                'X-Master-Key': '$2a$10$kbMZq5216WIBSG3qZKCxtuKqtIoLuLtZjeYF/OtJfQ6JBKR6RADRy',
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        if (!response.ok) throw new Error('Failed to fetch party data');
        partyData = data.record.record;
        displayParty(partyData);
    } catch (error) {
        console.error('Error fetching party data:', error);
    }
}

async function savePartyData() {
    try {
        const response = await fetch(blobUrl, {
            method: 'PUT',
            headers: {
                'X-Master-Key': '$2a$10$kbMZq5216WIBSG3qZKCxtuKqtIoLuLtZjeYF/OtJfQ6JBKR6RADRy',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ record: partyData }),
        });
        if (!response.ok) throw new Error('Failed to save party data');
    } catch (error) {
        console.error('Error saving party data:', error);
    }
}

function displayParty(party) {
    const partyList = document.getElementById('party-list');
    partyList.innerHTML = '';

    party.forEach(member => {
        const listItem = document.createElement('li');
        listItem.classList.add('party-item', 'list-group-item');

        // Container for name + buttons
        const memberContainer = document.createElement('div');
        memberContainer.classList.add('member-container');

        // Member Name
        const detailLink = document.createElement('a');
        detailLink.href = `detail.html?id=${member.id}`;
        detailLink.textContent = `${member.name} (Class: ${member.class}, XP: ${member.xp}, Level: ${member.level})`;

        // Buttons Container
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        // Add XP Button
        const addXpBtn = document.createElement('button');
        addXpBtn.textContent = 'Add XP';
        addXpBtn.className = "btn btn-danger-xs";
        addXpBtn.onclick = () => addXp(member.id);

        // Edit Health Button
        const editHealthBtn = document.createElement('button');
        editHealthBtn.textContent = 'Edit Health';
        editHealthBtn.className = "btn btn-warning-xs";
        editHealthBtn.onclick = () => editHealth(member.id);

        // Manage Equipment Button
        const manageEquipmentBtn = document.createElement('button');
        manageEquipmentBtn.textContent = 'Manage Equipment';
        manageEquipmentBtn.className = "btn btn-info-xs";
        manageEquipmentBtn.onclick = () => manageEquipment(member.id);

        // Remove Button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = "btn btn-danger-xs";
        removeBtn.onclick = () => removeMember(member.id, listItem);

        // Append buttons to container
        buttonContainer.appendChild(addXpBtn);
        buttonContainer.appendChild(editHealthBtn);
        buttonContainer.appendChild(manageEquipmentBtn);
        buttonContainer.appendChild(removeBtn);

        // Append elements
        memberContainer.appendChild(detailLink);
        memberContainer.appendChild(buttonContainer);
        listItem.appendChild(memberContainer);
        partyList.appendChild(listItem);
    });
}

async function addMember(e) {
    e.preventDefault();
    
    const name = document.getElementById('member-name').value.trim();
    const classType = document.getElementById('member-class').value.trim();
    const xp = parseInt(document.getElementById('member-xp').value.trim()) || 0;
    const level = calculateLevel(xp);
    const health = level * 5 + 3;
    const bonus = xpThresholds[level - 1].bonus;

    if (name && classType) {
        const newId = partyData.length ? Math.max(...partyData.map(member => member.id)) + 1 : 1;

        const newMember = {
            id: newId,
            name: name,
            class: classType,
            xp: xp,
            level: level,
            bonus: bonus,
            health: health,
            equipment: {
                armor: [],
                weapons: [],
                misc: [],
            },
        };
        partyData.push(newMember);
        await savePartyData();

        displayParty(partyData);

        document.getElementById('add-member-form').reset();
    }
}

async function removeMember(id) {
    const confirmation = confirm('Are you sure you want to delete this member? This action cannot be undone.');
    if (confirmation) {
        partyData = partyData.filter(member => member.id !== id);
        await savePartyData();
        displayParty(partyData);
    }
}

async function addXp(id) {
    const member = partyData.find(member => member.id === id);
    if (member) {
        const xpToAdd = prompt(`How many XP to add to ${member.name}?`, "0");
        
        if (!isNaN(xpToAdd) && xpToAdd !== null) {
            member.xp += parseInt(xpToAdd, 10);
            member.level = calculateLevel(member.xp);
            member.bonus = xpThresholds[member.level - 1].bonus;
            await savePartyData();
            displayParty(partyData);
        } else {
            alert("Invalid XP value!");
        }
    }
}

function editHealth(id) {
    const member = partyData.find(member => member.id === id);
    if (member) {
        const newHealth = prompt(`Edit health for ${member.name}:`, member.health);
        if (newHealth !== null && !isNaN(newHealth)) {
            member.health = parseInt(newHealth, 10);
            savePartyData();
            displayParty(partyData);
        } else {
            alert('Invalid health value!');
        }
    }
}

function manageEquipment(id) {
    const url = `add-equipment.html?id=${id}`;
    window.location.href = url;
}

function calculateLevel(xp) {
    let level = 1;

    for (let i = 0; i < xpThresholds.length; i++) {
        if (xp >= xpThresholds[i].xp) level = xpThresholds[i].level;
        else break;
    }

    return level;
}
