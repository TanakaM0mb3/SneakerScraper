import puppeteer from 'puppeteer';
import * as fs from 'node:fs';
import {createObjectCsvWriter} from 'csv-writer';
const csvWriter = createObjectCsvWriter({
  path:'results2.csv',
  header: [
    {id: 'productTitle', title: 'NAME'},
    {id: 'productDate', title: 'RELEASE-DATE'},
    //{id: 'productPrice', title: 'PRICE'},
    {id: 'productImg', title: 'IMAGE'}
  ]
});

//start puppeteer
puppeteer.launch({headless: false}).then(async browser => {

  //open a new page and navigate to URL
  const page = await browser.newPage();
  await page.goto('https://www.sneakerfiles.com/release-dates/'); //url
  await page.waitForSelector('.entry-content-wrap'); //class where targets are

  //accessing the page content 
  let products = await page.evaluate(() => {

    let allProducts = document.body.querySelectorAll('.entry-content-wrap .kt-blocks-post-grid-item'); // shared class name of targets

    //storing the product itmes in array

    scrapeItems = [];
    allProducts.forEach(item => {

      let productTitle = item.querySelector('.entry-title'); 
      let productDate = item.querySelector('.release-date');
      let productImg = item.querySelector('.kadence-post-image-inner-intrisic img');
      

      scrapeItems.push({
        productTitle: productTitle ? productTitle.innerText : null,
        productDate: productDate ? productDate.innerText : null,
        productImg: productImg ? productImg.getAttribute('src') : null,
        
      });

    });

    let items = {
      relatedProducts: scrapeItems
    }

    return items;
  });

  //convert scraped data into a csv
  csvWriter.writeRecords(products.relatedProducts).then(() => {console.log('...DONE');});

  //ouput scraped data
  console.log(products);
  //close the browser 
  await browser.close();
}).catch(function(e){
  console.log(e)
});