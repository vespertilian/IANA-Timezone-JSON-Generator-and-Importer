export function isValidZoneTabRow(row: string[]) {
    // A valid row looks like:
    // [ 'AU', '-3157+14127', 'Australia/Broken_Hill', 'New South Wales (Yancowinna)' ],
    // OR
    // ['GB,GG,IM,JE', '+513030-0000731', 'Europe/London']

    const countryCodeValid = /^[A-Z]{2}$/.test(row[0].split(',')[0]);
    return countryCodeValid
}
