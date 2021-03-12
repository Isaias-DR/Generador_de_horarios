let columns_name;
let distinctWorkingDay, distinctCourse, distinctSemester, distinctSubjets;
let filterSubjets, selectionSubjets;
let filterSection, selectionSection;
var stringWorkingDay, stringCourse, stringNivel, stringSubjets;
let selectedValuesSubjets
var XL_row_object, json_object, json_object_parse, json_object_parse2, workbook;
var age

const valueGeneral = {

	Año: [],
	Período: [],
	Sede: [],
	Escuela: [],
	Carrera: [],
	Plan: [],
	Tipo_Plan_de_Estudio: [],
	Jornada: [],
	Carrera: [],
	Nivel: []
}

var valueSpecific = {

	Asignatura: [],
	Sección: [],
	Docente: "",
	Día: "",
	HoraInicio: 0,
	HoraFin: 0,
	Sala: ""
}

let arraySubjets = []

// var valueSubjet = {
// 	nombreA: "A1",
// 	section: []
// }

// arraySubjets.push(valueSubjet)

// var valueSection = {
// 	nombreS: "A1S1",
// 	horario: []
// }

// arraySubjets[arraySubjets.length - 1].section.push(valueSection)

// var valueSchedule = {
// 	day: "Jueves",
// 	hourStart: 10,
// 	hourEnd: 20
// }

// arraySubjets[arraySubjets.length - 1].section[arraySubjets[arraySubjets.length - 1].section.length - 1].horario.push(valueSchedule)

// var valueSchedule2 = {
// 	day: "Miercoes",
// 	hourStart: 20,
// 	hourEnd: 40
// }

// arraySubjets[arraySubjets.length - 1].section[arraySubjets[arraySubjets.length - 1].section.length - 1].horario.push(valueSchedule2)

// console.log(arraySubjets)




// arraySubjets[arraySubjets.length - 1].section.push(valueSection)

// arraySection = arraySubjets[0].section
// console.log(arraySection)
// var valueSection = {
// 	nombreS: "A1S2",
// 	horario: []
// }
// var arraySection2 = [
// 	{ nombreS: "A1S2", horario: [] },
// 	{ nombreS: "A1S3", horario: [] }
// ]
// filtroSection = arraySubjets[arraySubjets.length - 1].section.find(a => a.nombreS === valueSection.nombreS);


// if (filtroSection == undefined) {

// 	console.log('no existe')
// } else {

// 	console.log(filtroSection)
// 	console.log(filtroSection.nombreS)
// 	console.log(filtroSection.nombreS == valueSection.nombreS)
// 	if (filtroSection.nombreS == valueSection.nombreS) {
// 		console.log('ya existe')
// 	}
// }











function handleFileSelect(evt) {

	var files = evt.target.files; // Lista de objetos de archivos
	var xl2json = new ExcelToJSON()
	xl2json.parseExcel(files[0])
}

class ExcelToJSON {

	constructor() {

		this.parseExcel = function (file) {

			var reader = new FileReader()

			reader.onload = function (e) {

				var data = e.target.result
				workbook = XLSX.read(data, { type: 'binary' })

				// Recorrer las hojas del Excel
				document.getElementById("div_leaves").innerHTML = ""
				document.getElementById("div_leaves").innerHTML +=
					"<h6>2 - Seleccione la hoja que contenga los datos para la toma de ramos, ejemplo: Asignaturas, Horarios o Profesor/a.</h6>"

				workbook.SheetNames.forEach(function (sheetName) {

					document.getElementById("div_leaves").innerHTML +=
						"<div class='form-check'><input class='form-check-input' type='radio' id='leaves' name='leaves' value='"
						+ sheetName + "' onchange='handleChange(event)' >" +
						"<label class='form-check-label' for='" + sheetName + "'>" + sheetName + "</label></div>"
				})
			}

			reader.onerror = function (ex) {

				console.log(ex)
			}

			reader.readAsBinaryString(file)
		}
	}
}

function handleChange(e) {

	// Tomar y guarda todos los datos de esa hoja elegida
	XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[e.currentTarget.value]) // objeto
	json_object = JSON.stringify(XL_row_object) // texto - stringify combierte un objeto o valor a una cadena de texto
	json_object_parse = JSON.parse(json_object) // JSON - analiza una cadena de texto como JSON, transformando opcionalmente  el valor producido por el análisis.

	compararArray()
}

