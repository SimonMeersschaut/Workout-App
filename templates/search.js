function searchEngine(query, possibleResults) {
  // Function to calculate similarity score between two strings
  function calculateScore(str1, str2) {
    const normalizeString = (str) => str.toLowerCase().replace(/\s/g, '');
    const normalizedQuery = normalizeString(query);
    const normalizedResult = normalizeString(str2);

    let score = 0;
    for (let i = 0; i < Math.min(normalizedQuery.length, normalizedResult.length); i++) {
      if (normalizedQuery[i] === normalizedResult[i]) {
        score++;
      }
    }

    return score / Math.max(normalizedQuery.length, normalizedResult.length);
  }

  // Array to store results with scores
  const resultsWithScores = [];

  // Calculate scores for each possible result
  for (const result of possibleResults) {
    const score = calculateScore(query, result);
    resultsWithScores.push({ result, score });
  }

  // Sort results based on scores in descending order
  resultsWithScores.sort((a, b) => b.score - a.score);

  // Return the top three results with scores
  return resultsWithScores.slice(0, 3);
}