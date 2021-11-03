# Amazon-Price-Checker-GUI

This desktop application automates the process of checking the price of items on Amazon by Web Scraping. The app was build using ElectronJS and was designed using normal CSS. 

---
## Features

This desktop application is compatable with almost every OS as the app has been developed using ElectronJS. The app was tested in Windows and Ubuntu but not on MacOS.

The app checks the price every 10 minutes. You can change the time by going to `/app/assets/renderer.js` and change the number of milliseconds on line number 120. 

The application does not use any DB connections, but adopts Web Storage API to save the data locally. You can delete an item by clicking to the button next to it.

Note: You have to open the app manually every time it is closed.

---
## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environement. A connection to the internet is mandatory to fetch the Amazon item page.

### Node
- #### Node installation on Windows

  Instructions can be found on the [official Node.js website](https://nodejs.org/) and download the installer.

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v16.13.0

    $ npm --version
    6.14.13

To update npm, you can run the following command.

    $ npm install npm -g

To update node, you can visit [official Node.js website](https://nodejs.org/).


---

## Install

    $ git clone https://github.com/Ghaith-Chrit/Amazon-Price-Checker-GUI
    $ cd Amazon-Price-Checker-GUI
    $ npm install

## Running the project

    $ npm start

## To bundle the electron app

  Follow the instructions provided [here](https://github.com/electron/electron-packager).
