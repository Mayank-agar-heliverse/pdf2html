import fs from 'fs';
import {PDFDocument} from 'pdf-lib';
import pdftohtml from "@dsardar099/pdf-to-html";
import express from 'express'
import cors from 'cors'

const app=express()
app.use(cors())

async function convertPDFtohtml(filename)
{
  try
  {
    const converter = new pdftohtml(`${filename}.pdf`, `${filename}.html`);
    await converter.convert("ipad")
    converter.disablePrinting()
  }
  catch(e)
  {
    console.error("Conversion error: " + e);
  }
}

async function splitPdf(url)
{
  const docmentAsBytes = await fetch(url).then(res => res.arrayBuffer())
  // Load your PDFDocument
  const pdfDoc = await PDFDocument.load(docmentAsBytes)
  const numberOfPages = pdfDoc.getPages().length;
  console.log('pages: '+numberOfPages);
  for (let i = 0; i < 1; i++)
  {
    // Create a new "sub" document
    const subDocument = await PDFDocument.create();
    // copy the page at current index
    const [copiedPage] = await subDocument.copyPages(pdfDoc, [i])
    subDocument.addPage(copiedPage);
    const pdfBytes = await subDocument.save()
    // ensure `foldername` directory exists
    const filename=`file-${i + 1}`, folderPath='/tmp';
    await fs.promises.writeFile(`${folderPath}/${filename}.pdf`, pdfBytes);
    await convertPDFtohtml(`${folderPath}/${filename}`);
    // .outline file maybe created as a residue
    if(fs.existsSync(`./${filename}.outline`)) await fs.promises.unlink(`${filename}.outline`)
    // remove page pdf
    await fs.promises.unlink(`./tmp/${filename}.pdf`)
    // remove html after saving to s3
    // await fs.promises.unlink(`${foldername}/${filename}.hmtl`)
  }
}

const url='https://monoskop.org/images/d/de/An_Encyclopedia_of_Everything_2014.pdf'

const port=process.env.PORT||4000

app.get('/',(_,res)=>
{
  res.send('ec2 hi!')
})

app.get('/:url',async(req,res)=>
{
  const {url}=req.params
  console.log(url);
  await splitPdf(url)
  res.send('ok')
})

app.listen(port,()=>console.log('app listening on port '+port))