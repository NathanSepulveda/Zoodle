import { connectToDatabase } from "../../util/mongodb";
import cheerio from "cheerio";


export default async (req, res) => {

    const { search } = req.query;
    console.log(search);

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
        taxonomy["Class"] = titleText.siblings().text().split("\n")[0];
      }
      if (titleText.text().includes("Order:\n")) {
        taxonomy["Order"] = titleText.siblings().text().split("\n")[0];
      }
      if (titleText.text().includes("Family:\n")) {
        taxonomy["Family"] = titleText.siblings().text().split("\n")[0];
      }
      if (titleText.text().includes("Genus:\n")) {
        taxonomy["Genus"] = titleText.siblings().text().split("\n")[0];
      }
      if (titleText.text().includes("Species:\n")) {
        taxonomy["Species"] = titleText.siblings().text().split("\n")[0].split("[")[0];
      }
    });

  const { db } = await connectToDatabase();

  const movies = await db
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
    .find({CommonName: "tiger"})
    .limit(2)
    .toArray();

  res.json(movies);
};