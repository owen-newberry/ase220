import { calculateLevel, savePartyData, fetchPartyData } from './utils.js';

async function getMemberById(id) {
    const partyData = await fetchPartyData();
    return partyData.find(member => member.id === id);
}

async function displayMemberDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const memberId = parseInt(urlParams.get('id'), 10);

    try {
        const member = await getMemberById(memberId);
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
        member.bonus = Math.floor(member.level/4) + 2;
        savePartyData();
        displayMemberDetails();
    } else {
        alert("Invalid XP value!");
    }
}

displayMemberDetails();
