import { calculateLevel, getPartyMemberById, updatePartyMember } from './utils.js';
const campaignId = getCampaignIdFromUrl();
const urlParams = new URLSearchParams(window.location.search);
const memberId = urlParams.get('id');

async function displayMemberDetails() {
    

    try {
        const member = await getPartyMemberById(memberId);
        const memberDetails = document.getElementById('member-details');
        const healthSpan = document.getElementById('member-health');
        const xpSpan = document.getElementById('member-xp');
        const levelSpan = document.getElementById('member-level');

        if (member) {
            memberDetails.innerHTML = `
                <h2>${member.name}</h2>
                <p><strong>Class:</strong> ${member.playerClass}</p>
                <p><strong>XP:</strong> ${member.xp}</p>
                <p><strong>Level:</strong> ${member.level}</p>
                <p><strong>Proficiency Bonus:</strong> +${member.bonus}</p>
            `;

            healthSpan.textContent = member.health.current+'/'+member.health.max;
            xpSpan.textContent = member.xp;
            levelSpan.textContent = member.level;

            document.getElementById('edit-health-form').addEventListener('submit', function(e) {
                e.preventDefault();
                updateHealth(member._id, document.getElementById('health-input').value);
            });

            document.getElementById('edit-xp-form').addEventListener('submit', function(e) {
                e.preventDefault();
                updateXP(member._id, document.getElementById('xp-input').value);
            });

        } else {
            memberDetails.innerHTML = '<p>Member not found.</p>';
        }
    } catch (error) {
        console.error('Error displaying member details:', error);
    }
}

async function updateHealth(id, health) {
    let updatedData = await getPartyMemberById(id);
    updatedData.health.current = health;
    await updatePartyMember(id, updatedData);
    displayMemberDetails();
}

async function updateXP(id, xp) {
    let updatedData = await getPartyMemberById(id);
    updatedData.xp = xp;
    if(updatedData.level != calculateLevel(xp)) {
        updatedData.level = calculateLevel(xp);
        updatedData.bonus = Math.floor(updatedData.level/4) + 2;
        updatedData.health.max = updatedData.level * 5 + 3;
        updatedData.health.current = updatedData.health.max;
    }
    await updatePartyMember(id, updatedData);
    displayMemberDetails();
}

document.getElementById('back-btn').onclick = () => {
    window.location.href = `index.html?campaignId=${campaignId}`;
};

function getCampaignIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('campaignId');
}

displayMemberDetails();