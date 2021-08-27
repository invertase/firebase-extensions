"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const fa_1 = require("react-icons/fa");
const types_1 = __importDefault(require("./types"));
const baseUrl = 'https://europe-west2-extensions-testing.cloudfunctions.net/ext-storage-image-processing-api-handler/process';
const InteractiveExample = () => {
    const [editing, setEditing] = react_1.useState(null);
    const [loading, setLoading] = react_1.useState(false);
    const [option, setOption] = react_1.useState('');
    const [operations, setOperations] = react_1.useState([
        {
            operation: 'input',
            type: 'url',
            url: 'https://tinyurl.com/hkeujyyz',
        },
        {
            operation: 'output',
            format: 'png',
        },
    ]);
    const addOperation = () => {
        setLoading(true);
        const toUpdate = operations;
        toUpdate.splice(1, 0, editing);
        setOperations([...toUpdate]);
        setEditing(null);
        setOption(null);
        setLoading(false);
    };
    // const updateOperation = ({ operation, ...rest }) => {
    //   setLoading(true);
    //   const toUpdate = operations.filter($ => $.operation !== operation);
    //   //@ts-ignore
    //   toUpdate.splice(1, 0, { operation, ...rest });
    //   setOperations([...toUpdate]);
    //   setLoading(false);
    // };
    const removeOperation = operation => {
        setLoading(true);
        const toUpdate = operations.filter($ => $.operation !== operation);
        setOperations([...toUpdate]);
        setLoading(false);
    };
    const renderToggleButton = ({ operation, option }) => {
        const active = operations.some($ => $.operation === operation);
        const bgColor = active ? 'bg-green-300' : 'bg-red-300';
        return (react_1.default.createElement("div", { className: `p-2 text-white ${bgColor} cursor-pointer`, onClick: () => {
                const toUpdate = editing || { operation };
                toUpdate[option.key] = !toUpdate[option.key];
                setEditing({ ...toUpdate });
            } }, operation));
    };
    const renderNumberInput = ({ operation, option }) => {
        const value = editing ? editing[option.key] : null;
        return (react_1.default.createElement("div", { className: "flex flex-col" },
            react_1.default.createElement("label", { className: 'capitalize' }, option.key),
            react_1.default.createElement("input", { type: "number", min: "0.3", max: "1000", step: "0.1", value: value, className: "p-2 text-black bg-white border border-black-200", placeholder: 'eg. 10', onBlur: ({ target }) => {
                    const toUpdate = editing || { operation };
                    toUpdate[option.key] = parseInt(target.value);
                    setEditing({ ...toUpdate });
                } })));
    };
    const renderTextInput = ({ operation, option }) => {
        const value = editing ? editing[option.key] : null;
        return (react_1.default.createElement("div", { className: "flex flex-col" },
            react_1.default.createElement("label", { className: 'capitalize' }, option.key),
            react_1.default.createElement("input", { type: "text", value: value, placeholder: option.default || '', className: "p-2 text-black bg-white border border-black-200", onBlur: ({ target }) => {
                    const toUpdate = editing || { operation };
                    toUpdate[option.key] = target.value;
                    setEditing({ ...toUpdate });
                } })));
    };
    const renderImage = () => {
        return (react_1.default.createElement("div", { className: "relative" },
            loading && (react_1.default.createElement("div", { className: "absolute flex items-center justify-center w-full h-full bg-black rounded-xl opacity-60" },
                react_1.default.createElement("div", { className: "flex space-x-4" },
                    react_1.default.createElement("div", null, "Processing..."),
                    react_1.default.createElement(fa_1.FaCircleNotch, { size: 24, className: "border-b-4 border-green-900" })))),
            react_1.default.createElement("img", { src: generateUrl, className: "w-full" })));
    };
    const generateUrl = `${baseUrl}?operations=${encodeURI(JSON.stringify(operations))}`;
    console.log('>>>', operations);
    console.log('editing >>>', editing);
    const renderOperationWithOptions = ({ operation, options }) => {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("label", { className: 'capitalize' }, operation),
            react_1.default.createElement("div", { className: "flex space-x-2" }, options.map(option => {
                if (option.type === 'boolean') {
                    return renderToggleButton({ operation, option });
                }
                if (option.type === 'string')
                    return renderTextInput({ operation, option });
                if (option.type === 'number')
                    return renderNumberInput({ operation, option });
                return null;
            }))));
    };
    const renderOperation = () => {
        if (!option.length)
            return null;
        const { operation, options } = types_1.default.filter($ => $.operation === option)[0];
        if (!options || !options.length) {
            const toUpdate = operations;
            const toAdd = {};
            // @ts-ignore
            toAdd.operation = `${operation}`;
            // @ts-ignore
            toUpdate.splice(1, 0, { ...toAdd });
            setOperations([...toUpdate]);
            setOption(null);
            return null;
        }
        return renderOperationWithOptions({ operation, options });
    };
    console.log(option);
    return (react_1.default.createElement("div", { className: "w-full" },
        react_1.default.createElement("div", { className: "flex flex-col space-y-4" },
            react_1.default.createElement("div", { className: "w-full" }, renderImage()),
            react_1.default.createElement("div", { className: "flex space-x-4" }, operations.map($ => (react_1.default.createElement("div", { className: 'px-2 bg-green-500 text-white flex space-x-2 z-10' },
                react_1.default.createElement("div", { onClick: () => {
                        setOption($.operation);
                        setEditing({ ...$ });
                    } },
                    react_1.default.createElement("div", null, $.operation)),
                react_1.default.createElement("div", { className: "cursor-pointer", onClick: () => removeOperation($.operation) }, "x"))))),
            react_1.default.createElement("div", { className: "flex justify-around w-full space-x-4" },
                react_1.default.createElement("div", { className: "flex flex-col w-full space-y-2" },
                    react_1.default.createElement("label", { className: "text-sm text-gray-500" }, "Input Type")),
                react_1.default.createElement("div", { className: "flex flex-col w-full space-y-2" },
                    react_1.default.createElement("label", { className: "text-sm text-gray-500" }, "Image Operations"),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("select", { onChange: e => setOption(e.target.value) },
                            react_1.default.createElement("option", { value: '' }, "--Please choose an option--"),
                            types_1.default.map(({ operation }) => {
                                return react_1.default.createElement("option", { value: operation }, operation);
                            }))),
                    !!option && (react_1.default.createElement(react_1.default.Fragment, null,
                        renderOperation(),
                        react_1.default.createElement("div", { className: "px-4 text-white bg-green-400 pointer-cursor", onClick: () => addOperation() }, "Add Operation"))))),
            react_1.default.createElement("div", { className: "justify-center p-4" }, generateUrl))));
};
exports.default = InteractiveExample;
