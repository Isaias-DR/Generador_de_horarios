let arr_columns_name = ["Año", "Período", "Sede", "Escuela", "Carrera", "Plan", "Tipo Plan de Estudios", "Jornada", "Nivel", "Tipo Asignatura", "Sigla", "Asignatura", "Asignatura programada", "Sección", "Créditos", "Horario", "Sala", "Docente", "Día"];
let columns_name, columns_name_selected, distinctWorkingDay, distinctCourse, distinctSemester, distinctAsignaturas;
var stringWorkingDay, stringCourse, stringNivel, stringSubjets;
var XL_row_object, json_object, json_object_parse, json_object_parse2, workbook, index_name_subjet;


function handleFileSelect(evt) {

	var files = evt.target.files; // Lista de objetos de archivos
	var xl2json = new ExcelToJSON();
	xl2json.parseExcel(files[0]);
}

class ExcelToJSON {
	constructor() {
		this.parseExcel = function (file) {

			var reader = new FileReader();

			reader.onload = function (e) {

				var data = e.target.result;
				workbook = XLSX.read(data, { type: 'binary' });

				// Recorrer las hojas del Excel
				document.getElementById("div_leaves").innerHTML = "";
				workbook.SheetNames.forEach(function (sheetName) {

					document.getElementById("div_leaves").innerHTML = document.getElementById("div_leaves").innerHTML +
						"<div class='form-check'><input class='form-check-input' type='radio' id='hojas' name='hojas' value='" + sheetName + "' onchange='handleChange(event);' >" +
						"<label class='form-check-label' for='" + sheetName + "'>" + sheetName + "</label></div>";
				});
			};

			reader.onerror = function (ex) {

				console.log(ex);
			};

			reader.readAsBinaryString(file);
		};
	}
}

function handleChange(e) {

	// Tomar y guarda todos los datos de esa hoja elegida
	XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[e.currentTarget.value]); // objeto
	json_object = JSON.stringify(XL_row_object); // texto - stringify combierte un objeto o valor a una cadena de texto
	json_object_parse = JSON.parse(json_object); // JSON - analiza una cadena de texto como JSON, transformando opcionalmente  el valor producido por el análisis.
	
	//showSelections();
	showWorkingDay();
	showCareer();
	showSemester();
	showSubject();
}

function showSelections() {

	// Lista nombre de las columnas registradas en el código
	document.getElementById("div_columns_name").innerHTML = 
		"<label for='' class='form-label'>Sección y Horario</label>"+
		"<select class='form-select' id='selection'><option value='0'>Seleccione...</option><option value='1'>unificado</option><option value='2'>duplicado</option></select>"+
		"<div class='p-2'><button class='btn btn-secondary' onclick='compararArray()'>Continuar</button></div>";

	document.getElementById("div_columns_name2").innerHTML = 	
		"<p><strong>Consideraciones:</strong></p><p>Horarios y Sessión <strong>duplicados</strong></p><img src='tree/main/IMG/duplicados.PNG' class='img-fluid' alt='Imagen de ejemplo para los horarios duplicados'> <p>Horarios y Sessión <strong>unificados</strong></p> <img src='tree/main/IMG/unificados.PNG' class='img-fluid' alt='Imagen de ejemplo para los horarios unificados'>";
}

function compararArray(){

	// Saber los nombres de las columnas que tiene el arcchivo Excel
	columns_name = Object.getOwnPropertyNames(json_object_parse[0]);

	//Sigla programada o Sigla en malla > Sigla

	//Asignatura programada o Asignatura en malla > Asignatura

	// Creditos > X
	
	// Guardar referencia a las columnas	
}

function showWorkingDay() {

	// Listar periodo
	stringWorkingDay = "";
	document.getElementById("div_working_day").innerHTML = ""; // diurno o vespertino

	distinctWorkingDay = [...new Set(json_object_parse.map(x => x.Jornada))];

	for (let m = 0; m < distinctWorkingDay.length; m++) {

		stringWorkingDay = stringWorkingDay + "<option>" + distinctWorkingDay[m] + "</option>";
	}
	document.getElementById("div_working_day").innerHTML = document.getElementById("div_working_day").innerHTML +
		"<select multiple class='form-control' id='working_day'>" + stringWorkingDay + "</select>";
}

function showCareer() {

	distinctCourse = "";
	document.getElementById("div_career").innerHTML = "";

	distinctCourse = [...new Set(json_object_parse.map(x => x.Carrera))];

	// Listar curso
	for (let n = 0; n < distinctCourse.length; n++) {

		stringCourse = stringCourse + "<option>" + distinctCourse[n] + "</option>";
	}
	document.getElementById("div_career").innerHTML = document.getElementById("div_career").innerHTML +
		"<select multiple class='form-control' id='career'>" + stringCourse + "</select>";
}

