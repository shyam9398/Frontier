async function test() {
  try {
    const arxivId = "2403.08295"; // A popular paper, e.g. Claude 3 or Gemini 1.5
    console.log(`Fetching Semantic Scholar for arXiv:${arxivId}...`);
    const res = await fetch(`https://api.semanticscholar.org/graph/v1/paper/arXiv:${arxivId}?fields=title,abstract,authors,year,citationCount,referenceCount,url,s2FieldsOfStudy,publicationTypes,publicationDate,fieldsOfStudy,citations,references`);
    console.log("Status:", res.status);
    if (res.ok) {
      const data = await res.json();
      console.log("Keys returned:", Object.keys(data));
      console.log("Citation count:", data.citationCount);
      console.log("Reference count:", data.referenceCount);
      console.log("Fields of study:", data.fieldsOfStudy);
      console.log("s2FieldsOfStudy:", data.s2FieldsOfStudy);
      if (data.citations) {
        console.log("Citations sample length:", data.citations.length);
        console.log("Citations sample:", data.citations.slice(0, 3));
      }
      if (data.references) {
        console.log("References sample length:", data.references.length);
        console.log("References sample:", data.references.slice(0, 3));
      }
    }
  } catch (err) {
    console.error("Failed:", err);
  }
}
test();
