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
                        console.log(`Record type: ${record.recordType}`);
                        console.log(`MIME type: ${record.mediaType}`);
                        console.log(`=== data ===\n${decoder.decode(record.data)}`);
                    }
                }
            }).catch(error => {
                console.log(`Error starting scan: ${error}`);
            });
        } else {
            console.log("NFC is not supported on this device.");
        }
    }
});
