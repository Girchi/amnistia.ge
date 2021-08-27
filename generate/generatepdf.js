import { PDFDocument, degrees } from "pdf-lib";
import fetch from "node-fetch";
import * as fs from "fs";
import dotenv from "dotenv"

// --Generate PDFs--
(async () => {
  dotenv.config()

  const existingUsers = getExistingUsersCardNums();
  const PDFShouldBe = parseInt(existingUsers.length / 5)

  for(let i = 0; i < PDFShouldBe; i++){
  const unusedCards = getUnusedCardNums(existingUsers);

    if(unusedCards.length >= 5){
      let jpgUrl, jpgImageBytes, jpgImage, jpgDims;
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();

      // Add background
      jpgUrl = `${process.env.HOSTNAME}/generate/bg.jpg`;
      jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());
      jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
      jpgDims = jpgImage.scale(0.24);
      page.drawImage(jpgImage, {
        x: 0,
        y: page.getHeight() - jpgDims.height,
        width: jpgDims.width,
        height: jpgDims.height,
      });

      // Fill with user card images
      let positionY = page.getHeight() - 177.5;

      let pdfName = ''
      let currentStop = 5;
      for (let i = 0; i < currentStop; i++) {
        const frontPath = `./generate/card-imgs/${unusedCards[i]}-front.jpg`;
        const backPath = `./generate/card-imgs/${unusedCards[i]}-back.jpg`;
        if (fs.existsSync(frontPath) && fs.existsSync(backPath)) {
          // Card front side
          jpgUrl = `${process.env.HOSTNAME}/generate/card-imgs/${unusedCards[i]}-front.jpg`;
          jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());
          jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
          jpgDims = jpgImage.scale(0.405);
          page.drawImage(jpgImage, {
            x: 29,
            y: positionY,
            width: jpgDims.width + 2,
            height: jpgDims.height + 1,
          });

          // Card back side
          jpgUrl = `${process.env.HOSTNAME}/generate/card-imgs/${unusedCards[i]}-back.jpg`;
          jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());
          jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
          jpgDims = jpgImage.scale(0.405);
          page.drawImage(jpgImage, {
            x: 309.5,
            y: positionY,
            width: jpgDims.width + 2,
            height: jpgDims.height + 1,
          });

          // Y position changes when one image set
          positionY -= 162.5;

          pdfName = pdfName + '-' +  unusedCards[i];
        } else if(currentStop < unusedCards.length){
          console.log(`missing card image for ${unusedCards[i]}`)
          currentStop++
        }
      }

      pdfName = pdfName.replace('-','')

      const pdfBytes = await pdfDoc.save();

      // Saves into local folder
      fs.writeFileSync(`./generate/pdf/${pdfName}.pdf`, pdfBytes, (err) => { 
        if (err) throw err 
        console.log(`PDF ${pdfName} Created`)
      })
    } else {
      console.log("All pdf created based on provided images");
      console.log("There must be 5 unused clean set of images to fill pdf");
    }
  }
})();

function getExistingUsersCardNums() {
  const usersDatabase = fs.readdirSync("./database")
  let cardNumbers = []

  for(const userJSONName of usersDatabase){
    const userData = JSON.parse(fs.readFileSync(`./database/${userJSONName}`, 'utf8'));
    cardNumbers.push(userData.card_number);
  }

  cardNumbers.sort((a,b) => a - b)
  return cardNumbers
}

function getUnusedCardNums(existingUsers) {
  const PDFDirectory = fs.readdirSync("./generate/pdf")
  const alreadyInPDF = PDFDirectory.map(pdf => pdf.replace('.pdf', '').split('-'))
  let alreadyInPDFSep = []
  alreadyInPDF.forEach(pdf => pdf.forEach(inpdf => alreadyInPDFSep.push(inpdf)))

  let freeCards = []

  for(let i = 0; i < existingUsers.length; i++){
    const findItem = alreadyInPDFSep.find(value => value == existingUsers[i])
    if(!findItem){
      freeCards.push(existingUsers[i])
    }
  }
  console.log(freeCards)
  return freeCards;
}