import { calculateLevel, savePartyData, fetchPartyData, deletePartyMember } from './utils.js';
const campaignId = getCampaignIdFromUrl();

async function initialize() {
    const partyData = await fetchPartyData(campaignId);

    if (!partyData || !Array.isArray(partyData)) {
        console.error('Invalid or missing party data.');
        return;
    }

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
        detailLink.href = `detail.html?campaignId=${campaignId}&id=${member._id}`;
        detailLink.textContent = `${member.name} (Class: ${member.playerClass}, XP: ${member.xp}, Level: ${member.level})`;

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const manageEquipmentBtn = document.createElement('button');
        manageEquipmentBtn.textContent = 'Manage Equipment';
        manageEquipmentBtn.className = "btn btn-info-xs";
        manageEquipmentBtn.onclick = () => manageEquipment(member._id);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = "btn btn-danger-xs";
        removeBtn.onclick = () => removeMember(member._id, listItem);

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

    const name = document.getElementById('member-name').value.trim();
    const classType = document.getElementById('member-class').value.trim();
    const xp = parseInt(document.getElementById('member-xp').value.trim()) || 0;
    const level = calculateLevel(xp);
    const health = level * 5 + 3;
    const bonus = Math.floor(level / 4) + 2;

    if (name && classType) {
        const newMember = {
            name: name,
            playerClass: classType,
            xp: xp,
            level: level,
            bonus: bonus,
            health: {
                current: health,
                max: health
            },
            items: [],
            campaign: campaignId
        };
        
        await savePartyData(newMember, campaignId);

        document.getElementById('add-member-form').reset();
        initialize();
    }
}

async function removeMember(id) {
    const confirmation = confirm('Are you sure you want to delete this member? This action cannot be undone.');
    if (confirmation) {
        await deletePartyMember(id);
        initialize();
    }
}

function manageEquipment(id) {
    const url = `add-items.html?campaignId=${campaignId}&id=${id}`;
    window.location.href = url;
}

function getCampaignIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('campaignId');
}

document.getElementById('add-member-form').addEventListener('submit', addMember);

document.getElementById('back-btn').onclick = () => {
    window.location.href = `../campaign/index.html`;
};

initialize();