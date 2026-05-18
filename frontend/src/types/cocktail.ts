export interface CocktailIngredient {
  name: string;
  amount: string;
  unit: string;
  productSlug?: string; // link to catalog
}

export interface Cocktail {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  difficulty: 'fácil' | 'medio' | 'difícil';
  prepTime: number; // minutes
  tags: string[];
  baseSpirit: string;
  ingredients: CocktailIngredient[];
  steps: string[];
  glassType: string;
}

export const DIFFICULTY_COLORS: Record<Cocktail['difficulty'], string> = {
  'fácil': 'text-green-400 bg-green-400/10 border-green-400/30',
  'medio': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'difícil': 'text-red-400 bg-red-400/10 border-red-400/30',
};

export const BASE_SPIRITS = [
  'Todos', 'Pisco', 'Ron', 'Gin', 'Vodka', 'Whisky',
  'Tequila', 'Campari', 'Aperol', 'Vino', 'Cerveza',
];
