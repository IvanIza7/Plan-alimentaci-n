const fs = require('fs');

let code = fs.readFileSync('src/components/ProgressView.tsx', 'utf-8');

const target = `<div className="grid grid-cols-2 gap-4 mt-2">
              <CompCard label="% GRASA" value="18.2%" range="Rango: 8-20%" />
              <CompCard label="MASA GRASA" value="15.2 kg" range="Rango: 4.7-13.6 kg" />
              <CompCard label="MASA MAGRA" value="52.8 kg" range="Rango: Objetivo" />
              <CompCard label="AGUA TOTAL" value="58.1%" range="Rango: Referencia" />
              <CompCard label="BMR" value="1680" range="Rango: kcal/día" full />
           </div>`;

const replacement = `<div className="grid grid-cols-2 gap-4 mt-2">
              <CompCard label="ALTURA" value="1.75 m" range="Rango: Estándar" />
              <CompCard label="PESO" value="68.0 kg" range="Rango: Objetivo 65kg" />
              <CompCard label="BMI" value="22.2" range="Rango: 18.5-24.9" />
              <CompCard label="% DE GRASA" value="18.2%" range="Rango: 8-20%" />
              <CompCard label="GAMA DESEABLE % GRASA" value="12-20%" range="Objetivo Saludable" full />
              <CompCard label="MASA GRASA" value="12.4 kg" range="Rango: 4.7-13.6 kg" />
              <CompCard label="MASA LIBRE DE GRASA" value="55.6 kg" range="Rango: Referencia" />
              <CompCard label="AGUA TOTAL" value="58.1%" range="Rango: 50-65%" />
              <CompCard label="IMPEDANCIA" value="520 Ω" range="Rango: Normal" />
              <CompCard label="BMR" value="1680" range="kcal/día" full />
           </div>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/ProgressView.tsx', code, 'utf-8');