function compararArray() {

	var leave
	var checkboxArray = document.getElementsByName("leaves")
	for (i = 0; i < checkboxArray.length; i++) {
		if (checkboxArray[i].checked == true) {
			leave = i
		}
	}

	// Saber los nombres de las columnas que tiene el arcchivo Excel
	columns_name = Object.getOwnPropertyNames(json_object_parse[leave])

	if (columns_name.includes("Asignatura")) {
		age = 2018
	} else if (columns_name.includes("Asignatura programada")) {
		age = 2017
	}

	if (age == 2018 || age == 2017) {

		document.getElementById("div_filters").innerHTML = ""
		document.getElementById("div_filters").innerHTML +=
			"<div class='row'><h6>3 - Filtros</h6><div class='col-12 col-md-4'><h6>Jornada</h6><div id='div_working_day' class='form-check'></div></div>" +
			"<div class='col-12 col-md-8'><h6>Carrera</h6><div id='div_career' class='form-check'></div></div></div><div class='row'>" +
			"<div class='col-12 col-md-4'><h6>Semenstres</h6><div id='div_semester' class='form-check'></div></div>" +
			"<div class='col-12 col-md-8'><h6>Asignaturas (requerida selección)</h6><div id='div_subjets' class='form-check'></div></div></div>"
		showWorkingDay()
		showCareer()
		showSemester()
		showSubject(1)
	} else {

		alert("Revise los nombre de las columnas con su contenido correspondiente")
	}

	// Sigla programada o Sigla en malla > Sigla

	// Asignatura programada o Asignatura en malla > Asignatura

	// Creditos > X
}

function showWorkingDay() {

	stringWorkingDay = ""
	document.getElementById("div_working_day").innerHTML = "";

	distinctWorkingDay = [...new Set(json_object_parse.map(x => x.Jornada))]

	// Listar jornada (diurno o vespertino)
	for (let m = 0; m < distinctWorkingDay.length; m++) {

		stringWorkingDay = stringWorkingDay + "<option>" + distinctWorkingDay[m] + "</option>"
	}
	document.getElementById("div_working_day").innerHTML +=
		"<select multiple class='form-control' id='working_day' onchange='showSubject(2)'>" + stringWorkingDay + "</select>"
}

function showCareer() {

	distinctCourse = ""
	document.getElementById("div_career").innerHTML = ""

	distinctCourse = [...new Set(json_object_parse.map(x => x.Carrera))]

	// Listar curso
	for (let n = 0; n < distinctCourse.length; n++) {

		stringCourse = stringCourse + "<option>" + distinctCourse[n] + "</option>"
	}
	document.getElementById("div_career").innerHTML +=
		"<select multiple class='form-control' id='career' onchange='showSubject(2)'>" + stringCourse + "</select>"
}

function showSemester() {

	stringNivel = ""
	document.getElementById("div_semester").innerHTML = ""

	distinctSemester = [...new Set(json_object_parse.map(x => x.Nivel))]

	distinctSemester.sort()

	// Listar semestre
	for (let ñ = 0; ñ < distinctSemester.length; ñ++) {

		stringNivel = stringNivel + "<option>" + distinctSemester[ñ] + "</option>"
	}
	document.getElementById("div_semester").innerHTML +=
		"<select multiple class='form-control' id='nivel' onchange='showSubject(2)'>" + stringNivel + "</select>"
}

function showSubject(estado) {

	if (estado == 1) {

		if (age == 2018) {

			distinctSubjets = [...new Set(json_object_parse.map(x => x.Asignatura))]
		} else if (age == 2017) {

			distinctSubjets = [...new Set(json_object_parse.map(x => x.Asignatura_en_malla))]
		}
	} else if (estado == 2) {

		getValues(1)

		if (age == 2018) {

			distinctSubjets = [...new Set(json_object_parse2.map(x => x.Asignatura))]
		} else if (age == 2017) {

			distinctSubjets = [...new Set(json_object_parse2.map(x => x.Asignatura_en_malla))]
		}
	}

	stringSubjets = ""
	document.getElementById("div_subjets").innerHTML = ""

	// Listar asignaturas
	for (let o = 0; o < distinctSubjets.length; o++) {

		stringSubjets = stringSubjets + "<option>" + distinctSubjets[o] + "</option>"
	}
	document.getElementById("div_subjets").innerHTML +=
		"<select multiple class='form-control' id='subjets'>" + stringSubjets +
		"</select><div class='p-2'><button class='btn btn-secondary' onclick='getValues(2)'>Generar Horarios</button></div>"
}

