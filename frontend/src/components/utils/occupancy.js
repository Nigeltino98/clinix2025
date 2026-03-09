
export const occupancy = (home_id, resdents) => {
    const selected_residents = resdents.filter(item => item.home === home_id);

    if (selected_residents) {
        return `${selected_residents.length} `
    } else {
        return `0`
    }
}
