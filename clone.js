import puppeteer from 'puppeteer';
import * as fs from 'node:fs';
import {createObjectCsvWriter} from 'csv-writer';
const csvWriter = createObjectCsvWriter({
  path:'results.csv',
  header: [
    {id: 'productTitle', title: 'NAME'},
    {id: 'productDate', title: 'RELEASE-DATE'},
    {id: 'productPrice', title: 'PRICE'}
  ]
});



//start puppeteer

puppeteer.launch({headless: false}).then(async browser => {

  //open a new page and navigate to URL
  const page = await browser.newPage();
  const page2 = await browser.newPage();
  //await page2.goto('https://www.sneakerfiles.com/release-dates/');
  await page.goto('https://sneakernews.com/release-dates/'); //url
  await page.click('.load-more-button',{waitUntil: 'load'}); //click more releases button
  
  //await page.click('.load-more-button', {waitUntil: 'load'}); //click more releases button 
  await page.waitForSelector('.release-post-list'); //class where targets are

  //accessing the page content 
  let products = await page.evaluate(() => {

    let allProducts = document.body.querySelectorAll('.release-post-list .releases-box'); // shared class name of targets

    //storing the product itmes in array

    scrapeItems = [];
    allProducts.forEach(item => {

      let productTitle = item.querySelector('h2'); 
      let productDate = item.querySelector('.release-date');
      let productPrice = item.querySelector('.release-price');

      scrapeItems.push({
        productTitle: productTitle ? productTitle.innerText : null,
        productDate: productDate ? productDate.innerText : null,
        productPrice: productPrice ? productPrice.innerText : null,

       
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