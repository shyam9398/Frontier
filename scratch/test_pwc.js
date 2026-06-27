async function test() {
  try {
    const arxivId = "2606.22197"; // Let's try to fetch details for a paper that is likely to have github repos and datasets
    // Wait, let's search for a paper with a lot of github links. How about "2403.08295" or something popular, or we can fetch a few from daily papers and inspect them
    const res = await fetch("https://huggingface.co/api/daily_papers?limit=5");
    if (res.ok) {
      const data = await res.json();
      for (const item of data) {
        const id = item.paper.id;
        console.log(`\n=================== ID: ${id} Title: ${item.paper.title} ===================`);
        const detailsRes = await fetch(`https://huggingface.co/api/papers/${id}`);
        if (detailsRes.ok) {
          const details = await detailsRes.json();
          console.log("GitHub Repository:", details.github || details.githubUrl || details.repository || details.code || "Not found directly");
          console.log("Keys available in details:", Object.keys(details));
          if (details.linkedModels) {
            console.log("Linked Models count:", details.linkedModels.length);
            if (details.linkedModels.length > 0) {
              console.log("Linked Models sample:", details.linkedModels[0]);
            }
          }
          if (details.linkedDatasets) {
            console.log("Linked Datasets count:", details.linkedDatasets.length);
            if (details.linkedDatasets.length > 0) {
              console.log("Linked Datasets sample:", details.linkedDatasets[0]);
            }
          }
          if (details.linkedSpaces) {
            console.log("Linked Spaces count:", details.linkedSpaces.length);
            if (details.linkedSpaces.length > 0) {
              console.log("Linked Spaces sample:", details.linkedSpaces[0]);
            }
          }
          // Let's print the entire details JSON to search for any other links
          console.log("Full details JSON length:", JSON.stringify(details).length);
          // Let's search if "github" is in the details JSON
          const str = JSON.stringify(details);
          const index = str.indexOf("github.com");
          if (index !== -1) {
            console.log("github.com found in details at index:", index, str.substring(index - 50, index + 100));
          } else {
            console.log("github.com NOT found in details string");
          }
        }
      }
    }
  } catch (err) {
    console.error("Test failed:", err);
  }
}
test();
