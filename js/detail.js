// Function to fetch member details by ID
function getMemberById(id) {
    return partyData.find(member => member.id === id);
}

// Function to display member details
function displayMemberDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const memberId = parseInt(urlParams.get('id'), 10); // Get member ID from URL

    const member = getMemberById(memberId);
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

        displayEquipment(member.equipment); // Display equipment

        // Edit health form submission handler
        document.getElementById('edit-health-form').addEventListener('submit', function(e) {
            e.preventDefault();
            updateHealth(member, document.getElementById('health-input').value);
        });

        // Edit XP form submission handler
        document.getElementById('edit-xp-form').addEventListener('submit', function(e) {
            e.preventDefault();
            updateXP(member, document.getElementById('xp-input').value);
        });

    } else {
        memberDetails.innerHTML = '<p>Member not found.</p>';
    }
}

// Function to update health
function updateHealth(member, health) {
    if (health >= 0) {
        member.health = health;
        savePartyData();
        displayMemberDetails();
    } else {
        alert("Invalid health value!");
    }
}

// Function to update XP
function updateXP(member, xp) {
    if (xp >= 0) {
        member.xp = xp;
        member.level = calculateLevel(xp); // Recalculate level based on new XP
        member.bonus = xpThresholds[member.level - 1].bonus; // Update bonus
        savePartyData();
        displayMemberDetails();
    } else {
        alert("Invalid XP value!");
    }
}

// Function to display equipment
function displayEquipment(equipment) {
    const equipmentDiv = document.getElementById('equipment');
    equipmentDiv.innerHTML = ''; // Clear existing equipment list

    if (equipment && equipment.length > 0) {
        const paginationDiv = document.createElement('div');
        const pageSize = 3; // Items per page
        let currentPage = 1;
        const totalPages = Math.ceil(equipment.length / pageSize);

        // Display equipment for the current page
        function displayPage(page) {
            equipmentDiv.innerHTML = ''; // Clear previous page items
            const startIndex = (page - 1) * pageSize;
            const endIndex = Math.min(page * pageSize, equipment.length);
            const pageItems = equipment.slice(startIndex, endIndex);

            pageItems.forEach(item => {
                const div = document.createElement('div');
                div.textContent = `${item.type}: ${item.name} - ${item.description}`;
                equipmentDiv.appendChild(div);
            });

            // Update pagination controls
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

        displayPage(currentPage); // Display first page
    } else {
        equipmentDiv.innerHTML = '<p>No equipment found.</p>';
    }
}

// Display details when the page loads
displayMemberDetails();
