document.addEventListener('DOMContentLoaded', () => {
    const readButton = document.getElementById('readButton');
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    const screen3 = document.getElementById('screen3');

    readButton.addEventListener('click', () => {
        screen1.classList.add('hidden');
        screen2.classList.remove('hidden');
        initiateNFC();
    });

    function initiateNFC() {
        if ('NDEFReader' in window) {
            const ndef = new NDEFReader();
            ndef.scan().then(() => {
                console.log("Scan started successfully.");
                ndef.onreading = event => {
                    const decoder = new TextDecoder();
                    for (const record of event.message.records) {
                        console.log(`Record type: ${record.recordType}`);
                        console.log(`MIME type: ${record.mediaType}`);
                        console.log(`=== data ===\n${decoder.decode(record.data)}`);
                        populateFields(JSON.parse(decoder.decode(record.data)));
                    }
                }
            }).catch(error => {
                console.log(`Error: ${error}`);
            });
        } else {
            console.log("NFC is not supported on this device.");
        }
    }

    function populateFields(data) {
        document.getElementById('fullName').textContent = data.fullName;
        document.getElementById('dob').textContent = data.dob;
        document.getElementById('sex').textContent = data.sex;
        document.getElementById('medicalConditions').textContent = data.medicalConditions;
        document.getElementById('medications').textContent = data.medications;
        document.getElementById('allergies').textContent = data.allergies;
        document.getElementById('address').textContent = data.address;
        document.getElementById('contact').textContent = data.contact;

        screen2.classList.add('hidden');
        screen3.classList.remove('hidden');
    }
});
