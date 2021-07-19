import { PDFDocument } from "pdf-lib";
import fs from "fs";
import fetch from "node-fetch";
import * as fss from "fs";

const hostname = "http://127.0.0.1:3000";

// --Generate PDFs--
async function embedImages() {
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

  let imgCounter = fss.readdirSync("generate/card-imgs").length;
  let pdfCounter = fss.readdirSync("generate/pdf").length;
  let PDFShouldBe = parseInt(imgCounter / 10);
  let imgToContinue = pdfCounter * 5;

  if (PDFShouldBe > pdfCounter) {
    for (let i = imgToContinue; i < imgToContinue + 5; i++) {
      // Card back side
      jpgUrl = `${hostname}/generate/card-imgs/${i}-front.jpg`;
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
      jpgUrl = `${hostname}/generate/card-imgs/${i}-back.jpg`;
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
    }

    const pdfBytes = await pdfDoc.save();
    console.log("After Save");

    var callback = (err) => {
      if (err) throw err;
      console.log("It's saved!");
    };

    // Saves into local folder
    fs.writeFile(`./generate/pdf/${pdfCounter}.pdf`, pdfBytes, callback);
  } else {
    console.log("All pdf created based on provided images");
    console.log("There must be 5 unused image to set in pdf");
  }
}

embedImages();
