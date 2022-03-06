import cheerio from "cheerio";
import { connectToDatabase } from "../../util/mongodb";

export default async function handler(req, res) {
  const { search } = req.query;
  console.log(search);

  const { db } = await connectToDatabase();
  const animal = await db
    .collection("discovered_animals")
    // .insertOne({
    //     Kingdom: "Animalia",
    //     Phylum: "Chordata",
    //     Class: "Mammalia",
    //     Order: "Carnivora",
    //     Family: "Felidae",
    //     Genus: "Panthera",
    //     Species: "P. tigris"
    // })
    .find({ CommonName: search })
    .toArray();

  if (animal.length > 0) {
    res.json(animal[0]);
  } else {
    const response = await fetch(`https://en.wikipedia.org/wiki/${search}`);
    // using await to ensure that the promise resolves
    const body = await response.text();

    const $ = cheerio.load(body);
    const taxonomy = {};

    $(".biota tr td").each((i, title) => {
      const titleNode = $(title);
      const titleText = titleNode;
      if (titleText.text().includes("Kingdom:\n")) {
        taxonomy["Kingdom"] = titleText.siblings().text().split("\n")[0];
      }
      if (titleText.text().includes("Phylum:\n")) {
        taxonomy["Phylum"] = titleText.siblings().text().split("\n")[0];
      }
      if (titleText.text().includes("Class:\n")) {
        taxonomy["Class"] = titleText.siblings().text().split("\n")[0].split(",")[0];
      }
      if (titleText.text().includes("Order:\n")) {
        taxonomy["Order"] = titleText.siblings().text().split("\n")[0];
      }
      if (titleText.text().includes("Family:\n")) {
        taxonomy["Family"] = titleText.siblings().text().split("\n")[0].split(",")[0];
      }
      if (titleText.text().includes("Genus:\n")) {
        taxonomy["Genus"] = titleText.siblings().text().split("\n")[0].split(",")[0];
      }
      if (titleText.text().includes("Species:\n")) {
        taxonomy["Species"] = titleText
          .siblings()
          .text()
          .split("\n")[0]
          .split("[")[0];
      }
    });

    if (taxonomy.Kingdom !== "Animalia") {
        res.status(400).json(taxonomy);
    } else {

        taxonomy.CommonName = search.replace("_", " ");

        const animal = await db
          .collection("discovered_animals")
          .insertOne((taxonomy));
    }

    res.status(200).json(taxonomy);
  }
}


