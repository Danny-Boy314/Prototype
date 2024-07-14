document.getElementById('scan-button').addEventListener('click', async () => {
    if ('NDEFReader' in window) {
        try {
            // Switch to the second image
            document.getElementById('scan-image1').style.display = 'none';
            document.getElementById('scan-image2').style.display = 'block';

            const ndef = new NDEFReader();
            await ndef.scan();
            ndef.onreading = async (event) => {
                const message = event.message;
                for (const record of message.records) {
                    if (record.recordType === 'url') {
                        const decoder = new TextDecoder();
                        const url = decoder.decode(record.data);
                        await fetchAndDisplayPatientInfo(url);
                        
                        // Hide the scan images and show patient info
                        document.getElementById('scan-container').style.display = 'none';
                        document.getElementById('patient-info').style.display = 'block';
                    }
                }
            };
        } catch (error) {
            console.error('Error reading NFC tag: ', error);
            alert('Failed to read NFC tag. Make sure your device supports NFC.');
            
            // Revert to the first image on error
            document.getElementById('scan-image1').style.display = 'block';
            document.getElementById('scan-image2').style.display = 'none';
        }
    } else {
        alert('NFC is not supported on this device.');
    }
});

async function fetchAndDisplayPatientInfo(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const patientName = (data.name?.[0]?.given?.join(' ') + ' ' + data.name?.[0]?.family) || 'N/A';
        const patientBirthdate = data.birthDate || 'N/A';
        const patientPhone = data.telecom?.find(t => t.system === 'phone')?.value || 'N/A';
        const patientGender = data.gender || 'N/A';

        const patientAddress = data.address?.[0] || {};
        const conditions = patientAddress.line?.join(', ') || 'N/A';
        const medications = patientAddress.state || 'N/A';
        const allergies = patientAddress.country || 'N/A';
        const address = patientAddress.district || 'N/A';

        document.getElementById('patient-name').textContent = `Name: ${patientName}`;
        document.getElementById('patient-birthdate').textContent = `Birthdate: ${patientBirthdate}`;
        document.getElementById('patient-phone').textContent = `Phone: ${patientPhone}`;
        document.getElementById('patient-gender').textContent = `Gender: ${patientGender}`;
        document.getElementById('conditions').textContent = `Conditions: ${conditions}`;
        document.getElementById('medications').textContent = `Medications: ${medications}`;
        document.getElementById('address').textContent = `Address: ${address}`;
        document.getElementById('allergies').textContent = `Allergies: ${allergies}`;
        
        document.getElementById('patient-info').style.display = 'block';
    } catch (error) {
        console.error('Error fetching or parsing FHIR data: ', error);
        alert('Failed to fetch or parse FHIR data.');
    }
}
