var http = require('http'); //recurso do nod
var fs = require('fs'); //recurso para poder ler os arquivos

var server = http.createServer(function(request, response) {
	var page, objPurchases, objSales, objCatalog, valueSalesCatalog;
	
	page = 'index.html';
	
	if (request.url != '/') {

		objSales = JSON.parse(fs.readFileSync('public/sales.json', 'utf8'));
		objCatalog = JSON.parse(fs.readFileSync('public/catalog.json', 'utf8'));
		objPurchases = JSON.parse(fs.readFileSync('public/purchases.json', 'utf8'));

		var valueSalesCatalog = salesCatalog(objSales, objCatalog);
console.log(valueSalesCatalog); 	
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
		sale.catalog = objCatalog.filter(function(catalog){ //após varrer vou pegar o produto
			
			return sale.product_id === catalog.id.toString();
		});

		sale.qtproduto = sale.catalog.length; //pegando quantidade de produto
		
		if (sale.catalog[0] != "" && sale.catalog[0] != undefined) {

			sale.total = parseFloat(sale.catalog[0].price) * sale.qtproduto
		}	
		salesCatalog.push(sale);
		
	});

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


/*

 logica da data
Data de fechamento do cartão de credito é: dia 5 de cada mes
Parcela cai dia 10
se uma compra foi feito o pagamento dia 05 9 2017 primeira parcela cai dia 10 10 2017
se tivesse sido dia 04 09 2017 cairia dia 10 09 2017.

vou pegar o dia e o mes separado validar e nisso salvar td em um array separado

var data = new Date('2017-12-14 21:39:39');
var dia = data.getDate();
var mes = data.getMonth() + 1;
var ano = data.getFullYear();

*/