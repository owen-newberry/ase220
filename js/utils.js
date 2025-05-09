const token = localStorage.getItem('jwt');
const baseUrl = 'http://localhost:5000/api/partyMember';

let partyData = [];

export const xpThresholds = [
    { xp: 0, level: 1 },
    { xp: 300, level: 2 },
    { xp: 900, level: 3 },
    { xp: 2700, level: 4 },
    { xp: 6500, level: 5 },
    { xp: 14000, level: 6 },
    { xp: 23000, level: 7 },
    { xp: 34000, level: 8 },
    { xp: 48000, level: 9 },
    { xp: 64000, level: 10 },
    { xp: 85000, level: 11 },
    { xp: 100000, level: 12 },
    { xp: 120000, level: 13 },
    { xp: 140000, level: 14 },
    { xp: 165000, level: 15 },
    { xp: 195000, level: 16 },
    { xp: 225000, level: 17 },
    { xp: 265000, level: 18 },
    { xp: 305000, level: 19 },
    { xp: 355000, level: 20 },
];

export function calculateLevel(xp) {
    let level = 1;

    for (let i = 0; i < xpThresholds.length; i++) {
        if (xp >= xpThresholds[i].xp) level = xpThresholds[i].level;
        else break;
    }

    return level;
}

export async function fetchPartyData(campaignId) {
    try {
        const response = await fetch(`${baseUrl}/${campaignId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch party data');

        const data = await response.json();
        partyData = data.data.partyMembers;
        return partyData;
    } catch (error) {
        console.error('Error fetching party data:', error);
    }
}

export async function savePartyData(newPartyMember, campaignId) {
    try {
        const response = await fetch(`${baseUrl}/${campaignId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newPartyMember),
        });

        if (!response.ok) throw new Error('Failed to save new party member');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving party data:', error);
    }
}

export async function updatePartyMember(id, updatedData) {
    try {
        const response = await fetch(`${baseUrl}/id/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error('Failed to update party member');

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating party member:', error);
    }
}

export async function deletePartyMember(id) {
    try {
        const response = await fetch(`${baseUrl}/id/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) throw new Error('Failed to delete party member');
    } catch (error) {
        console.error('Error deleting party member:', error);
    }
}

export async function getPartyMemberById(id) {
    try {
        const response = await fetch(`${baseUrl}/id/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) throw new Error('Failed to fetch party member data');

        const data = await response.json();
        const member = data.data.partyMember
        return member;
    } catch (error) {
        console.error('Error fetching party member data:', error);
    }
}

export async function getCurrentItems(id) {
    const member = await getMemberById(id);
    const items = member.items;

    return items;
}

export async function loadAllItems() {
    const response = await fetch('../data/items.json');
    const items = await response.json();

    return {
        armor: items.filter(item => item.properties?.["Item Type"] === "Armor"),
        weapons: items.filter(item => item.properties?.["Item Type"] === "Weapon"),
        misc: items.filter(item =>
            !["Armor", "Weapon"].includes(item.properties?.["Item Type"])
        )
    };
}