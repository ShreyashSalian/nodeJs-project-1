const path = require('path');
var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
var day = currentDate.getDate()
//var month = currentDate.getMonth() + 1
var year = currentDate.getFullYear()
var month = String(currentDate.getMonth()+1).padStart(2,'0');
var searchDate = `${year}-${month}-${day}`;
const buildPaths = {
    buildPathHtml: path.resolve('./sendingFile/'+searchDate+'.html'),
    buildPathPdf: path.resolve('./sendingFile/'+searchDate+'.pdf')
 };
module.exports = buildPaths