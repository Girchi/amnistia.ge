import { PDFDocument } from "pdf-lib";
import fetch from "node-fetch";
import * as fs from "fs";

const hostname = "http://127.0.0.1:3000";

// optional custom name for PDF
const custom = ''; 

// --Generate PDFs--
(async () => {
  let cardsDir = fs.readdirSync("generate/card-imgs");
  let PDFShouldBe = parseInt(cardsDir.length / 10);

  for (let pdfCount = 0; pdfCount < PDFShouldBe; pdfCount++) {
    const PDFPath = `./generate/pdf/${custom}${pdfCount}.pdf`;
    if (!fs.existsSync(PDFPath)) {
      let jpgUrl, jpgImageBytes, jpgImage, jpgDims;
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();

      // Add background
      jpgUrl = `${hostname}/generate/bg.jpg`;
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
      let positionY = page.getHeight() - 177;

      let imgToContinue = pdfCount * 10;
      let front = imgToContinue;
      let back = imgToContinue + 1;

      for (let i = imgToContinue; i < imgToContinue + 5; i++) {

        // Card back side
        jpgUrl = `${hostname}/generate/card-imgs/${cardsDir[back]}`;
        jpgImageBytes = await fetch(jpgUrl).then((res) => res.arrayBuffer());
        jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
        jpgDims = jpgImage.scale(0.405);
        page.drawImage(jpgImage, {
          x: 29,
          y: positionY,
          width: jpgDims.width + 2,
          height: jpgDims.height + 1,
        });

        // Card front side
        jpgUrl = `${hostname}/generate/card-imgs/${cardsDir[front]}`;
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
        front+=2;
        back+=2;
      }

      const pdfBytes = await pdfDoc.save();
      console.log("After Save");

      var callback = (err) => {
        if (err) throw err;
        console.log("It's saved!");
      };

      // Saves into local folder
      fs.writeFile(`./generate/pdf/${custom}${pdfCount}.pdf`, pdfBytes, callback);
    }
  }

  // Else
  console.log("All pdf created based on provided images");
  console.log("There must be 5 unused clean set of images to fill pdf");
})();
