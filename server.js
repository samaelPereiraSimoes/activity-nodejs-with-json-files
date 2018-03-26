var http = require('http'); //recurso do nod
var fs = require('fs'); //recurso para poder ler os arquivos

var server = http.createServer(function(request, response) {
	var page, objSales, objCatalog, objPurchases, valueSalesCatalog, valdateCatalog;
	
	page = 'index.html';
	
	if (request.url != '/') {

		objSales = JSON.parse(fs.readFileSync('public/sales.json', 'utf8'));
		objCatalog = JSON.parse(fs.readFileSync('public/catalog.json', 'utf8'));
		objPurchases = JSON.parse(fs.readFileSync('public/purchases.json', 'utf8'));

		valueSalesCatalog = salesCatalog(objSales, objCatalog);
		valdateCatalog = valCatalogDebCre(valueSalesCatalog);
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

function salesCatalog(objSales, objCatalog) {

	salesCatalog = [];
	objSales.map( function(sale) { //varrendo as vendas 
		sale.catalog = objCatalog.filter(function(catalog) { //após varrer vou pegar o produto			
			return sale.product_id === catalog.id.toString();
		});

		sale.qtproduto = sale.catalog.length; //pegando quantidade de produto

		if (sale.catalog[0] != "" && sale.catalog[0] != undefined) {

			sale.value = sale.qtproduto * parseFloat(sale.catalog[0].price);
			//console.log(parseFloat(sale.catalog[0].price) * sale.qtproduto);
		}	
		salesCatalog.push(sale);
	});

	return salesCatalog;
};

function valCatalogDebCre (valdateCatalog){
	var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	var dataByMonth = valdateCatalog.reduce(function(dataByMonth, datum){
		var date, day, month, year, value, group; 

		date = new Date(datum.timestamp);

		day = date.getDate(); // dia
		month = monthNames[date.getMonth()]; // mes
		year  = ('' + date.getFullYear()).slice(-2); // ano
		group =  day + '\'' + month + '\'' + year;

		value = datum.value;

		dataByMonth[group] = (dataByMonth[group] || 0) + value;

  		return dataByMonth;
	});	

	console.log(dataByMonth);

};

server.listen(3000);

/* 1º
	criar o metodo que retorna o produto pelo id e retorna ok
	nesse metodo criar um for para pegar o produto ok
	vou ter q varrer todas as vendas, e pra cada uma pegar o produto,
		preço,     
		calcular o total pela quantidade
	e após separar por datas
   2º

	criar um objeto vazio
	E para cada compra pegar o mes e adicionar nesse objeto pelo mes e somando os valores.

	fechamento do cartão de crédito é no dia 5 de cada mes
		- Parceka cai no dia 10 de cada mes
			exemplo comprei uma bola dia dia 05/10/2018 o pagamento ira cair			dia 10/10/2018.
			se a compra tivesse sido feita dia 04/10/2018 o pagamento iria cair 			dia 10/09
	validar se foi débito ou crédito
	crédito cai o pagamento no mesmo dia

*/