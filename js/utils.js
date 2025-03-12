let partyData = [];

export const blobUrl = 'https://api.jsonbin.io/v3/b/67d119af8960c979a56fee3c'

const xpThresholds = [
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

export async function fetchPartyData() {
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
        return partyData;
    } catch (error) {
        console.error('Error fetching party data:', error);
    }
}

export async function savePartyData() {
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