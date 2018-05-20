# Yield.IO

[Yield.IO](https://yield.io) is a React/Redux/Chartjs/AWS Lambda example app which displays US Treasury bond yield charts and updates them daily. The data is retrieved from the [US Treasury web site](https://www.treasury.gov/resource-center/data-chart-center/interest-rates/Pages/TextView.aspx?data=yield).

The AWS lambda backend updates a [Twitter feed](https://twitter.com/yieldio) when new results are available.

To build and run the client execute the following:

```sh
cd client
npm install
npm start
 ```