function getValues(estatus) {

	let selectElementWorkingDay = document.getElementById('working_day')
	let selectedValuesWorkingDay = Array.from(selectElementWorkingDay.selectedOptions).map(option => option.value)

	let selectElementCareer = document.getElementById('career')
	let selectedValuesCareer = Array.from(selectElementCareer.selectedOptions).map(option => option.value)

	let selectElementNivel = document.getElementById('nivel')
	let selectedValuesNivel = Array.from(selectElementNivel.selectedOptions).map(option => option.value)

	let selectElementSubjets = document.getElementById('subjets')
	selectedValuesSubjets = Array.from(selectElementSubjets.selectedOptions).map(option => option.value)

	valueGeneral.Jornada = selectedValuesWorkingDay
	valueGeneral.Carrera = selectedValuesCareer
	valueGeneral.Nivel = selectedValuesNivel
	valueGeneral.Asignatura = selectedValuesSubjets

	json_object_parse2 = find_in_object(json_object_parse, valueGeneral)

	if (estatus === 2) {

		filterCareer()
	}
}

function find_in_object(my_array, my_criteria) {

	return my_array.filter(function (obj) {
		return Object.keys(my_criteria).every(function (key) {
			return (Array.isArray(my_criteria[key]) && (my_criteria[key].some(function (criteria) {
				return (typeof obj[key] === 'string' && obj[key].indexOf(criteria) !== -1)
			})) || my_criteria[key].length === 0)
		})
	})
}

function clone(obj) {

	if (obj === null || typeof obj !== 'object') {

		return obj
	}

	var temp = obj.constructor();

	for (var key in obj) {

		temp[key] = clone(obj[key])
	}

	return temp
}

function filterCareer() {

	for (let p = 0; p < selectedValuesSubjets.length; p++) {

		rebuild1_1()
		rebuild1_2()

		valueSpecific.Asignatura = [selectedValuesSubjets[p]] // Adapta el valueSpecific solo para esa asignatura con los datos nesesarios para filtrar

		var valueSubjet = {

			nombreA: valueSpecific.Asignatura,
			section: []
		}

		arraySubjets.push(valueSubjet)

		filterSubjets = find_in_object(json_object_parse2, valueSpecific) // filtra solo los datos de esa asignatura

		selectionSubjets = [...new Set(filterSubjets.map(x => x.Sección))] // obtiene unicamente las secciones de esa asignatura

		for (let q = 0; q < selectionSubjets.length; q++) {

			rebuild1_2()

			valueSpecific.Sección = [selectionSubjets[q]] // Adapta el valueSpecific solo para esa sección con los datos nesesarios para filtrar

			var valueSection = {

				nombreS: valueSpecific.Sección,
				horario: []
			}

			filtroSection = arraySubjets[arraySubjets.length - 1].section.find(a => a.nombreS === valueSection.nombreS);

			arraySubjets[arraySubjets.length - 1].section.push(valueSection)

			filterSection = find_in_object(json_object_parse2, valueSpecific) // filtra solo los datos de esa sección

			selectionSection = Array.from(new Set(filterSection.map(s => s.Horario))).map(Horario => { return { Horario: Horario, Día: filterSection.find(s => s.Horario === Horario).Día } })

			for (let r = 0; r < selectionSection.length; r++) {

				valueSpecific.Día = selectionSection[r].Día
				var stringHourStart = selectionSection[r].Horario.split(" ")[1]
				let arrayHour = stringHourStart.split(":")
				valueSpecific.HoraInicio = parseInt(arrayHour[0]) * 3600 + parseInt(arrayHour[1]) * 60 // Adapta el valueSpecific solo para ese horario con los datos nesesarios para filtrar
				stringHourStart = selectionSection[r].Horario.split(" ")[3]
				arrayHour = stringHourStart.split(":")
				valueSpecific.HoraFin = parseInt(arrayHour[0]) * 3600 + parseInt(arrayHour[1]) * 60

				console.log(valueSpecific.Asignatura + " " + valueSpecific.Sección + " " + valueSpecific.Día + " " + valueSpecific.HoraInicio + " " + valueSpecific.HoraFin)

				var valueSchedule = {
					day: valueSpecific.Día,
					hourStart: valueSpecific.HoraInicio,
					hourEnd: valueSpecific.HoraFin
				}

				arraySubjets[arraySubjets.length - 1].section[arraySubjets[arraySubjets.length - 1].section.length - 1].horario.push(valueSchedule)
				// No sirve si uno crea por defecto los atributos inicialisados con "", {} o [], aquello es considerado como un atributo mas del array y entorpecera el proseso de asignación en el FOR
			}
		}
	}
	console.log(valueSubjet)
}

function rebuild1_1() {

	valueSpecific.Sección = [] // Reinicio, para que la ultima sección no entorpesca a la asignatura siguiente, estuve harto tiempo buscando la solución
}

function rebuild1_2() {

	valueSpecific.HoraInicio = ""
	valueSpecific.HoraFin = ""
	valueSpecific.Día = ""
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
	</table>"
	*/
}
