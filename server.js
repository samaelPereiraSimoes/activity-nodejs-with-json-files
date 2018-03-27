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
		
		console.log(valdateCatalog);
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

	var teste;
	objSales.map( function(sale) { //varrendo as vendas 
		sale.catalog = objCatalog.filter(function(catalog) { //após varrer vou pegar o produto			
			return sale.product_id === catalog.id.toString();
		});

		salesCatalog.push(sale);
	});

	return salesCatalog;
};

function valCatalogDebCre (valdateCatalog){
	var dataByMonth = valdateCatalog.reduce(function(dataByMonth, datum){
		var date, day, month, year, group, value, hashSaleCatalog; 

		date = new Date(datum.timestamp);
		day = date.getDate(); // dia

		if(date.getMonth() < 10 && date.getMonth()) {
			month = date.getMonth() + 1;
		} else if(date.getMonth() > 10 && date.getMonth() != undefined) {
			month = date.getMonth() + 1;
		}

		year  = ('' + date.getFullYear()).slice(-2); // ano
		
		if(month != undefined) {	
			group =  day + '-' + month + '-' + year;
		}

		if(datum.catalog[0] != "" && datum.catalog[0] != undefined) {	
			value = parseFloat(datum.catalog[0].price);
		}
		
		dataByMonth[group] = (dataByMonth[group] || 0) + value;
  		return dataByMonth;
	},{});	

	hashSaleCatalog = Object.keys(dataByMonth).map(function(group){
	  return { name: group, value: dataByMonth[group] };
	});

	return hashSaleCatalog;
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
			exemplo comprei uma bola dia dia 05/10/2018 o pagamento ira cair			dia 10/11/2018.
			se a compra tivesse sido feita dia 04/10/2018 o pagamento iria cair 			dia 10/10
	validar se foi débito ou crédito
	crédito cai o pagamento no mesmo dia

*/