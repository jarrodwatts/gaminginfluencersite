export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const convertDate = (date) => {
    return new Date(date * 1000).toLocaleDateString();
}

export const displayRegion = (region) => {
    const mapper = {
        "africa": "Africa",
        "asia": "Asia",
        "europe": "Europe",
        "northAmerica": "North America",
        "oceania": "Oceania",
        "southAmerica": "South America",
        "other": "Other",
    }
    return (mapper[region])
}