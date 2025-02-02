import puppeteer from 'puppeteer';

//const puppeteer = require('puppeteer');

//start puppeteer
puppeteer.launch({headless: false}).then(async browser => {

  //open a new page and navigate to URL
  const page = await browser.newPage();
  await page.goto('https://www.sneakerfiles.com/release-dates/'); //url
  await page.waitForSelector('.entry-content-wrap'); //class where targets are

  //accessing the page content 
  let products = await page.evaluate(() => {

    let allProducts = document.body.querySelectorAll('.entry-content-wrap .kt-blocks-post-grid-item-inner'); // shared class name of targets

    //storing the product itmes in array

    scrapeItems = [];
    allProducts.forEach(item => {

      let productTitle = item.querySelector('h3'); 
      let productDate = item.querySelector('p');
      //let productPrice = item.querySelector('.release-price');

      scrapeItems.push({
        productTitle: productTitle ? productTitle.innerText : null,
        productDate: productDate ? productDate.innerText : null,
        //productPrice: productPrice ? productPrice.innerText : null,
      });

    });

    let items = {
      relatedProducts: scrapeItems
    }

    return items;
  });

  //ouput scraped data
  console.log(products);
  //close the browser 
  await browser.close();
}).catch(function(e){
  console.log(e)
});