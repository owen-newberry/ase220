let partyData = [];

const blobUrl = 'https://api.jsonbin.io/v3/b/67d119af8960c979a56fee3c';

fetchPartyData();

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

async function getMemberById(id) {
    await fetchPartyData();
    console.log(partyData);
    return partyData.find(member => member.id === id);
}

async function displayMemberDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const memberId = parseInt(urlParams.get('id'), 10);

    try {
        const member = await getMemberById(memberId);

        console.log('Fetched member:', member);

        const memberDetails = document.getElementById('member-details');
        const healthSpan = document.getElementById('member-health');
        const xpSpan = document.getElementById('member-xp');
        const levelSpan = document.getElementById('member-level');

        if (member) {
            memberDetails.innerHTML = `
                <h2>${member.name}</h2>
                <p><strong>Class:</strong> ${member.class}</p>
                <p><strong>XP:</strong> ${member.xp}</p>
                <p><strong>Level:</strong> ${member.level}</p>
                <p><strong>Proficiency Bonus:</strong> +${member.bonus}</p>
            `;

            healthSpan.textContent = member.health;
            xpSpan.textContent = member.xp;
            levelSpan.textContent = member.level;

            displayEquipment(member.equipment);

            document.getElementById('edit-health-form').addEventListener('submit', function(e) {
                e.preventDefault();
                updateHealth(member, document.getElementById('health-input').value);
            });

            document.getElementById('edit-xp-form').addEventListener('submit', function(e) {
                e.preventDefault();
                updateXP(member, document.getElementById('xp-input').value);
            });

        } else {
            memberDetails.innerHTML = '<p>Member not found.</p>';
        }
    } catch (error) {
        console.error('Error displaying member details:', error);
    }
}


function updateHealth(member, health) {
    if (health >= 0) {
        member.health = health;
        savePartyData();
        displayMemberDetails();
    } else {
        alert("Invalid health value!");
    }
}

function updateXP(member, xp) {
    if (xp >= 0) {
        member.xp = xp;
        member.level = calculateLevel(xp);
        member.bonus = xpThresholds[member.level - 1].bonus;
        savePartyData();
        displayMemberDetails();
    } else {
        alert("Invalid XP value!");
    }
}

function displayEquipment(equipment) {
    const equipmentDiv = document.getElementById('equipment');
    equipmentDiv.innerHTML = '';

    if (equipment && equipment.length > 0) {
        const paginationDiv = document.createElement('div');
        const pageSize = 3;
        let currentPage = 1;
        const totalPages = Math.ceil(equipment.length / pageSize);

        function displayPage(page) {
            equipmentDiv.innerHTML = '';
            const startIndex = (page - 1) * pageSize;
            const endIndex = Math.min(page * pageSize, equipment.length);
            const pageItems = equipment.slice(startIndex, endIndex);

            pageItems.forEach(item => {
                const div = document.createElement('div');
                div.textContent = `${item.type}: ${item.name} - ${item.description}`;
                equipmentDiv.appendChild(div);
            });

            paginationDiv.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.onclick = function() {
                    currentPage = i;
                    displayPage(i);
                };
                paginationDiv.appendChild(button);
            }

            equipmentDiv.appendChild(paginationDiv);
        }

        displayPage(currentPage);
    } else {
        equipmentDiv.innerHTML = '<p>No equipment found.</p>';
    }
}

displayMemberDetails();
