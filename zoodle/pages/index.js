import Head from "next/head";
import React, { useState, useEffect } from "react";
export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({});

  let handleChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  let search = () => {
    let formattedSearchTerm = searchTerm.replace(" ", "_")
    fetch(`http://localhost:3000/api/get-animal?search=${formattedSearchTerm}`)
      .then((response) => response.json())
      .then((response) => {
        setSearchResults(response);
      });
  };
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <input type={"text"} onChange={handleChange} />
        <button disabled={searchTerm === ""} onClick={search}>
          Search
        </button>
        <div>
          {Object.keys(searchResults).map(function (key) {
            return (
              <div>
                {key}: {searchResults[key]}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
