var ExcelToJSON = function() {

	this.parseExcel = function(file) {

		var reader = new FileReader();

		let json_hojas = [];

		reader.onload = function(e) {

			var data = e.target.result;
			var workbook = XLSX.read(data, {
				type: 'binary'
			});

			// Recorrer las hojas del Excel
			workbook.SheetNames.forEach(function(sheetName) {

				// Guarda los nombres de las hojas
				json_hojas.push(sheetName);

				// Guarda los datos de esa hoha
				var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
				
				var json_object = JSON.stringify(XL_row_object); // stringify combierte un objeto o valor a una cadena de texto
				var json_object_parse = JSON.parse(json_object); // analiza una cadena de texto como JSON, transformando opcionalmente  el valor producido por el análisis.
				console.log(json_object_parse);
				jQuery( '#xlx_json' ).val( json_object );
				//jQuery( '#xlx_json' ).val( XL_row_object );
			

				// Listar asignaturas
				const distinctAsignaturas = [...new Set(json_object_parse.map(x => x.Asignatura))]
				//jQuery( '#asignaturas' ).val( json_asignaturas );               
			})

			// Listar las hojas del Excel
			console.log(json_hojas);
			jQuery( '#hojas' ).val( json_hojas );
		};

		reader.onerror = function(ex) {
			console.log(ex);
		};

		reader.readAsBinaryString(file);
	};
};


function handleFileSelect(evt) {
	
	var files = evt.target.files; // Lista de objetos de archivos
	var xl2json = new ExcelToJSON();
	xl2json.parseExcel(files[0]);
}