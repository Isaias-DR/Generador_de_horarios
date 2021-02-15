let json_hojas = [];
var indexElegido;
var XL_row_object, json_object, json_object_parse, workbook;

class ExcelToJSON {
	constructor() {
		this.parseExcel = function (file) {

			var reader = new FileReader();

			reader.onload = function (e) {

				var data = e.target.result;
				workbook = XLSX.read(
					data,
					{ type: 'binary' }
				);

				// Recorrer las hojas del Excel
				workbook.SheetNames.forEach(function (sheetName) {

					// Guarda los nombres de las hojas
					json_hojas.push(sheetName);

					// Crear HTML del los radios
					document.getElementById("div_hojas").innerHTML = document.getElementById("div_hojas").innerHTML + "<input class='form-check-input' type='radio' id='hojas' name='hojas' value='"+sheetName+"' onchange='handleChange(event);' > <label class='form-check-label' for="+sheetName+">"+ sheetName+"</label><br>";
				});
				/* Listar las hojas del Excel
				*/
				console.log(json_hojas);
				//jQuery('#hojas').val(json_hojas);
			};

			reader.onerror = function (ex) {
				console.log(ex);
			};

			reader.readAsBinaryString(file);
		};
	}
}	

function handleChange(e){

	//console.log("Valor elegido " + e.currentTarget.value);	

	/* Tomar y guarda los datos de esa hoja elegida                       */
	XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[e.currentTarget.value]); // objeto
	json_object = JSON.stringify(XL_row_object); // texto - stringify combierte un objeto o valor a una cadena de texto
	json_object_parse = JSON.parse(json_object); // JSON - analiza una cadena de texto como JSON, transformando opcionalmente  el valor producido por el análisis.

	/* Listar contenido*/
	console.log(json_object_parse);
	//jQuery('#xlx_json').val(json_object_parse); // El json_object se demora paro cuendo esta adentro del forEach ahi no \(º_º)/
}

function filtar(){	

	/* Listar asignaturas
	var distinctAsignaturas = [...new Set(json_object_parse.map(x => x.Asignatura))];
	console.log(distinctAsignaturas);
	console.log(distinctAsignaturas[2]);
	jQuery('#asignaturas').val(distinctAsignaturas);
	*/

}

function handleFileSelect(evt) {
	
	var files = evt.target.files; // Lista de objetos de archivos
	var xl2json = new ExcelToJSON();
	xl2json.parseExcel(files[0]);
}