function showSemester() {

	stringNivel = "";
	document.getElementById("div_semester").innerHTML = "";

	distinctSemester = [...new Set(json_object_parse.map(x => x.Nivel))];

	distinctSemester.sort();

	// Listar semestre
	for (let ñ = 0; ñ < distinctSemester.length; ñ++) {

		stringNivel = stringNivel + "<option>" + distinctSemester[ñ] + "</option>";
	}
	document.getElementById("div_semester").innerHTML = document.getElementById("div_semester").innerHTML +
		"<select multiple class='form-control' id='nivel'>" + stringNivel + "</select>";
}

function showSubject() {

	stringSubjets = "";
	document.getElementById("div_subjets").innerHTML = "";

	distinctAsignaturas = [...new Set(json_object_parse.map(x => x.Asignatura))];

	// Listar asignaturas
	for (let o = 0; o < distinctAsignaturas.length; o++) {

		stringSubjets = stringSubjets + "<option>" + distinctAsignaturas[o] + "</option>";
	}
	document.getElementById("div_subjets").innerHTML = document.getElementById("div_subjets").innerHTML +
		"<select multiple class='form-control' id='subjets'>" + stringSubjets + "</select><div class='p-2'><button class='btn btn-secondary' onclick='getValues()'>Generar Horarios</button></div>";
}

function getValues() {
	let selectElement = document.getElementById('working_day')
	let selectedValues = Array.from(selectElement.selectedOptions).map(option => option.value)

	let selectElement2 = document.getElementById('career')
	let selectedValues2 = Array.from(selectElement2.selectedOptions).map(option => option.value)

	let selectElement3 = document.getElementById('nivel')
	let selectedValues3 = Array.from(selectElement3.selectedOptions).map(option => option.value)

	let selectElement4 = document.getElementById('subjets')
	let selectedValues4 = Array.from(selectElement4.selectedOptions).map(option => option.value)

	const dates = {
		Jornada: [],
		Carrera: [],
		Nivel: [],
		Asignatura: []
	}

	dates.Jornada = selectedValues;
	dates.Carrera = selectedValues2;
	dates.Nivel = selectedValues3;
	dates.Asignatura = selectedValues4;
	
	json_object_parse2 = find_in_object(json_object_parse, dates);
}

function find_in_object(my_array, my_criteria) {
	return my_array.filter(function (obj) {
		return Object.keys(my_criteria).every(function (key) {
			return (Array.isArray(my_criteria[key]) && (my_criteria[key].some(function (criteria) {
				return (typeof obj[key] === 'string' && obj[key].indexOf(criteria) !== -1)
			})) || my_criteria[key].length === 0);
		});
	});
}

function filter() {

	let jsonData = [
		{ "sn": "234234234", "pn": "1014143", "mft": "hello world", "sl": "GG07", "vtv": "Yes" },
		{ "sn": "324234234", "pn": "101423131143", "mft": "hello world 1", "sl": "GG08", "vtv": "Yes" }
	]

	let query = {
		mft: [],
		sl: ["GG08", "GG07"],
		vtv: ["Yes"]
	}
	console.log(find_in_object(jsonData, query)); //returns one

	let query2 = {
		sn: ['T234834U', 'T23423423'],
		pn: ['1014114', '21412342'],
		mft: ['Sbasdfa', 'asdfaser'],
		sl: ['BB03', 'SFD04'],
		vtv: ['Yes']
	}
	console.log(find_in_object(jsonData, query2)); //returns none
}

function drawTableWhitData() {

	/*
	document.getElementById("div_data").innerHTML = document.getElementById("div_data").innerHTML +
	<table class='table table-striped'>
		<caption>Contenido</caption>
		<thead>
			<tr>
				<th scope='col'>#</th>
				<th scope='col'>First</th>
				<th scope='col'>Last</th>
				<th scope='col'>Handle</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th scope='row'>1</th>
				<td>Mark</td>
				<td>Otto</td>
				<td>@mdo</td>
			</tr>
			<tr>
				<th scope='row'>2</th>
				<td>Jacob</td>
				<td>Thornton</td>
				<td>@fat</td>
			</tr>
			<tr>
				<th scope='row'>3</th>
				<td>Larry</td>
				<td>the Bird</td>
				<td>@twitter</td>
			</tr>
		</tbody>
	</table>";
	*/
}
