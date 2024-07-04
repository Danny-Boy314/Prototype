document.addEventListener('DOMContentLoaded', () => {
    const readButton = document.getElementById('readButton');
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    const screen3 = document.getElementById('screen3');

    readButton.addEventListener('click', () => {
        console.log('Read button clicked');
        screen1.classList.add('hidden');
        screen2.classList.remove('hidden');
        initiateNFC();
    });

    function initiateNFC() {
        if ('NDEFReader' in window) {
            console.log('NDEFReader is supported');
            const ndef = new NDEFReader();
            ndef.scan().then(() => {
                console.log("Scan started successfully.");
                ndef.onreading = event => {
                    console.log('NFC tag detected');
                    const decoder = new TextDecoder();
                    for (const record of event.message.records) {
                        const data = decoder.decode(record.data);
                        console.log(`Record type: ${record.recordType}`);
                        console.log(`MIME type: ${record.mediaType}`);
                        console.log(`=== data ===\n${data}`);
                        try {
                            const jsonData = JSON.parse(data);
                            displayData(jsonData);
                        } catch (error) {
                            console.log('Error parsing NFC data as JSON:', error);
                        }
                    }
                };
            }).catch(error => {
                console.log(`Error starting scan: ${error}`);
            });
        } else {
            console.log("NFC is not supported on this device.");
        }
    }

    function displayData(data) {
        console.log('Displaying data:', data);
        screen2.classList.add('hidden');
        screen3.classList.remove('hidden');

        document.getElementById('fullName').textContent = data.fullName || 'N/A';
        document.getElementById('dob').textContent = data.dob || 'N/A';
        document.getElementById('sex').textContent = data.sex || 'N/A';
        document.getElementById('medicalConditions').textContent = data.medicalConditions || 'N/A';
        document.getElementById('medications').textContent = data.medications || 'N/A';
        document.getElementById('allergies').textContent = data.allergies || 'N/A';
        document.getElementById('address').textContent = data.address || 'N/A';
        document.getElementById('contact').textContent = data.contact || 'N/A';
    }
});
