import { calculateLevel, savePartyData, fetchPartyData, blobUrl } from './utils.js';

async function initialize() {
    const partyData = await fetchPartyData();
    displayParty(partyData);
}

function displayParty(party) {
    const partyList = document.getElementById('party-list');
    partyList.innerHTML = '';

    party.forEach(member => {
        const listItem = document.createElement('li');
        listItem.classList.add('party-item', 'list-group-item');

        const memberContainer = document.createElement('div');
        memberContainer.classList.add('member-container');

        const detailLink = document.createElement('a');
        detailLink.href = `detail.html?id=${member.id}`;
        detailLink.textContent = `${member.name} (Class: ${member.class}, XP: ${member.xp}, Level: ${member.level})`;

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const manageEquipmentBtn = document.createElement('button');
        manageEquipmentBtn.textContent = 'Manage Equipment';
        manageEquipmentBtn.className = "btn btn-info-xs";
        manageEquipmentBtn.onclick = () => manageEquipment(member.id);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = "btn btn-danger-xs";
        removeBtn.onclick = () => removeMember(member.id, listItem);

        buttonContainer.appendChild(manageEquipmentBtn);
        buttonContainer.appendChild(removeBtn);

        memberContainer.appendChild(detailLink);
        memberContainer.appendChild(buttonContainer);
        listItem.appendChild(memberContainer);
        partyList.appendChild(listItem);
    });
}

async function addMember(e) {
    e.preventDefault();
    
    let partyData = await fetchPartyData();
    const name = document.getElementById('member-name').value.trim();
    const classType = document.getElementById('member-class').value.trim();
    const xp = parseInt(document.getElementById('member-xp').value.trim()) || 0;
    const level = calculateLevel(xp);
    const health = level * 5 + 3;
    const bonus = Math.floor(level/4) + 2;

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
        let partyData = await fetchPartyData();
        partyData = partyData.filter(member => member.id !== id);
        
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
        
        displayParty(partyData);
    }
}

function manageEquipment(id) {
    const url = `add-equipment.html?id=${id}`;
    window.location.href = url;
}

document.getElementById('add-member-form').addEventListener('submit', addMember);

initialize();