import axios from 'axios';

const PRINTIFY_API_URL = 'https://api.printify.com/v1';
const PRINTIFY_JWT_TOKEN = process.env.PRINTIFY_JWT_TOKEN;

const printifyClient = axios.create({
  baseURL: PRINTIFY_API_URL,
  headers: {
    Authorization: `Bearer ${PRINTIFY_JWT_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export interface PrintifyProduct {
  id: string;
  title: string;
  description?: string;
  images?: Array<{ src: string }>;
  variants?: Array<{
    id: string;
    title: string;
    price: number;
    sku?: string;
  }>;
}

export interface PrintifyOrder {
  id: string;
  external_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function getShops() {
  try {
    const response = await printifyClient.get('/shops.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching Printify shops:', error);
    throw error;
  }
}

export async function getProducts(shopId: string) {
  try {
    const response = await printifyClient.get(`/shops/${shopId}/products.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Printify products:', error);
    throw error;
  }
}

export async function getProduct(shopId: string, productId: string) {
  try {
    const response = await printifyClient.get(`/shops/${shopId}/products/${productId}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Printify product:', error);
    throw error;
  }
}

export async function createOrder(shopId: string, orderData: any) {
  try {
    const response = await printifyClient.post(`/shops/${shopId}/orders.json`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating Printify order:', error);
    throw error;
  }
}

export async function getOrder(shopId: string, orderId: string) {
  try {
    const response = await printifyClient.get(`/shops/${shopId}/orders/${orderId}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Printify order:', error);
    throw error;
  }
}

export async function cancelOrder(shopId: string, orderId: string) {
  try {
    const response = await printifyClient.delete(`/shops/${shopId}/orders/${orderId}.json`);
    return response.data;
  } catch (error) {
    console.error('Error canceling Printify order:', error);
    throw error;
  }
}

export default printifyClient;
