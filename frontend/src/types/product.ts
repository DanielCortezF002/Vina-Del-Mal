export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  category: string;
  categorySlug: string;
  brand: string;
  alcoholPercentage: number | null;
  imageUrl: string;
  isActive: boolean;
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  brand: string;
  minAlcohol: number;
  maxAlcohol: number;
  search: string;
}

export const CATEGORIES = [
  { label: 'Todos', slug: '' },
  { label: 'Vinos', slug: 'vinos' },
  { label: 'Whisky', slug: 'whisky' },
  { label: 'Gin', slug: 'gin' },
  { label: 'Vodka', slug: 'vodka' },
  { label: 'Tequila', slug: 'tequila' },
  { label: 'Ron', slug: 'ron' },
  { label: 'Cerveza', slug: 'cerveza' },
  { label: 'Espumante', slug: 'espumante' },
];

export const BRANDS = [
  'Johnnie Walker', 'Don Melchor', "Hendrick's", 'Grey Goose',
  'Don Julio', 'Absolut', 'Bacardi', 'Jack Daniel\'s', 'Moët & Chandon',
];

// Datos mock para desarrollo — reemplazar con GET /api/v1/products
export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Whisky Johnnie Walker Blue Label', slug: 'jw-blue', price: 215000, category: 'Whisky', categorySlug: 'whisky', brand: 'Johnnie Walker', alcoholPercentage: 40, imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop', isActive: true },
  { id: 2, name: 'Vino Don Melchor Cabernet Sauvignon', slug: 'don-melchor', price: 120000, category: 'Vinos', categorySlug: 'vinos', brand: 'Don Melchor', alcoholPercentage: 14.5, imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop', isActive: true },
  { id: 3, name: "Gin Hendrick's", slug: 'hendricks', price: 35000, category: 'Gin', categorySlug: 'gin', brand: "Hendrick's", alcoholPercentage: 41.4, imageUrl: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?q=80&w=600&auto=format&fit=crop', isActive: true },
  { id: 4, name: 'Vodka Grey Goose', slug: 'grey-goose', price: 42000, category: 'Vodka', categorySlug: 'vodka', brand: 'Grey Goose', alcoholPercentage: 40, imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=600&auto=format&fit=crop', isActive: true },
  { id: 5, name: 'Tequila Don Julio 1942', slug: 'don-julio-1942', price: 185000, category: 'Tequila', categorySlug: 'tequila', brand: 'Don Julio', alcoholPercentage: 38, imageUrl: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?q=80&w=600&auto=format&fit=crop', isActive: true },
  { id: 6, name: 'Vodka Absolut', slug: 'absolut', price: 18000, category: 'Vodka', categorySlug: 'vodka', brand: 'Absolut', alcoholPercentage: 40, imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=600&auto=format&fit=crop', isActive: true },
  { id: 7, name: "Jack Daniel's Old No. 7", slug: 'jack-daniels', price: 28000, category: 'Whisky', categorySlug: 'whisky', brand: "Jack Daniel's", alcoholPercentage: 40, imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=600&auto=format&fit=crop', isActive: true },
  { id: 8, name: 'Espumante Moët & Chandon Brut', slug: 'moet-brut', price: 72000, category: 'Espumante', categorySlug: 'espumante', brand: 'Moët & Chandon', alcoholPercentage: 12, imageUrl: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?q=80&w=600&auto=format&fit=crop', isActive: true },
  { id: 9, name: 'Ron Bacardi Carta Blanca', slug: 'bacardi-blanca', price: 12000, category: 'Ron', categorySlug: 'ron', brand: 'Bacardi', alcoholPercentage: 37.5, imageUrl: 'https://images.unsplash.com/photo-1562601579-599dec564e06?q=80&w=600&auto=format&fit=crop', isActive: true },
  { id: 10, name: 'Whisky Johnnie Walker Black Label', slug: 'jw-black', price: 38000, category: 'Whisky', categorySlug: 'whisky', brand: 'Johnnie Walker', alcoholPercentage: 40, imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop', isActive: true },
  { id: 11, name: 'Vino Casillero del Diablo Reserva', slug: 'casillero-reserva', price: 9500, category: 'Vinos', categorySlug: 'vinos', brand: 'Casillero del Diablo', alcoholPercentage: 13.5, imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop', isActive: true },
  { id: 12, name: 'Gin Tanqueray London Dry', slug: 'tanqueray', price: 28000, category: 'Gin', categorySlug: 'gin', brand: 'Tanqueray', alcoholPercentage: 43.1, imageUrl: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?q=80&w=600&auto=format&fit=crop', isActive: true },
];
