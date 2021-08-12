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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const InteractiveExample = () => {
    // const [url, setUrl] = useState('https://tinyurl.com/hkeujyyz');
    const [url, setUrl] = react_1.useState('https://europe-west2-extensions-testing.cloudfunctions.net/ext-storage-image-processing-api-handler/process/input~type:create~width:200~height:100/flatten~background:black/text~value:Invertase/output~format:jpeg');
    const [loading, setLoading] = react_1.useState(false);
    const onChange = (regex, value) => {
        const newUrl = url.replace(regex, value);
        console.log('Updating >>>', regex, value, newUrl);
        setLoading(true);
        setUrl(newUrl);
        setLoading(false);
    };
    return (<div className="w-full">
      <div className="flex flex-col space-y-4">
        <div>
          {loading ? (<div>Loading...</div>) : (<img src={url} className="w-full"/>)}
        </div>
        <div className="flex justify-around w-full">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Image Type</label>
            <select className="border-4 border-blue-500 border-opacity-25 text-sm text-gray-500">
              <option value="create">Creation</option>
              <option value="source">Exisiting</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Height (px)</label>
            <input type="number" className="border-4 border-blue-500 border-opacity-25" onChange={({ target }) => onChange(/text~value:[a-zA-Z]*/, `text~value:${target.value}`)}/>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Width (px)</label>
            <input type="number" className="border-4 border-blue-500 border-opacity-25"/>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500">Text</label>
            <input type="text" className="border-4 border-blue-500 border-opacity-25" onChange={({ target }) => onChange(/text~value:[a-zA-Z]*/, `text~value:${target.value}`)}/>
          </div>
        </div>

        <div className="flex justify-center p-4">{url}</div>
      </div>
    </div>);
};
exports.default = InteractiveExample;
