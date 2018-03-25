var http = require('http'); //recurso do nod
var fs = require('fs'); //recurso para poder ler os arquivos

var server = http.createServer(function(request, response) {
	var page, objPurchases, objSales, objCatalog, valueSalesCatalog;
	
	page = 'index.html';
	
	if (request.url != '/') {

		objSales = JSON.parse(fs.readFileSync('public/sales.json', 'utf8'));
		objCatalog = JSON.parse(fs.readFileSync('public/catalog.json', 'utf8'));
		objPurchases = JSON.parse(fs.readFileSync('public/purchases.json', 'utf8'));

		var valueSalesCatalog = salesCatalog(objSales, objCatalog)
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

function salesCatalog (objSales, objCatalog) {

	salesCatalog = [];
	objSales.map( function(sale) { //varrendo as vendas 
		sale.catalog = objCatalog.filter(function(catalog){  // após varrer vou pegar o produto
			return sale.product_id === catalog.id.toString();
		});

		sale.qtproduto = sale.catalog.length; // pegando quantidade de produto
		sale.total = parseInt(sale.price) * sale.qtproduto; // calculando o total pela quantidade
	
		salesCatalog.push(sale);
	});

	console.log(salesCatalog);
	return salesCatalog;
}

server.listen(3000);

/*
	criar o metodo que retorna o produto pelo id e retorna ok
		nesse metodo criar um for para pegar o produto ok
		vou ter q varrer todas as vendas, e pra cada uma pegar o produto,
			preço, 
			calcular o total pela quantidade
		e após separar por datas
*/