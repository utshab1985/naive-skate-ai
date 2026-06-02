import fs from 'fs';
import path from 'path';
import { MOCK_PRODUCTS } from '../lib/local/data';

async function exportProducts() {
  try {
    const products = MOCK_PRODUCTS;
    const outputPath = path.join(process.cwd(), 'reference/products.json');
    const dataDir = path.dirname(outputPath);

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write products to JSON file
    fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

    console.log(`✅ Exported ${products.length} products to ${outputPath}`);
    console.log(`   Total variants: ${products.reduce((sum, p) => sum + p.variants.length, 0)}`);
  } catch (error) {
    console.error('Error exporting products:', error);
    process.exit(1);
  }
}

exportProducts();
