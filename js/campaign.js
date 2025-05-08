const token = localStorage.getItem('jwt');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('campaign-form');
    const errorMsg = document.getElementById('error-msg');
    const createCampaignBtn = document.getElementById('create-campaign-btn');
    const createCampaignModal = new bootstrap.Modal(document.getElementById('createCampaignModal'));
    const campaignList = document.getElementById('campaign-list');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('campaign-name').value;
        const description = document.getElementById('campaign-description').value;

        const payload = {
            name,
            description
        };

        try {
            const response = await fetch('http://localhost:5000/api/campaigns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                document.activeElement.blur();
                createCampaignModal.hide();
                displayCampaign(data.data.campaign);
                alert('Campaign created successfully!');
            } else {
                const errorData = await response.json();
                errorMsg.textContent = errorData.message || 'Failed to create campaign';
            }
        } catch (err) {
            errorMsg.textContent = 'Server error. Please try again later.';
            console.error(err);
        }
    });

    async function loadCampaigns() {
        try {
            const response = await fetch('http://localhost:5000/api/campaigns', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.status === 'success') {
                data.data.campaigns.forEach(campaign => {
                    displayCampaign(campaign);
                });
            }
        } catch (err) {
            console.error('Error loading campaigns:', err);
        }
    }

function displayCampaign(campaign) {
    const campaignElement = document.createElement('div');
    campaignElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    const campaignName = document.createElement('a');
    campaignName.href = `../party/index.html?campaignId=${campaign._id}`;
    campaignName.textContent = campaign.name;
    campaignName.classList.add('me-auto');
    campaignElement.id = campaign._id;

    const removeButton = document.createElement('button');
    removeButton.classList.add('btn', 'btn-danger');
    removeButton.textContent = 'Delete';
    removeButton.addEventListener('click', () => {
        removeCampaign(campaign._id);
    });

    campaignElement.appendChild(campaignName);
    campaignElement.appendChild(removeButton);
    campaignList.appendChild(campaignElement);
}

async function removeCampaign(campaignId) {
    try {
        const response = await fetch(`http://localhost:5000/api/campaigns/${campaignId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert('Campaign removed successfully!');
            const campaignElement = document.getElementById(campaignId);
            if (campaignElement) {
                campaignElement.remove();
            }
        } else {
            alert('Failed to remove campaign');
        }
    } catch (err) {
        console.error('Error removing campaign:', err);
    }
}



    createCampaignBtn.addEventListener('click', () => {
        createCampaignModal.show();
    });

    loadCampaigns();
});

