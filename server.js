var http = require('http'); //recurso do nod
var fs = require('fs'); //recurso para poder ler os arquivos

var server = http.createServer(function(request, response) {
	var page, objPurchases, objSales, objCatalog, salesCatalog;
	
	page = 'index.html';
	
	if (request.url != '/') {

		objSales = JSON.parse(fs.readFileSync('public/sales.json', 'utf8'));
		objCatalog = JSON.parse(fs.readFileSync('public/catalog.json', 'utf8'));
		objPurchases = JSON.parse(fs.readFileSync('public/purchases.json', 'utf8'));

		salesCatalog = [];
		objCatalog.map(function(catalog){
			catalog.sales = objSales.filter(function(sale){
				return catalog.id.toString() === sale.product_id;
			});

			//total sales
			catalog.qteSales = catalog.sales.length;
			//valor total
			catalog.valor = catalog.price.split(" ")[1] * catalog.qteSales;

			salesCatalog.push(catalog);
		});
		console.log(salesCatalog);
	}

	fs.readFile('./public/' + page, function(err, data) {
		var headStatus = 200;
	
		if (err) {
			headStatus = 404;
			page = fs.readFileSync('./error/404.html');
		}

		response.writeHead(headStatus, {'Content-type': 'text/html; charset=utf-8'});
		response.write(data);
		response.end();
	})
});

/*valCatalog = function(catalog) { // pegando o produto pelo id
	var idCatalog = [];

	for ( var i = 0, i < catalog.length, i++) {
		idCatalog.push(catalog.id);
	};

	return idCatalog;
};*/

server.listen(3000);