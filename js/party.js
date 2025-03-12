// Global variable to store party data
let partyData = [];

//JSONBlob URL
const jsonBlobUrl = 'http://jsonblob.com/1349183542348931072';

// XP thresholds for level progression
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

// Event listener for the add member form
document.getElementById('add-member-form').addEventListener('submit', addMember);

//Function to fetch party data
async function fetchPartyData() {
    try {
        const response = await fetch(jsonBlobUrl);
        if (!response.ok) throw new Error('Failed to fetch party data');
        partyData = await response.json();
        displayParty(partyData); // Display the fetched data
    } catch (error) {
        console.error('Error fetching party data:', error);
    }
}

//Function to save party data
async function savePartyData() {
    try {
        const response = await fetch(jsonBlobUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partyData),
        });
        if (!response.ok) throw new Error('Failed to save party data');
    } catch (error) {
        console.error('Error saving party data:', error);
    }
}

// Function to display party members
function displayParty(party) {
    const partyList = document.getElementById('party-list');
    partyList.innerHTML = ''; // Clear existing list

    party.forEach(member => {
        const li = document.createElement('li');
        // Link to the detail page
        const detailLink = document.createElement('a');
        detailLink.href = `detail.html?id=${member.id}`; // Link to detail page with member ID
        detailLink.textContent = `${member.name} (Class: ${member.class}, XP: ${member.xp}, Level: ${member.level}, Proficiency: +${member.bonus})`;
        li.appendChild(detailLink);

        // Create Add XP button
        const addXpBtn = document.createElement('button');
        addXpBtn.textContent = 'Add XP';
        addXpBtn.onclick = () => addXp(member.id);

        // Create Remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => removeMember(member.id, li);

        // Append buttons to the list item
        li.appendChild(addXpBtn);
        li.appendChild(removeBtn);
        partyList.appendChild(li);
    });
}

// Function to add a new party member
async function addMember(e) {
    e.preventDefault();  // This prevents the default form submission (page refresh)
    
    const name = document.getElementById('member-name').value.trim();
    const classType = document.getElementById('member-class').value.trim();
    const xp = document.getElementById('member-xp').value.trim();  // Get XP value (if applicable)
    const level = calculateLevel(xp);
    const bonus = xpThresholds[level-1].bonus

    if (name && classType) {
        // Generate new ID
        const newId = partyData.length ? Math.max(partyData.map(member => member.id)) + 1 : 1;

        // Add new member
        const newMember = {
            id: newId,
            name: name,
            class: classType,
            xp: xp || 0, // If XP is not provided, set it to 0
            level: level,
            bonus: bonus
        };
        partyData.push(newMember);
        await savePartyData(); // Save to JSONBlob

        // Re-display the updated list
        displayParty(partyData);

        // Clear input fields
        document.getElementById('member-name').value = '';
        document.getElementById('member-class').value = '';
        document.getElementById('member-xp').value = '';
    }
}

// Function to remove a party member
async function removeMember(id, element) {
    const confirmation = confirm('Are you sure you want to delete this member? This action cannot be undone.');
    if (confirmation) {
        partyData = partyData.filter(member => member.id !== id);
        await savePartyData();
        displayParty(partyData);
    }
}

// Function to add XP to a party member
async function addXp(id) {
    // Find the member by ID
    const member = partyData.find(member => member.id === id);
    if (member) {
        const xpToAdd = prompt(`How many XP to add to ${member.name}?`, "0");
        
        // Check if the input is a valid number
        if (!isNaN(xpToAdd) && xpToAdd !== null) {
            member.xp += parseInt(xpToAdd, 10); // Add XP
            member.level = calculateLevel(member.xp); // Recalculate level
            member.bonus = xpThresholds[member.level - 1].bonus; // Update bonus
            await savePartyData();
            displayParty(partyData); // Update the list
        } else {
            alert("Invalid XP value!");
        }
    }
}

// Function to calculate level based on XP
function calculateLevel(xp) {
    let level = 1;

    // Loop through the XP thresholds from lowest to highest
    for (let i = 0; i < xpThresholds.length; i++) {
        if (xp >= xpThresholds[i].xp) level = xpThresholds[i].level;
        else break; // Stop the loop once the correct level and bonus are found
    }

    return level;
}