import { lvlData } from "./lvlData.js";
import fs from 'fs';


for (let i = -100; i < lvlData.length; i++) {
    const level = lvlData[i];

    if (!level) continue; // skip empty indices
    const output = { id: i, ...level };
    const fileName = `${String(i).padStart(2, '0')}${level.about.name.replace(/ +/g, "")}.json5`;
    fs.writeFileSync('levels/' + fileName, stringifyTopLevelOnly(output));
    console.log(`✅ Saved ${fileName}`);
}

function stringifyTopLevelOnly(obj) {
  let result = '{\n';
  const entries = Object.entries(obj);
  entries.forEach(([key, value], index) => {
    let formattedValue;
    if (typeof value === 'object' && value !== null) {
      formattedValue = JSON.stringify(value); // no indentation inside
    } else if (typeof value === 'string') {
      formattedValue = `"${value}"`;
    } else {
      formattedValue = value;
    }

    result += `  "${key}": ${formattedValue}`;
    if (index < entries.length - 1) result += ',';
    result += '\n';
  });
  result += '}';
  return result;
}