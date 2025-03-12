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

    if (member) {
        memberDetails.innerHTML = `
            <h2>${member.name}</h2>
            <p><strong>Class:</strong> ${member.class}</p>
            <p><strong>XP:</strong> ${member.xp}</p>
            <p><strong>Level:</strong> ${member.level}</p>
            <p><strong>Proficiency Bonus:</strong> +${member.bonus}</p>
        `;
    } else {
        memberDetails.innerHTML = '<p>Member not found.</p>';
    }
}

// Display details when the page loads
displayMemberDetails();