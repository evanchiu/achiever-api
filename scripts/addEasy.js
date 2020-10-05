#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const dbFile = "../daily/dailydb.json";
const easyTSV = "easy.tsv";

async function main() {
  // Read database
  const db = JSON.parse(fs.readFileSync(dbFile, { encoding: "utf8" }));
  const lines = fs.readFileSync(easyTSV, { encoding: "utf8" }).split("\n");
  console.log(`loading ${lines.length} lines`);

  let region = "";
  let prevType = "";

  for (const line of lines) {
    const [lineType, location, notes] = line.split("\t");

    // Check for region heading
    if (!location && !notes) {
      region = lineType;
      continue;
    }

    // Load type of this line and save it for the next line
    const type = lineType || prevType;
    prevType = type;

    console.log(region, type, location, notes);

    // Fix up name for certain data
    let name = `Daily ${region} ${type}`;
    if (region === "Maguuma") {
      name = `Daily ${region} Jungle ${type}`;
    }
    if (type === "Vista") {
      name = `Daily ${region} ${type} Viewer`;
    }

    // Look up achievement
    const achiev = Object.values(db).find((a) => a.name === name);
    if (!achiev) {
      console.log(`  No achievement found for "Daily ${region} ${type}"\n\n\n`);
    } else {
      console.log(`  got ${achiev.id}`);
    }

    // Update achievement
    if (achiev.locations) {
      db[achiev.id].locations.push({
        location: location.trim().replace(/^"/, "").replace(/"$/, ""),
        notes: notes.trim().replace(/^"/, "").replace(/"$/, ""),
      });
      db[achiev.id].minutes = 1;
    } else {
      db[achiev.id].locations = [
        {
          location: location.trim().replace(/^"/, "").replace(/"$/, ""),
          notes: notes.trim().replace(/^"/, "").replace(/"$/, ""),
        },
      ];
      db[achiev.id].minutes = 1;
    }
  }

  fs.writeFileSync(dbFile, JSON.stringify(db, undefined, 2) + "\n");
  console.log(`Updated ${dbFile}`);
}

// "main" function
if (require.main === module) {
  main();
}
