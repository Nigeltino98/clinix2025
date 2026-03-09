export const selectedResident = (resident_id, residents) => {
    const selected = residents.find(item => item.national_id === resident_id);
    if (selected) {
        return `${selected.first_name}  ${selected.last_name}`

    } else {
        return `..... `
    }
}

export const selectedHome = (home_id, homes) => {
    const selected = homes.find(item => item.id === home_id);
    if (selected) {
        return `${selected.name} `
    } else {
        return `..... `

    }
}
export const selectedStaff = (staff_id, staff) => {
    const selected = staff.find(item => item.id === staff_id);
    if (selected) {
        if (selected.first_name && selected.last_name) {
            return `${selected.first_name}  ${selected.last_name}`
        } else {
            return `${selected.email}  `
        }
    } else {
        return `..... `
    }
}


export const selectedFamily = (family_id, family) => {
    const selected = family.find(item => item.id === family_id);
    if (selected) {
        if (selected.first_name && selected.last_name) {
            return `${selected.first_name}  ${selected.last_name}`
        } else {
            return `${selected.email}  `
        }
    } else {
        return `..... `
    }
}




export const addEmojis = (emotion) => {
    let clean_emotion = "❓ Unknown Emotion"
    switch (emotion) {
        case 'unknown':
            clean_emotion = "❓ Unknown"
            break;

//adding the new emojis

        case 'happy':
            clean_emotion = "😃 Happy"
            break;

        case 'joyful':
            clean_emotion = "😊 Joyful"
            break;

        case 'sad':
            clean_emotion = "😔 Sad"
            break;

        case 'content':
            clean_emotion = "🙂 Content"
            break;

        case 'worried':
            clean_emotion = "😟 Worried"
            break;

        case 'fearful':
            clean_emotion = "😨 Fearful"
            break;

        case 'sleepy':
            clean_emotion = "🥱 Sleepy"
            break;

		case 'confused':
            clean_emotion = "😕 Confused"
            break;

        case 'tearful':
            clean_emotion = "😢 Tearful"
            break;

        case 'angry':
            clean_emotion = "😡 Angry"
            break;

        case 'annoyed':
            clean_emotion = "🙄 Annoyed"
            break;

        case 'sleeping':
            clean_emotion = "😴 Sleeping"
            break;

        default:
    }
    return clean_emotion
}