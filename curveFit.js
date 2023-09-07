// curveFit.js
// (c) Simon Giesen, 05.09.23 Sensitec GmbH Mainz/Germany
// edited 06.09.23

// Funktion für den 5PL-Curve-Fit
function fivePLCurveFit(x, top, bottom, EC50, slope, hillSlope) {
  var response = bottom + ((top - bottom) / (1 + Math.pow((x / EC50), hillSlope))) * Math.pow((x / EC50), slope);
  return response;
}

function predictYForX(xValue, fittedParams) {
  var prediction = fivePLCurveFit(xValue, fittedParams[0], fittedParams[1], fittedParams[2], fittedParams[3], fittedParams[4]);
  return prediction;
}

function predictYForXCalling(xValue) {
  var prediction = fivePLCurveFit(xValue, fittedParams[0], fittedParams[1], fittedParams[2], fittedParams[3], fittedParams[4]);
  return prediction;
}

// Datenpunkte
var xData = [];
var yData = [];

// Generiere Vorhersagen für neue x-Werte mit den geschätzten Parametern
var new_x = [];
var predictions = [];
var fittedParams = [];

function performCurveFit() {
	predictions = [];
	
  // Funktion zur nichtlinearen Regression mit Anfangswerten
  var result = numeric.uncmin(function(params) {
    var residuals = [];

    for (var i = 0; i < xData.length; i++) {
      var x = xData[i];
      var y = yData[i];
      var modelY = fivePLCurveFit(x, params[0], params[1], params[2], params[3], params[4]);
      var residual = y - modelY;
      residuals.push(residual);
    }

    return numeric.norm2(residuals);
  }, [1, 1, 1, 1, 1]); // Anfangswerte

  fittedParams = result.solution;
  window.fittedParams = fittedParams;
  
  // Ergebnisse ausgeben
  console.log("Geschätzte Top:", fittedParams[0]);
  console.log("Geschätzte Bottom:", fittedParams[1]);
  console.log("Geschätztes EC50:", fittedParams[2]);
  console.log("Geschätzter Slope:", fittedParams[3]);
  console.log("Geschätzter Hill Slope:", fittedParams[4]);

  // Generiere Vorhersagen für neue x-Werte mit den geschätzten Parametern
  for (var i = 0; i < new_x.length; i++) {
    var x = new_x[i];
    var prediction = fivePLCurveFit(x, fittedParams[0], fittedParams[1], fittedParams[2], fittedParams[3], fittedParams[4]);
    predictions.push(prediction);
  }

  console.log("Vorhergesagte y-Werte:", predictions);
  window.predictionsArray = predictions;
  
  
}
 
