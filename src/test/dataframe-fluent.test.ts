import { expect } from "chai";
import "mocha";
import { DataFrame } from "data-forge";
import "../index";

describe("data-forge-plot - dataframe fluent", () => {

    it("can explicity set y axis", ()  => {

        const series = new DataFrame({ index: [1, 2, 3], values: [{ A: 10 }, { A: 20 }, { A: 30 } ] });
        const plotAPI = series.plot()
            .y("A");

        expect(plotAPI.serialize()).to.eql({
            data: {
                columnOrder: [
                    "A",
                    "__index__",
                ],
                columns: {
                    A: "number",
                    __index__: "number",
                },
                index: {
                    type: "number",
                    values: [ 1, 2, 3 ],
                },
                values: [
                    {
                        A: 10,
                        __index__: 1,
                    },
                    {
                        A: 20,
                        __index__: 2,
                    },
                    {
                        A: 30,
                        __index__: 3,
                    },
                ],
            },
            plotConfig: {
                chartType: "line",
                width: 800,
                height: 600,
                template: "c3",
                x: {
                    axisType: "default",
                    label: {},
                },
                y: {
                    axisType: "default",
                    label: {},
                },
                y2: {
                    axisType: "default",
                    label: {},
                },
                legend: {
                    show: true,
                },
            },
            axisMap: {
                x: {
                    series: "__index__",
                },
                y: [
                    {
                        series: "A",
                    },
                ],
                y2: [],
            },
        });
    });

    it("can set template", ()  => {

        const series = new DataFrame({ index: [ 1 ], values: [{ A: 10 } ] });
        const plotAPI = series.plot()
            .template("wug");

        expect(plotAPI.serialize()).to.eql({
            data: {
                columnOrder: [
                    "A",
                    "__index__",
                ],
                columns: {
                    A: "number",
                    __index__: "number",
                },
                index: {
                    type: "number",
                    values: [ 1 ],
                },
                values: [
                    {
                        A: 10,
                        __index__: 1,
                    },
                ],
            },
            plotConfig: {
                chartType: "line",
                width: 800,
                height: 600,
                template: "wug",
                x: {
                    axisType: "default",
                    label: {},
                },
                y: {
                    axisType: "default",
                    label: {},
                },
                y2: {
                    axisType: "default",
                    label: {},
                },
                legend: {
                    show: true,
                },
            },
            axisMap: {
                x: {
                    series: "__index__",
                },
                y: [
                    {
                        series: "A",
                    },
                ],
                y2: [],
            },
        });
    });

});
