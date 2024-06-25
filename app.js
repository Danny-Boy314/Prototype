document.getElementById('read-button').addEventListener('click', () => {
    document.getElementById('initial-screen').style.display = 'none';
    document.getElementById('scan-prompt').style.display = 'block';
});

document.getElementById('scan-button').addEventListener('click', async () => {
    if ('NDEFReader' in window) {
        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            ndef.onreading = async (event) => {
                const message = event.message;
                for (const record of message.records) {
                    if (record.recordType === 'url') {
                        const decoder = new TextDecoder();
                        const url = decoder.decode(record.data);
                        await fetchAndDisplayPatientInfo(url);
                        document.getElementById('scan-prompt').style.display = 'none';
                        document.getElementById('patient-info-screen').style.display = 'block';
                    }
                }
            };
        } catch (error) {
            console.error('Error reading NFC tag: ', error);
            alert('Failed to read NFC tag. Make sure your device supports NFC.');
        }
    } else {
        alert('NFC is not supported on this device.');
    }
});

async function fetchAndDisplayPatientInfo(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const patientName = data.name?.[0]?.given?.[0] + ' ' + data.name?.[0]?.family || 'N/A';
        const patientBirthdate = data.birthDate || 'N/A';
        const patientPhone = data.telecom?.find(t => t.system === 'phone')?.value || 'N/A';
        const patientGender = data.gender || 'N/A';
        const patientAddress = data.address?.[0] || {};

        const conditions = [
            patientAddress.line?.join(', ') || '',
            patientAddress.city || ''
        ].filter(line => line).join(', ');

        const medications = [
            patientAddress.state || '',
            patientAddress.postalCode || ''
        ].filter(line => line).join(', ');

        const district = patientAddress.district || 'N/A';
        const country = patientAddress.country || 'N/A';

        document.getElementById('patient-name').textContent = `Full Name: ${patientName}`;
        document.getElementById('patient-birthdate').textContent = `Date of Birth: ${patientBirthdate}`;
        document.getElementById('patient-gender').textContent = `Sex: ${patientGender}`;
        document.getElementById('conditions').textContent = `${conditions}`;
        document.getElementById('medications').textContent = `${medications}`;
        document.getElementById('allergies').textContent = `${country}`;
        document.getElementById('address').textContent = `${district}`;
        document.getElementById('patient-phone').textContent = `Contact: ${patientPhone}`;
        
        document.getElementById('patient-info').style.display = 'block';
    } catch (error) {
        console.error('Error fetching or parsing FHIR data: ', error);
        alert('Failed to fetch or parse FHIR data.');
    }
}
