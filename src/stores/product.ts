import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

interface IProduct {
  ID: string;
  Name: string;
  Description: string;
  StockQuantity: number;
  Manufacturer: string;
  ExpirationDate: string;
  BatchNumber: string;
  Category: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const useProductStore = defineStore('product', () => {
  const products = ref<IProduct[]>([]); // Lista de produtos
  const isLoading = ref(false);

  // Computed para buscar produtos por categoria
  const productsByCategory = computed(() => {
    const grouped: Record<string, IProduct[]> = {};
    products.value.forEach((product) => {
      const category = product.Category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  });

  // Carregar produtos da API
  async function fetchProducts() {
    isLoading.value = true;
    try {
      const response = await fetch(
        'https://naked-eydie-bellos-tech-3517c645.koyeb.app/products',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: IProduct[] = await response.json();
      products.value = data;
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    products,
    productsByCategory,
    isLoading,
    fetchProducts,
  };
});
