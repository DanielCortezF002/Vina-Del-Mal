import type { Branch, SalesDataPoint, TopProduct, PendingOrder, StockItem, StockMovement } from '@/types/sprint2';

export const BRANCHES: Branch[] = [
  { id: 'stgo-centro', name: 'Santiago Centro', address: 'Av. Libertador Bernardo O\'Higgins 1234', commune: 'Santiago', deliveryFee: 1990, estimatedMinutes: 30, isOpen: true },
  { id: 'providencia', name: 'Providencia', address: 'Av. Providencia 2345, Local 12', commune: 'Providencia', deliveryFee: 2490, estimatedMinutes: 35, isOpen: true },
  { id: 'las-condes', name: 'Las Condes', address: 'Av. Apoquindo 3456', commune: 'Las Condes', deliveryFee: 2990, estimatedMinutes: 45, isOpen: true },
  { id: 'nunoa', name: 'Ñuñoa', address: 'Av. Irarrázaval 890', commune: 'Ñuñoa', deliveryFee: 2190, estimatedMinutes: 30, isOpen: true },
  { id: 'maipu', name: 'Maipú', address: 'Av. Pajaritos 2109', commune: 'Maipú', deliveryFee: 3490, estimatedMinutes: 55, isOpen: false },
];

// Mock analytics data — replace with GET /admin/analytics when backend is ready
export const MOCK_SALES_DAILY: SalesDataPoint[] = [
  { label: 'Lun', ventas: 420000, ordenes: 18 },
  { label: 'Mar', ventas: 380000, ordenes: 14 },
  { label: 'Mié', ventas: 510000, ordenes: 22 },
  { label: 'Jue', ventas: 640000, ordenes: 27 },
  { label: 'Vie', ventas: 920000, ordenes: 41 },
  { label: 'Sáb', ventas: 1150000, ordenes: 53 },
  { label: 'Dom', ventas: 0, ordenes: 0 },
];

export const MOCK_SALES_WEEKLY: SalesDataPoint[] = [
  { label: 'Sem 1', ventas: 3200000, ordenes: 142 },
  { label: 'Sem 2', ventas: 2800000, ordenes: 118 },
  { label: 'Sem 3', ventas: 4100000, ordenes: 187 },
  { label: 'Sem 4', ventas: 3750000, ordenes: 165 },
];

export const MOCK_SALES_MONTHLY: SalesDataPoint[] = [
  { label: 'Ene', ventas: 12500000, ordenes: 542 },
  { label: 'Feb', ventas: 10800000, ordenes: 468 },
  { label: 'Mar', ventas: 13200000, ordenes: 587 },
  { label: 'Abr', ventas: 11900000, ordenes: 512 },
  { label: 'May', ventas: 14800000, ordenes: 634 },
];

export const MOCK_TOP_PRODUCTS: TopProduct[] = [
  { id: 1, name: 'Whisky JW Blue Label', imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=80', unitsSold: 94, revenue: 20210000 },
  { id: 5, name: 'Tequila Don Julio 1942', imageUrl: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?w=80', unitsSold: 81, revenue: 14985000 },
  { id: 3, name: "Gin Hendrick's", imageUrl: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?w=80', unitsSold: 156, revenue: 5460000 },
  { id: 4, name: 'Vodka Grey Goose', imageUrl: 'https://images.unsplash.com/photo-1614316131362-e6e22f280a74?w=80', unitsSold: 143, revenue: 6006000 },
  { id: 2, name: 'Vino Don Melchor Cab.', imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=80', unitsSold: 78, revenue: 9360000 },
  { id: 7, name: "Jack Daniel's No. 7", imageUrl: 'https://images.unsplash.com/photo-1620037458978-ce98d7c7c2d2?w=80', unitsSold: 201, revenue: 5628000 },
  { id: 8, name: 'Moët & Chandon Brut', imageUrl: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=80', unitsSold: 67, revenue: 4824000 },
  { id: 9, name: 'Bacardi Carta Blanca', imageUrl: 'https://images.unsplash.com/photo-1562601579-599dec564e06?w=80', unitsSold: 312, revenue: 3744000 },
  { id: 6, name: 'Vodka Absolut', imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=80', unitsSold: 289, revenue: 5202000 },
  { id: 10, name: 'Whisky JW Black Label', imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=80', unitsSold: 178, revenue: 6764000 },
];

export const MOCK_PENDING_ORDERS: PendingOrder[] = [
  { id: 'ORD-2024-001', customerEmail: 'carlos@gmail.com', total: 215000, itemCount: 1, createdAt: '2026-05-18T14:32:00Z', commune: 'Providencia' },
  { id: 'ORD-2024-002', customerEmail: 'maria@hotmail.com', total: 47990, itemCount: 3, createdAt: '2026-05-18T15:10:00Z', commune: 'Las Condes' },
  { id: 'ORD-2024-003', customerEmail: 'pablo@empresa.cl', total: 123000, itemCount: 2, createdAt: '2026-05-18T16:05:00Z', commune: 'Santiago' },
  { id: 'ORD-2024-004', customerEmail: 'ana@gmail.com', total: 85990, itemCount: 4, createdAt: '2026-05-18T16:48:00Z', commune: 'Ñuñoa' },
];

export const MOCK_STOCK: StockItem[] = [
  { productId: 1, productName: 'Whisky JW Blue Label', imageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=60', branch: 'Santiago Centro', currentStock: 3, minStockAlert: 5, lastMovement: '2026-05-17' },
  { productId: 2, productName: 'Vino Don Melchor', imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=60', branch: 'Providencia', currentStock: 8, minStockAlert: 10, lastMovement: '2026-05-18' },
  { productId: 3, productName: "Gin Hendrick's", imageUrl: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?w=60', branch: 'Las Condes', currentStock: 12, minStockAlert: 8, lastMovement: '2026-05-16' },
  { productId: 5, productName: 'Tequila Don Julio 1942', imageUrl: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?w=60', branch: 'Santiago Centro', currentStock: 2, minStockAlert: 4, lastMovement: '2026-05-18' },
  { productId: 9, productName: 'Bacardi Carta Blanca', imageUrl: 'https://images.unsplash.com/photo-1562601579-599dec564e06?w=60', branch: 'Maipú', currentStock: 0, minStockAlert: 6, lastMovement: '2026-05-15' },
];

export const MOCK_MOVEMENTS: StockMovement[] = [
  { id: 'MOV-001', productName: 'Whisky JW Blue Label', type: 'salida', quantity: 2, reason: 'Orden ORD-2024-001', branch: 'Santiago Centro', operatorName: 'Admin', createdAt: '2026-05-18T14:35:00Z' },
  { id: 'MOV-002', productName: 'Bacardi Carta Blanca', type: 'entrada', quantity: 24, reason: 'Reposición proveedor', branch: 'Ñuñoa', operatorName: 'Bodega', createdAt: '2026-05-18T10:00:00Z' },
  { id: 'MOV-003', productName: 'Vino Don Melchor', type: 'ajuste', quantity: 1, reason: 'Botella dañada en transporte', branch: 'Providencia', operatorName: 'Admin', createdAt: '2026-05-17T16:20:00Z' },
  { id: 'MOV-004', productName: 'Tequila Don Julio 1942', type: 'salida', quantity: 1, reason: 'Orden ORD-2024-003', branch: 'Santiago Centro', operatorName: 'Admin', createdAt: '2026-05-18T16:07:00Z' },
];
