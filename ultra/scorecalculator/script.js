document.getElementById("ladrilhoDe1").value = "0";
document.getElementById("ladrilhoDe2").value = "0";
document.getElementById("ladrilhoDe3").value = "0";
document.getElementById("BecoESaida").value = "0";
document.getElementById("Gangorra").value = "0";
document.getElementById("obstaculo").value = "0";
document.getElementById("gap").value = "0";
document.getElementById("rampa").value = "0";
document.getElementById("lombada").value = "0";
document.getElementById("tentativas").value = "0";
document.getElementById("persTotal").value = "0";

setInterval(function() {
  //Informações essenciais
  var ladrilhoDePrimeira = document.getElementById("ladrilhoDe1").value;
  var ladrilhoDeSegunda = document.getElementById("ladrilhoDe2").value;
  var ladrilhoDeTerceira = document.getElementById("ladrilhoDe3").value;
  var BecoESaida = document.getElementById("BecoESaida").value;
  var Gangorra = document.getElementById("Gangorra").value;
  var obstaculo = document.getElementById("obstaculo").value;
  var gap = document.getElementById("gap").value;
  var rampa = document.getElementById("rampa").value;
  var lombada = document.getElementById("lombada").value;
  var tentativas = document.getElementById("tentativas").value;
  var persTotal = document.getElementById("persTotal").value;

  //Mudar para numero
  var nLadrilhoDePrimeira = parseInt(ladrilhoDePrimeira);
  var nladrilhoDeSegunda = parseInt(ladrilhoDeSegunda);
  var nladrilhoDeTerceira = parseInt(ladrilhoDeTerceira);
  var nBecoESaida = parseInt(BecoESaida);
  var nGangorra = parseInt(Gangorra);
  var nobstaculo = parseInt(obstaculo);
  var ngap = parseInt(gap);
  var nrampa = parseInt(rampa);
  var nlombada = parseInt(lombada);
  var ntentativas = parseInt(tentativas);
  var npersTotal = parseInt(persTotal);

  // CheckBox
  // Inicio
  let checkboxInicio = document.getElementById("inicio");
  var inicio = 0;
  if (checkboxInicio.checked) {
    inicio = 5;
  }

  let checkboxFinal = document.getElementById("final");
  var final = 0;
  if (checkboxFinal.checked) {
    final = 60;
  }

  let checkboxDesafio = document.getElementById("desafio");
  var desafio = 1;
  if (checkboxDesafio.checked) {
    desafio = 1.5;
  }

  let checkboxGG = document.getElementById("GG");
  var GG = 1;
  if (checkboxGG.checked) {
    GG = 1.3;
  }

  let checkboxGG2 = document.getElementById("GG2");
  var GG2 = 1;
  if (checkboxGG2.checked) {
    GG2 = 1.3;
  }

  let checkboxGR = document.getElementById("GR");
  var GR = 1;
  if (checkboxGR.checked) {
    GR = 1.1;
  }

  let checkboxRG = document.getElementById("RG");
  var RG = 1;
  if (checkboxRG.checked) {
    RG = 1.1;
  }

  let checkboxRG2 = document.getElementById("RG2");
  var RG2 = 1;
  if (checkboxRG2.checked) {
    RG2 = 1.1;
  }

  let checkboxRR = document.getElementById("RR");
  var RR = 1;
  if (checkboxRR.checked) {
    RR = 1.3;
  }


  //Calcular
  var total = inicio + (nLadrilhoDePrimeira * 5) + (nladrilhoDeSegunda * 3) + nladrilhoDeTerceira + (nBecoESaida * 10) + (nGangorra * 20) + (nobstaculo * 20) + (ngap * 10) + (nrampa * 10) + (nlombada * 10) + (final === 60 ? final - ( ntentativas >= 12 ? 60 : 5 * ntentativas) : 0);
  total = total * GG;
  total = total * GG2;
  total = total * GR;
  total = total * RG;
  total = total * RG2;
  total = total * RR;
  total = total * desafio;

  if (total == 0 && npersTotal != 0) {
    total = npersTotal
  }
  
  document.getElementById("resultado").innerHTML = total;
}
, 1) 

