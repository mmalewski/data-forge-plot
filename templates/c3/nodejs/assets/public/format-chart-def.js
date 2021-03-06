(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Configure a single axe.
 */
function configureOneAxe(axisName, inputChartDef, c3Axes) {
    var axisMap = inputChartDef.axisMap;
    if (!axisMap) {
        return;
    }
    var series = axisMap[axisName];
    if (!series) {
        return;
    }
    for (var _i = 0, series_1 = series; _i < series_1.length; _i++) {
        var seriesConfig = series_1[_i];
        c3Axes[seriesConfig.series] = axisName;
    }
}
/**
 * Configure C3 axes.
 */
function configureAxes(inputChartDef) {
    var c3Axes = {};
    configureOneAxe("y", inputChartDef, c3Axes);
    configureOneAxe("y2", inputChartDef, c3Axes);
    return c3Axes;
}
/**
 * Determine the default axis type based on data type.
 * TODO: This code could be simplified by removing this function. This should be choosen server-side!
 */
function determineAxisType(dataType) {
    if (dataType === "number") {
        return "indexed";
    }
    else if (dataType === "date") {
        return "timeseries";
    }
    else {
        return "category";
    }
}
/**
 * Format values for display.
 */
function formatValues(inputChartDef, seriesName, dataType, formatString) {
    if (dataType === "number") {
        return inputChartDef.data.values.map(function (value) { return numeral(value[seriesName]).format(formatString); });
    }
    else if (dataType === "date") {
        return inputChartDef.data.values.map(function (value) { return moment(value[seriesName]).format(formatString); });
    }
    else {
        return undefined;
    }
}
function configureOneSeries(seriesConfig, inputChartDef, axisConfig, c3AxisDef) {
    // Default axis type based on data type.
    var seriesName = seriesConfig.series;
    var dataType = inputChartDef.data.columns[seriesName];
    c3AxisDef.type = determineAxisType(dataType);
    if (axisConfig) {
        if (axisConfig.axisType && axisConfig.axisType !== "default") {
            c3AxisDef.type = axisConfig.axisType;
        }
        if (axisConfig.label) {
            c3AxisDef.label = axisConfig.label;
        }
    }
    c3AxisDef.show = true;
    if (seriesConfig.format) {
        if (!c3AxisDef.tick) {
            c3AxisDef.tick = {};
        }
        c3AxisDef.tick.values = formatValues(inputChartDef, seriesName, dataType, seriesConfig.format);
    }
}
/**
 * Configure a single axis.
 */
function configureOneAxis(axisName, inputChartDef, axisConfig, c3Axis) {
    var axisMap = inputChartDef.axisMap;
    if (!axisMap) {
        return;
    }
    c3Axis[axisName] = { show: false };
    //fio:const axisDef: IAxisConfig = (inputChartDef.plotConfig as any)[axisName];
    var c3AxisDef = c3Axis[axisName];
    var series = axisMap[axisName];
    if (!series) {
        return;
    }
    if (Array.isArray(series)) {
        series.forEach(function (seriesConfig) {
            configureOneSeries(seriesConfig, inputChartDef, axisConfig, c3AxisDef);
        });
    }
    else {
        configureOneSeries(series, inputChartDef, axisConfig, c3AxisDef);
    }
}
/**
 * Configure a single Y axis.
 */
function configureOneYAxis(axisName, inputChartDef, axisConfig, c3Axis) {
    var axisMap = inputChartDef.axisMap;
    if (!axisMap) {
        return;
    }
    configureOneAxis(axisName, inputChartDef, axisConfig, c3Axis);
    var c3AxisDef = c3Axis[axisName];
    if (axisConfig.min !== undefined) {
        c3AxisDef.min = axisConfig.min;
    }
    if (axisConfig.max !== undefined) {
        c3AxisDef.max = axisConfig.max;
    }
}
/**
 * Configure C3 axis'.
 */
function configureAxis(inputChartDef) {
    var c3Axis = {};
    configureOneAxis("x", inputChartDef, inputChartDef.plotConfig.x, c3Axis);
    configureOneYAxis("y", inputChartDef, inputChartDef.plotConfig.y, c3Axis);
    configureOneYAxis("y2", inputChartDef, inputChartDef.plotConfig.y2, c3Axis);
    return c3Axis;
}
/**
 * Configure the names of series.
 */
function configureSeriesNames(inputChartDef) {
    var seriesNames = {};
    if (inputChartDef.axisMap) {
        for (var axisName in inputChartDef.axisMap) {
            var series = inputChartDef.axisMap[axisName];
            if (Array.isArray(series)) {
                series.forEach(function (seriesConfig) {
                    if (seriesConfig.label) {
                        seriesNames[seriesConfig.series] = seriesConfig.label;
                    }
                });
            }
            else {
                if (series.label) {
                    seriesNames[series.series] = series.label;
                }
            }
        }
    }
    return seriesNames;
}
/**
 * Extract x axis series for y axis series.
 */
function extractXS(axisName, inputChartDef, xs) {
    var axisMap = inputChartDef.axisMap;
    if (!axisMap) {
        return;
    }
    var series = axisMap[axisName];
    if (!series) {
        return;
    }
    for (var _i = 0, series_2 = series; _i < series_2.length; _i++) {
        var seriesConfig = series_2[_i];
        var ySeriesName = seriesConfig.series;
        if (xs[ySeriesName]) {
            return; // Already set.
        }
        if (seriesConfig.x) {
            xs[ySeriesName] = seriesConfig.x.series; // X explicitly associated with Y.
        }
        else if (inputChartDef.axisMap && inputChartDef.axisMap.x) {
            xs[ySeriesName] = inputChartDef.axisMap.x.series; // Default X.
        }
    }
}
function addColumn(seriesName, inputChartDef, columns, columnsSet) {
    if (columnsSet[seriesName]) {
        return; // Already set.
    }
    var columnData = inputChartDef.data.values.map(function (row) { return row[seriesName]; });
    columnsSet[seriesName] = true;
    columns.push([seriesName].concat(columnData));
}
/**
 * Extract column data.
 */
function extractColumns(axisName, inputChartDef, columns, columnsSet) {
    var axisMap = inputChartDef.axisMap;
    if (!axisMap) {
        return;
    }
    var series = axisMap[axisName];
    if (!series) {
        return;
    }
    for (var _i = 0, series_3 = series; _i < series_3.length; _i++) {
        var seriesConfig = series_3[_i];
        addColumn(seriesConfig.series, inputChartDef, columns, columnsSet);
        var xSeriesName = seriesConfig.x && seriesConfig.x.series
            || inputChartDef.axisMap && inputChartDef.axisMap.x && inputChartDef.axisMap.x.series || null;
        if (xSeriesName) {
            addColumn(xSeriesName, inputChartDef, columns, columnsSet);
        }
    }
}
/**
 * Convert a data-forge-plot chart definition to a C3 chart definition.
 */
function formatChartDef(inputChartDef) {
    //
    // WORKAROUND: Merge the index in as a column.
    // This needs to be changed later and it shouldn't be part of the C3 template it should be
    // code that is shared to all templates.
    //
    var workingChartDef = inputChartDef;
    //TODO: This transformation should not be in the template!
    if (inputChartDef.data.index && inputChartDef.data.index.values && inputChartDef.data.index.values.length > 0) {
        workingChartDef = Object.assign({}, inputChartDef);
        workingChartDef.data = Object.assign({}, inputChartDef.data);
        workingChartDef.data.columnOrder = inputChartDef.data.columnOrder.slice(); // Clone array.
        workingChartDef.data.columnOrder.push("__index__");
        workingChartDef.data.columns = Object.assign({}, inputChartDef.data.columns);
        workingChartDef.data.columns["__index__"] = inputChartDef.data.index.type;
        workingChartDef.data.values = inputChartDef.data.values.slice(); // Clone array.
        for (var i = 0; i < workingChartDef.data.values.length; ++i) {
            var row = workingChartDef.data.values[i];
            row["__index__"] = inputChartDef.data.index.values[i];
        }
    }
    var values = workingChartDef.data.values;
    //TODO: Dates need to be deserialized by the api.
    if (workingChartDef.data.columns) {
        var columnNames = Object.keys(workingChartDef.data.columns);
        var hasDates = columnNames.filter(function (columnName) { return workingChartDef.data.columns[columnName] === "date"; });
        if (hasDates) {
            values = values.slice(); // Clone the date so we can inflate the dates.
            for (var _i = 0, columnNames_1 = columnNames; _i < columnNames_1.length; _i++) {
                var columnName = columnNames_1[_i];
                if (workingChartDef.data.columns[columnName] === "date") {
                    for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
                        var row = values_1[_a];
                        row[columnName] = moment(row[columnName], moment.ISO_8601).toDate();
                    }
                }
            }
        }
    }
    var xs = {};
    extractXS("y", workingChartDef, xs);
    extractXS("y2", workingChartDef, xs);
    var columns = [];
    var columnsSet = {};
    extractColumns("y", workingChartDef, columns, columnsSet);
    extractColumns("y2", workingChartDef, columns, columnsSet);
    var c3ChartDef = {
        bindto: "#chart",
        size: {
            width: workingChartDef.plotConfig && workingChartDef.plotConfig.width || 1200,
            height: workingChartDef.plotConfig && workingChartDef.plotConfig.height || 600,
        },
        data: {
            xs: xs,
            columns: columns,
            type: workingChartDef.plotConfig && workingChartDef.plotConfig.chartType || "line",
            axes: configureAxes(workingChartDef),
            names: configureSeriesNames(workingChartDef),
        },
        axis: configureAxis(workingChartDef),
        transition: {
            duration: 0 // Disable animated transitions when we are capturing a static image.
        },
        point: {
            show: false
        },
        legend: {
            show: workingChartDef.plotConfig.legend.show,
        },
    };
    return c3ChartDef;
}
exports.formatChartDef = formatChartDef;

},{}],2:[function(require,module,exports){

window.formatChartDef = require('../../build/templates/c3/format-chart-def').formatChartDef;
},{"../../build/templates/c3/format-chart-def":1}]},{},[2]);
