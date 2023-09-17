import { generateRandomTable, TableData } from "./seatingUtilities";
import { calculateFitness } from "./fitnessFunction";
import { mutate } from "./mutateFunction";

// Function to initialize a random table arrangement for remaining guests
function createRemainingGuestsTableData(
  remainingGuests: any[],
  sizeNormalTablesNumber: number
): TableData[] {
  return generateRandomTable(remainingGuests, sizeNormalTablesNumber);
}

// Function to select the best parent based on fitness
function selectBestParent(population: TableData[][], fitnessScores: number[]): TableData[] {
  const sortedIndices = fitnessScores.map((score, index) => ({index, score}))
                                     .sort((a, b) => b.score - a.score)
                                     .map(({index}) => index);
  const bestParent = population[sortedIndices[0]];
  return bestParent;
}

// Function to create the next generation solely based on mutations
function nextGenerationWithMutation(
  bestParent: TableData[],
  populationSize: number,
  remainingGuests: any[],
  maxTableSize: number  // New parameter here
): TableData[][] {
  const newGeneration = Array.from({ length: populationSize }, () => JSON.parse(JSON.stringify(bestParent)));
  return mutate(newGeneration, remainingGuests, maxTableSize);  // Added maxTableSize here
}


// Main Genetic Algorithm function
export function runGeneticAlgorithm(
  remainingGuests: any[],
  sizeNormalTablesNumber: number,
  numNormalTableNumber: number,
  uniqueRelationships: Set<string> // New parameter
): TableData[] {

  // Initialize population

  const numGenerations: number = 50
  const populationSize: number = 2000

  let population: TableData[][] = [];
  for (let i = 0; i < populationSize * 100; i++) {
    const newTableData = createRemainingGuestsTableData(
      remainingGuests,
      sizeNormalTablesNumber
    );
    population.push(newTableData);
  }

  // Main GA loop
  for (let generation = 0; generation < numGenerations; generation++) {
    const fitnessScores = population.map(member => calculateFitness(member, remainingGuests, sizeNormalTablesNumber, uniqueRelationships // New parameter
    )); // 
    console.log(`Generation ${generation} Fitness scores: `, [...fitnessScores].sort((a, b) => b - a));

    const bestParent = selectBestParent(population, fitnessScores);
    
    // Create next generation but leave one slot for the best parent
    const newGeneration = nextGenerationWithMutation(bestParent, populationSize - 1, remainingGuests, sizeNormalTablesNumber);  // Added sizeNormalTablesNumber here
    
    // Include the best parent to preserve it
    newGeneration.push(JSON.parse(JSON.stringify(bestParent)));
    
    population = newGeneration;
  }

  // Sort the final population based on fitness and return the best solution
  const finalFitnessScores = population.map(member => calculateFitness(member, remainingGuests, sizeNormalTablesNumber, uniqueRelationships));
  const bestSolutionIndex = finalFitnessScores.indexOf(Math.max(...finalFitnessScores));
  return population[bestSolutionIndex];
}
