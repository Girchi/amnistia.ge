// Generate User Information

/* ========== Qr Code ========== */

const qrdata = document.getElementById("qr-data")
const take = document.getElementById("take")
const cardQrCodes = document.getElementsByClassName('card-qrcode')

for(let i = 0; i < cardQrCodes.length; i++){
    let cardqrcode = new QRCode(cardQrCodes[i], {
        text: "https://legalize.ge/", //this generates code
        // width: 130,
        // height: 130,
        colorDark : "#000",
        colorLight : "transparent",
        correctLevel : QRCode.CorrectLevel.H
    });
}

let qrcode = new QRCode(document.getElementById("qrcode"), {
text: "https://legalize.ge/", //this generates code
// width: 130,
// height: 130,
colorDark : "#0e6a38",
colorLight : "transparent",
correctLevel : QRCode.CorrectLevel.H
});

const generateQR = () => {
    let data = qrdata.value
    qrcode.makeCode(data)
}
